'use strict';

angular.module('app.service.ctrl', ['toaster', 'ngAnimate', 'ngWebSocket', 'app.system']).factory(
  'CtrlClient', ['$window', 'toaster', '$websocket', 'AppSystem',
    function($window, toaster, $websocket, AppSystem) {
      var ctrlStream = $websocket(AppSystem.ctrlUrl);

      var service = {
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
        switch (response.type) {
          case 'ManageSetRoomName':
            angular.extend(service.rooms, response.content);
            break;
          case 'ManageGetIpcam':
            // indect by endpoint in dialog
            if (service.ManageGetIpcamCallback) {
              service.ManageGetIpcamCallback(response.content);
            }
            break;
        }
      };

      ctrlStream.onMessage(function(raw) {
        var data = JSON.parse(raw.data);
        if (!data.content) {
          // console.log('wrong data:', data);
          return;
        }
        switch (data.type) {
          case 'Userinfo':
            service.username = data.content;
            break;
          case 'CameraList':
            service.rooms = data.content.reverse().map(function(room) {
              room.cameras = room.cameras.reverse();
              return room;
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
            onResponse(data.content);
            break;
          case 'Info':
            // TODO change content to pop option object
            toaster.pop('info', 'info', data.content);
            break;
          default:
            console.log('Unexpected data from server', data);
        }
      });

      // init
      service.getUsername();
      service.getCameraList();

      return service;
    }
  ]);
