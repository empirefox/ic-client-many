'use strict';

/* globals trace */
angular.module('rooms.service.rooms', ['rooms.service.rtc', 'app.service.satellizer']).service('RoomsRtc', [
  'AppSystem', 'RoomRtcService', '$auth', 'SatellizerService',
  function(AppSystem, RoomRtcService, $auth, SatellizerService) {
    var log = function(event, room, camera) {
      trace(event + '', room.ID, camera.Id);
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

    RtcOptions.prototype.onremotehangup = function(room, camera) {
      log('onremotehangup', room, camera);
    };
    RtcOptions.prototype.onremotesdpset = function(room, camera, hasRemoteVideo) {
      log('onremotesdpset', room, camera, hasRemoteVideo);
    };
    RtcOptions.prototype.onremotestreamadded = function(room, camera, stream) {
      log('onremotestreamadded', room, camera, stream);
    };
    RtcOptions.prototype.onremovestream = function(room, camera, stream) {
      log('onremovestream', room, camera, stream);
    };
    RtcOptions.prototype.onsignalingstatechange = function(room, camera, pc) {
      log('onsignalingstatechange', room, camera, pc);
    };
    RtcOptions.prototype.oniceconnectionstatechange = function(room, camera, pc) {
      log('oniceconnectionstatechange', room, camera, pc);
    };
    RtcOptions.prototype.onnewicecandidate = function(room, camera, location, candidate) {
      log('onnewicecandidate', room, camera, location, candidate);
    };
    RtcOptions.prototype.onerror = function(room, camera, message) {
      trace('onerror: ' + room.Name + '/' + camera + message);
    };
    RtcOptions.prototype.oncallerstarted = function(room, camera) {
      log('oncallerstarted', room, camera);
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

    // this.rooms is binded to view
    // it is Room type
    this.rooms = [];
    this.callbacks = new RtcOptions();

    this.findRoom = function(rid, cb) {
      return rid && this.rooms.some(function(room, i, rooms) {
        if (room.ID === rid) {
          cb(room, i, rooms);
          return true;
        }
      });
    };

    this.online = function(rid) {
      this.findRoom(rid, function(room) {
        room.online();
      });
    };

    this.offline = function(rid) {
      this.findRoom(rid, function(room) {
        room.offline();
      });
    };

    this.xRoom = function(rid) {
      this.findRoom(rid, function(room, i, rooms) {
        room.offline();
        rooms.splice(i, 1);
      });
    };

    this.setRooms = function(rooms) {
      if (Array.isArray(rooms)) {
        var aid = SatellizerService.getUser().AccountId;
        this.rooms = rooms.map(function(room) {
          if (room.OwnerId === aid) {
            room.IsOwner = true;
          }
          return RoomRtcService.createRtcRoom(room, this.callbacks);
        }, this).sort(function(b, a) {
          return a.UpdatedAt.localeCompare(b.UpdatedAt);
        });
      }
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

    this.setRoomPart = function(data) {
      this.findRoom(data.ID, function(room) {
        //{"type": "RoomPart", "ID": oneId, "name": k, "part": part}
        switch (data.name) {
          case 'One':
            // from server
            // TODO add other attributes in openManageRoomNameDialog
            angular.extend(room, data.part);
            break;

          case 'IcIds':
            // string array
            room.cameraIds = data.part;
            room.offlineIds = data.part.slice(0);
            break;

          case 'Ic':
            this.setCamera(room, data.part);
            break;

          case 'IcIdCh':
            this.changeCameraId(room, data.part.New, data.part.Old);
            break;

          case 'XIc':
            this.xCamera(room, data.part);
            break;

          default:
            console.log('Unexpected room part', data);

        }
      }.bind(this));
    };

    this.setCamera = function(room, camera) {
      if (room.cameraIds.indexOf(camera.Id) === -1) {
        room.cameraIds.push(camera.Id);
      }

      if (!camera.Online) {
        room.removeCall(camera.Id);
        room.removeFromOnline(camera.Id);

        if (room.offlineIds.indexOf(camera.Id) === -1) {
          room.offlineIds.push(camera.Id);
        }
      } else {
        var exist = room.cameras.some(function(rc) {
          if (rc.Id === camera.Id) {
            angular.extend(rc, camera);
            return true;
          }
        });
        if (!exist) {
          room.cameras.push(camera);
        }
        room.removeFromOffline(camera.Id);
      }

      room.cameras.sort(function(a, b) {
        return a.UpdatedAt - b.UpdatedAt;
      });
    };

    this.changeCameraId = function(room, now, old) {
      var idsIdx = room.cameraIds.indexOf(old);
      if (idsIdx !== -1) {
        room.cameraIds[idsIdx] = now;
      }

      idsIdx = room.offlineIds.indexOf(old);
      if (idsIdx !== -1) {
        room.offlineIds[idsIdx] = now;
      }

      room.cameras.some(function(rc) {
        if (rc.Id === old) {
          rc.Id = now;
          return true;
        }
      });

      var exist = room.calls[old];
      if (exist) {
        delete room.calls[old];
        room.calls[now] = exist;
      }
    };

    this.xCamera = function(room, cid) {
      room.removeCall(cid);
      room.removeFromOnline(cid);
      room.removeFromOffline(cid);

      var idsIdx = room.cameraIds.indexOf(cid);
      if (idsIdx !== -1) {
        room.cameraIds.splice(idsIdx, 1);
      }

    };

  }
]);
