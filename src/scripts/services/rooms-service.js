'use strict';

/* globals trace */
angular.module('rooms.service.rooms', ['rooms.service.rtc', 'app.service.satellizer']).service('RoomsRtc', [
  'AppSystem', 'RoomRtcService', '$auth', 'SatellizerService',
  function(AppSystem, RoomRtcService, $auth, SatellizerService) {
    var log = function(event, room, cameraId) {
      trace(event + '', room, cameraId);
    };
    // port from https://appr.tc/params
    var defaultParams_ = {
      wssUrl: AppSystem.SignalingUrl,
      mediaConstraints: {
        audio: false,
        video: false,
      },
      // there is a default PeerConnectionClient.DEFAULT_SDP_OFFER_OPTIONS_
      offerOptions: {},
      peerConnectionConfig: {
        iceServers: [{
          urls: AppSystem.Stuns,
        }],
      },
      peerConnectionConstraints: {
        optional: [],
      },
    };

    var RtcOptions = function() {
      this.defaultParams = JSON.stringify(defaultParams_);
      this.roomId = 'ID';
      this.cameraId = 'Id';
    };

    RtcOptions.prototype.onremotehangup = function(room, cameraId) {
      log('onremotehangup', room, cameraId);
    };
    RtcOptions.prototype.onremotesdpset = function(room, cameraId, hasRemoteVideo) {
      log('onremotesdpset', room, cameraId, hasRemoteVideo);
    };
    RtcOptions.prototype.onremotestreamadded = function(room, cameraId, stream) {
      log('onremotestreamadded', room, cameraId, stream);
    };
    RtcOptions.prototype.onremovestream = function(room, cameraId, stream) {
      log('onremovestream', room, cameraId, stream);
    };
    RtcOptions.prototype.onsignalingstatechange = function(room, cameraId, pc) {
      log('onsignalingstatechange', room, cameraId, pc);
    };
    RtcOptions.prototype.oniceconnectionstatechange = function(room, cameraId, pc) {
      log('oniceconnectionstatechange', room, cameraId, pc);
    };
    RtcOptions.prototype.onnewicecandidate = function(room, cameraId, location, candidate) {
      log('onnewicecandidate', room, cameraId, location, candidate);
    };
    RtcOptions.prototype.onerror = function(room, cameraId, message) {
      trace('onerror: ' + room.Name + '/' + cameraId + message);
    };
    RtcOptions.prototype.oncallerstarted = function(room, cameraId) {
      log('oncallerstarted', room, cameraId);
    };

    RtcOptions.prototype.gettoken = function() {
      return $auth.getToken();
    };
    RtcOptions.prototype.validate = function(event) {
      var data_ = JSON.parse(event.data);
      if (data_.type === 'Accepted') {
        return true;
      }
      trace(data_.type);
      window.location.assign(AppSystem.LoginUrl);
      return false;
    };

    this.rooms = [];
    this.callbacks = new RtcOptions();

    this.setRooms = function(rooms) {
      if (Array.isArray(rooms)) {
        var aid = SatellizerService.getUser().AccountId;
        this.rooms = rooms.map(function(room) {
          if (room.OwnerId === aid) {
            room.IsOwner = true;
          }
          return RoomRtcService.createRtcRoom(room, this.callbacks);
        }, this).sort(function(a, b) {
          return a.UpdatedAt.localeCompare(b.UpdatedAt);
        });
      }
    };

    this.setCameras = function(rid, cameras) {
      cameras && this.rooms.some(function(room) {
        if (room.ID === rid) {
          room.online();
          Object.keys(room.calls).forEach(function(cameraId) {
            if (!(cameraId in cameras)) {
              room.removeCall(cameraId);
            }
          });

          room.Cameras = Object.keys(cameras).map(function(cameraId) {
            return cameras[cameraId];
          }).sort(function(a, b) {
            return a.UpdatedAt - b.UpdatedAt;
          });
          return true;
        }
      });
    };

    this.setRoomViews = function(views) {
      var roomViews = {};
      Array.isArray(views) && views.forEach(function(rv) {
        roomViews[rv.OneId] = rv.ViewByViewer;
      });
      this.rooms.forEach(function(room) {
        room.View = roomViews[room.ID];
      });
    };

    this.setOffline = function(rid) {
      rid && this.rooms.some(function(room) {
        if (room.ID === rid) {
          room.offline();
          delete room.Cameras;
          return true;
        }
      });
    };

    this.setRoomName = function(setter) {
      this.rooms && setter && this.rooms.some(function(room) {
        if (room.ID === setter.ID) {
          angular.extend(room, setter);
          return true;
        }
      });
    };

    this.delRoom = function(rid) {
      this.rooms && rid && this.rooms.some(function(room, i, rooms) {
        if (room.ID === rid) {
          room.offline();
          rooms.splice(i, 1);
          return true;
        }
      });
    };
  }
]);
