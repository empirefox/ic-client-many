'use strict';

angular.module('app.service.ctrl', ['toaster', 'ngAnimate', 'ngWebSocket', 'app.system', 'app.service.auth']).factory(
  'CtrlClient', ['$window', '$http', 'toaster', '$websocket', 'AppSystem', 'AuthToken',
    function($window, $http, toaster, $websocket, AppSystem, AuthToken) {
      var ctrlStream = $websocket(AppSystem.ctrlUrl);

      var service = {
        rooms: {},
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

      service.getCameraList = function() {
        service.get('CameraList');
      };

      service.getUsername = function() {
        service.get('Userinfo');
      };

      // Response from one, not from server
      var onResponse = function(response) {
        switch (response.to) {
          case 'ManageSetRoomName':
            var setter = response.content;
            service.rooms.some(function(room) {
              if (room.id === setter.id) {
                angular.extend(room, setter);
                return true;
              }
            });
            break;
          case 'ManageDelRoom':
            var id = response.content;
            var delIndex;
            var found = service.rooms.some(function(room, i) {
              if (room.id === id) {
                delIndex = i;
                return true;
              }
            });
            if (found) {
              service.rooms.splice(delIndex, 1);
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

      ctrlStream.onOpen(function() {
        AuthToken.send(ctrlStream);
      });

      ctrlStream.onMessage(function(raw) {
        // console.log(raw.data);
        var data = JSON.parse(raw.data);
        if (!data.content) {
          // console.log('wrong data:', data);
          return;
        }
        switch (data.type) {
          case 'Login':
            if (data.content) {
              service.getUsername();
              service.getCameraList();
            }
            break;
          case 'Userinfo':
            service.username = data.content;
            break;
          case 'RoomOffline':
            service.rooms.forEach(function(room) {
              if (room.id === data.content) {
                delete room.cameras;
              }
            });
            break;
          case 'CameraList':
            service.rooms = data.content.reverse();
            service.rooms.forEach(function(room) {
              if (room.cameras) {
                room.cameras = room.cameras.reverse();
              }
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
