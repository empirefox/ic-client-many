'use strict';

angular.module('app.service.ctrl', ['toaster', 'ngAnimate', 'ngWebSocket', 'app.system', 'app.service.satellizer']).factory(
  'CtrlClient', ['$injector', '$window', '$http', 'toaster', '$websocket', 'AppSystem', '$auth', 'SatellizerService',
    function($injector, $window, $http, toaster, $websocket, AppSystem, $auth, SatellizerService) {
      var ctrlStream = $websocket(AppSystem.CtrlUrl);

      var service = {
        rooms: [],
        chats: [],

        get: function(name) {
          ctrlStream.send('many:GetManyData:' + name);
        },

        // name: 'ManageGetIpcam'
        // content: 'ipcam1_id'
        // name: 'ManageSetIpcam'
        // content: managed_ipcam_object
        exec: function(name, room, content) {
          ctrlStream.send('many:Command:' + JSON.stringify({
            name: name,
            room: room,
            content: content,
          }));
          toaster.pop('success', 'info', 'Please wait! Sending command: ' + name);
        }
      };

      service.chat = function(msg) {
        if (service.chatTarget && msg && msg !== '') {
          ctrlStream.send('many:Chat:' + JSON.stringify({
            to: service.chatTarget.id,
            content: msg,
          }));
        }
      };

      // TODO rename
      service.getCameraList = function() {
        service.get('UserCameras');
      };

      // Response from one, not from server
      var onResponse = function(response) {
        switch (response.to) {
          case 'ManageSetRoomName':
            var setter = response.content;
            if (service.rooms && setter) {
              service.rooms.some(function(room) {
                if (room.ID === setter.ID) {
                  angular.extend(room, setter);
                  return true;
                }
              });
            }
            break;
          case 'ManageDelRoom':
            if (service.rooms) {
              var delIndex;
              var found = service.rooms.some(function(room, i) {
                if (room.ID === response.content) {
                  delIndex = i;
                  return true;
                }
              });
              if (found) {
                service.rooms.splice(delIndex, 1);
              }
            }
            break;
          case 'ManageGetIpcam':
            // indect by endpoint in dialog
            if (service.ManageGetIpcamCallback) {
              service.ManageGetIpcamCallback(response.content);
            }
            break;
        }
      };

      // TODO fix it
      ctrlStream.onOpen(function() {
        $injector.get('loginWs')(ctrlStream);
      });

      ctrlStream.onMessage(function(raw) {
        // console.log(raw.data);
        var data = JSON.parse(raw.data);
        switch (data.type) {
          case 'LoginOk':
            service.getCameraList();
            break;
          case 'LoginFailed':
            toaster.pop('info', 'info', 'Auth failed');
            SatellizerService.logout();
            $injector.get('loginWs')(ctrlStream);
            break;
          case 'RoomOffline':
            data.content && service.rooms.forEach(function(room) {
              if (room.ID === data.content) {
                delete room.Cameras;
              }
            });
            break;
          case 'Rooms':
            if (Array.isArray(data.content)) {
              var aid = SatellizerService.getUser().AccountId;
              data.content.forEach(function(room) {
                if (room.OwnerId === aid) {
                  room.IsOwner = true;
                }
              });
              service.rooms = data.content.sort(function(a, b) {
                return a.UpdatedAt.localeCompare(b.UpdatedAt);
              });
            }
            break;
          case 'Room':
            data.content && service.rooms.some(function(room) {
              if (room.ID === data.id) {
                room.Cameras = Object.keys(data.content).map(function(key) {
                  return data.content[key];
                }).sort(function(a, b) {
                  return a.UpdatedAt.localeCompare(b.UpdatedAt);
                });
                return true;
              }
            });
            break;
          case 'RoomViews':
            var roomViews = {};
            Array.isArray(data.content) && data.content.forEach(function(rv) {
              roomViews[rv.OneId] = rv.ViewByViewer;
            });
            service.rooms.forEach(function(room) {
              room.View = roomViews[room.ID];
            });
            break;
          case 'Chat':
            service.chats.push({
              username: data.content.from,
              content: data.content.content,
            });
            break;
          case 'Response':
            // raw content
            onResponse(data);
            break;
          case 'Info':
            // TODO change content to pop option object
            toaster.pop('info', 'info', data.content);
            break;
          default:
            console.log('Unexpected data from server', data);
        }
      });
      return service;
    }
  ]);
