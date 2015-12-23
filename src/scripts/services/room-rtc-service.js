'use strict';
/* globals PeerConnectionClient, attachMediaStream, Promise, trace, alert */
angular.module('rooms.service.rtc', ['app.system', 'app.service.utils']).service('RoomRtcService', [
  'AppSystem', 'appUtils',
  function(AppSystem, appUtils) {
    var SignalingChannel = function(wssUrl) {
      this.wssUrl_ = wssUrl;
      this.websocket_ = null;
      this.authed_ = false;

      // Public options. Keep it sorted.
      this.gettoken = null;
      this.validate = null;

      this.onerror = null;
      this.onmessage = null;
    };

    SignalingChannel.prototype.open = function() {
      if (this.websocket_) {
        trace('ERROR: SignalingChannel has already opened.');
        if (this.gettoken && !this.authed_) {
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      }
      this.authed_ = !this.gettoken;

      trace('Opening signaling channel.');
      return new Promise(function(resolve, reject) {
        this.websocket_ = new WebSocket(this.wssUrl_);

        this.websocket_.onopen = function() {
          trace('Signaling channel opened.');

          this.websocket_.onerror = function() {
            trace('Signaling channel error.');
          };
          this.websocket_.onclose = function(event) {
            // No reconnect here!
            // TODO(tkchin): reconnect to WSS.
            trace('Channel closed with code:' + event.code +
              ' reason:' + event.reason);
            this.websocket_ = null;
          };

          if (this.gettoken) {
            this.send_(this.gettoken());
          } else {
            resolve();
          }
        }.bind(this);

        this.websocket_.onmessage = function(event) {
          trace('WSS->C: ' + event.data);

          if (!this.authed_) {
            this.authed_ = this.validate(event);
            if (this.authed_) {
              resolve();
            } else {
              this.close();
              reject(Error('WebSocket Auth error.'));
            }
            return;
          }

          var message = appUtils.parseJSON(event.data);
          if (!message) {
            trace('Failed to parse WSS message: ' + event.data);
            return;
          }
          if (message.error) {
            trace('Signaling server error message: ' + message.error);
            return;
          }
          this.onmessage(message);
        }.bind(this);

        this.websocket_.onerror = function() {
          reject(Error('WebSocket error.'));
        };
      }.bind(this));
    };

    SignalingChannel.prototype.close = function() {
      // Close WSS means that we're done.
      if (this.websocket_) {
        this.websocket_.close();
        this.websocket_ = null;
      }
    };

    SignalingChannel.prototype.send = function(message) {
      if (!this.websocket_) {
        trace('ERROR: WebSocket not ok.');
        return;
      }
      if (!message.camera) {
        trace('ERROR: No cameraId specialed.');
        return;
      }
      this.send_(message);
    };

    SignalingChannel.prototype.send_ = function(message) {
      trace('C->WSS: ' + JSON.stringify(message));
      this.websocket_.send(JSON.stringify(message));
    };


    var Call = function(cameraId, channel, params) {
      this.cameraId_ = cameraId;
      this.params_ = params;
      this.channel_ = channel;
      this.pcClient_ = null;
      this.startTime = null;
      this.queue_ = [];
      this.video_ = null;
      this.stream_ = null;

      // Public options. Keep it sorted.
      // by startSignaling_
      this.oncallerstarted = null;
      this.onerror = null;
      this.oniceconnectionstatechange = null;
      this.onlocalstreamadded = null;
      this.onnewicecandidate = null;
      this.onremotehangup = null;
      this.onremotesdpset = null;
      this.onremotestreamadded = null;
      this.onremovestream = null;
      this.onsignalingstatechange = null;
      // by origin Call.maybeGetTurnServers_
      this.onstatusmessage = null;
      // by Room
      this.onReceiveSignalingMessage = null;
    };

    // Connects client to the room. This happens by simultaneously requesting
    // media, requesting turn, and join the room. Once all three of those
    // tasks is complete, the signaling process begins. At the same time, a
    // WebSocket connection is opened using |wss_url| followed by a subsequent
    // registration once GAE registration completes.
    Call.prototype.start = function(hasVideo, hasAudio) {
      // Asynchronously open a WebSocket connection to WSS.
      // We don't need to wait for the signaling channel to open before
      // start signaling.
      this.queue_ = [];
      this.startSignaling_(hasVideo, hasAudio);

      return this.channel_.open().then(function() {
        this.flush_();
      }.bind(this)).catch(function(error) {
        this.onError_('WebSocket open error: ' + error.message);
        return Promise.reject(error);
      }.bind(this));
    };

    Call.prototype.hangup = function() {
      if (this.video_) {
        this.video_.src = '';
        this.video_ = null;
      }
      this.stream_ = null;
      this.startTime = null;

      if (this.pcClient_) {
        // HERE we add bye type
        this.sendSignalingMessage_({
          camera: this.cameraId_,
          type: 'bye',
        });
        this.pcClient_.close();
        this.pcClient_ = null;
      }
    };

    Call.prototype.bindto = function(video) {
      if (video) {
        this.video_ = video;
        if (this.stream_) {
          attachMediaStream(this.video_, this.stream_);
          this.video_.play();
        }
      }
    };

    Call.prototype.unbindto = function(video) {
      if (this.video_ === video) {
        this.video_ = null;
      }
    };

    Call.prototype.getPeerConnectionStates = function() {
      if (!this.pcClient_) {
        return null;
      }
      return this.pcClient_.getPeerConnectionStates();
    };

    Call.prototype.getPeerConnectionStats = function(callback) {
      if (!this.pcClient_) {
        return;
      }
      this.pcClient_.getPeerConnectionStats(callback);
    };

    Call.prototype.maybeCreatePcClient_ = function() {
      if (this.pcClient_) {
        return;
      }
      try {
        this.pcClient_ = new PeerConnectionClient(this.params_, this.startTime);
        this.pcClient_.onsignalingmessage = this.sendSignalingMessage_.bind(this);

        this.pcClient_.onremotehangup = this.onRemoteHangup_.bind(this);
        this.pcClient_.onremotesdpset = this.onRemoteSdpSet_.bind(this);
        this.pcClient_.onremotestreamadded = this.onRemoteStreamAdded_.bind(this);
        this.pcClient_.pc_.onremovestream = this.onRemoveStream_.bind(this); // We hack here
        this.pcClient_.onsignalingstatechange = this.onSignalingStateChange_.bind(this);
        this.pcClient_.oniceconnectionstatechange = this.onIceConnectionStateChange_.bind(this);
        this.pcClient_.onnewicecandidate = this.onNewIceCandidate_.bind(this);
        this.pcClient_.onerror = this.onError_.bind(this);

        this.onReceiveSignalingMessage = this.pcClient_.receiveSignalingMessage.bind(this.pcClient_);
        this.pcClient_.filterIceCandidate_ = this.filterIceCandidate_;
        trace('Created PeerConnectionClient');
      } catch (e) {
        this.onError_('Create PeerConnection exception: ' + e.message);
        alert('Cannot create RTCPeerConnection; WebRTC is not supported by this browser.');
        return;
      }
    };

    // Allow tcp candidate
    Call.prototype.filterIceCandidate_ = function() {
      return true;
    };

    Call.prototype.startSignaling_ = function(hasVideo, hasAudio) {
      trace('Starting signaling.');
      if (this.oncallerstarted) {
        this.oncallerstarted(this.cameraId_);
      }

      this.startTime = window.performance.now();

      this.maybeCreatePcClient_();
      this.params_.offerOptions.offerToReceiveVideo = hasVideo;
      this.params_.offerOptions.offerToReceiveAudio = hasAudio;
      this.pcClient_.startAsCaller(this.params_.offerOptions);
    };

    Call.prototype.sendSignalingMessage_ = function(message) {
      message.camera = this.cameraId_;
      if (this.queue_ === null) {
        this.channel_.send(message);
      } else {
        this.queue_.push(message);
      }
    };

    Call.prototype.flush_ = function() {
      while (this.queue_ && this.queue_.length) {
        this.channel_.send(this.queue_.shift());
      }
      this.queue_ = null;
    };

    Call.prototype.onRemoteHangup_ = function() {
      this.hangup();
      if (this.onremotehangup) {
        this.onremotehangup(this.cameraId_);
      }
    };
    Call.prototype.onRemoteSdpSet_ = function(hasRemoteVideo) {
      if (this.onremotesdpset) {
        this.onremotesdpset(this.cameraId_, hasRemoteVideo);
      }
    };
    Call.prototype.onRemoteStreamAdded_ = function(stream) {
      this.stream_ = stream;
      attachMediaStream(this.video_, this.stream_);
      this.video_.play();
      if (this.onremotestreamadded) {
        this.onremotestreamadded(this.cameraId_, stream);
      }
    };
    Call.prototype.onRemoveStream_ = function(event) {
      this.stream_ = null;
      if (this.video_) {
        this.video_.src = '';
      }
      if (this.onremovestream) {
        this.onremovestream(this.cameraId_, event.stream);
      }
    };
    Call.prototype.onSignalingStateChange_ = function() {
      if (this.onsignalingstatechange) {
        this.onsignalingstatechange(this.cameraId_, this.pcClient_);
      }
    };
    Call.prototype.onIceConnectionStateChange_ = function() {
      if (this.oniceconnectionstatechange) {
        this.oniceconnectionstatechange(this.cameraId_, this.pcClient_);
      }
    };
    Call.prototype.onNewIceCandidate_ = function(location, candidate) {
      if (this.onnewicecandidate) {
        this.onnewicecandidate(this.cameraId_, location, candidate);
      }
    };
    Call.prototype.onError_ = function(message) {
      if (this.onerror) {
        this.onerror(this.cameraId_, message);
      }
    };


    var Room = function(room, options, params) {
      // include _id and _cid
      appUtils.shallowClearAndCopy(room, this);
      this.options_ = options || {};
      this.params_ = params;

      this.calls = {};

      this.channel_ = new SignalingChannel(params.wssUrl);
      this.channel_.gettoken = options.gettoken && this.getToken_.bind(this);
      this.channel_.validate = options.validate;
      this.channel_.onmessage = this.onRecvSignalingChannelMessage_.bind(this);
    };

    Room.prototype.startCall = function(cameraId, video, hasVideo, hasAudio) {
      if (!cameraId) {
        trace('ERROR: Call to empty camera.');
        return;
      }
      this.maybeCreateCall_(cameraId);
      var call_ = this.calls[cameraId];
      call_.bindto(video);
      call_.start(hasVideo, hasAudio);
    };

    Room.prototype.removeCall = function(cameraId) {
      var call_ = this.calls[cameraId];
      if (call_) {
        call_.hangup();
        delete this.calls[cameraId];
      }
    };

    Room.prototype.offline = function() {
      for (var cameraId in this.calls) {
        if (this.calls.hasOwnProperty(cameraId)) {
          this.calls[cameraId].hangup();
        }
      }
      this.calls = {};
    };

    Room.prototype.getToken_ = function() {
      // adjust to server validate
      return {
        token: this.options_.gettoken(),
        room: this[this.options_.roomId],
        reciever: Math.random().toString(36).slice(2),
      };
    };

    Room.prototype.onRecvSignalingChannelMessage_ = function(msg) {
      var cameraId = msg.camera;
      if (!cameraId) {
        trace('ERROR: Bad message from room.');
        return;
      }
      var call_ = this.calls[cameraId];
      if (!call_) {
        trace('ERROR: Message to wrong camera.');
        return;
      }
      call_.onReceiveSignalingMessage(JSON.stringify(msg));
    };

    Room.prototype.maybeCreateCall_ = function(cameraId) {
      if (this.calls[cameraId]) {
        return;
      }
      // call_ is camera
      var call_ = this.calls[cameraId] = new Call(cameraId, this.channel_, this.params_);

      call_.onremotehangup = this.onRemoteHangup_.bind(this);
      call_.onremotesdpset = this.onRemoteSdpSet_.bind(this);
      call_.onremotestreamadded = this.onRemoteStreamAdded_.bind(this);
      call_.onremovestream = this.onRemoveStream_.bind(this);
      // call_.onlocalstreamadded = this.onLocalStreamAdded_.bind(this);

      // TODO replace these log options
      call_.onsignalingstatechange = this.onSignalingStateChange_.bind(this);
      call_.oniceconnectionstatechange = this.onIceConnectionStateChange_.bind(this);
      call_.onnewicecandidate = this.onNewIceCandidate_.bind(this);

      call_.onerror = this.onError_.bind(this);
      // call_.onstatusmessage = this.onStatusMessage_.bind(this);
      call_.oncallerstarted = this.onCallerStarted_.bind(this);

      // ['onremotehangup', 'onremotesdpset', 'onremotestreamadded',
      //   'onsignalingstatechange', 'oniceconnectionstatechange', 'onnewicecandidate',
      //   'onerror', 'oncallerstarted'
      // ].forEach(function(cbname) {
      //   var cb = this.options_[cbname];
      //   var cb_ = this[cbname + '_'];
      //   cb_ = cb_ && cb_.bind(this);
      //
      //   if (cb_ && cb) {
      //     // both handle
      //     call_[cbname] = function(cameraId) {
      //       cb_(cameraId);
      //       cb(this.id, cameraId);
      //     }.bind(this);
      //   } else if (cb) {
      //     call_[cbname] = function(cameraId) {
      //       cb(this.id, cameraId);
      //     }.bind(this);
      //   } else if (cb_) {
      //     call_[cbname] = cb_;
      //   }
      // }.bind(this));
    };

    Room.prototype.onRemoteHangup_ = function(cameraId) {
      delete this.calls[cameraId];
      if (this.options_.onremotehangup) {
        this.options_.onremotehangup(this, cameraId);
      }
    };
    Room.prototype.onRemoteSdpSet_ = function(cameraId, hasRemoteVideo) {
      if (this.options_.onremotesdpset) {
        this.options_.onremotesdpset(this, cameraId, hasRemoteVideo);
      }
    };
    Room.prototype.onRemoteStreamAdded_ = function(cameraId, stream) {
      if (this.options_.onremotestreamadded) {
        this.options_.onremotestreamadded(this, cameraId, stream);
      }
    };
    Room.prototype.onRemoveStream_ = function(cameraId, stream) {
      if (this.options_.onremovestream) {
        this.options_.onremovestream(this, cameraId, stream);
      }
    };
    Room.prototype.onSignalingStateChange_ = function(cameraId, pc) {
      if (this.options_.onsignalingstatechange) {
        this.options_.onsignalingstatechange(this, cameraId, pc);
      }
    };
    Room.prototype.onIceConnectionStateChange_ = function(cameraId, pc) {
      if (this.options_.oniceconnectionstatechange) {
        this.options_.oniceconnectionstatechange(this, cameraId, pc);
      }
    };
    Room.prototype.onNewIceCandidate_ = function(cameraId, location, candidate) {
      if (this.options_.onnewicecandidate) {
        this.options_.onnewicecandidate(this, cameraId, location, candidate);
      }
    };
    Room.prototype.onError_ = function(cameraId, message) {
      if (this.options_.onerror) {
        this.options_.onerror(this, cameraId, message);
      }
    };
    Room.prototype.onCallerStarted_ = function(cameraId) {
      if (this.options_.oncallerstarted) {
        this.options_.oncallerstarted(this, cameraId);
      }
    };

    this.createRtcRoom = function(room, options, params) {
      return new Room(room, options, angular.extend(JSON.parse(options.defaultParams), params));
    };
  }
]);
