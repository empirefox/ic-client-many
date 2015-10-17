'use strict';

angular.module('app.service.ctrl', ['toaster', 'ngAnimate', 'ngWebSocket', 'app.system', 'app.service.satellizer', 'rooms.service.rooms']).factory(
  'CtrlClient', ['$injector', '$window', '$http', 'toaster', '$websocket', 'AppSystem', '$auth', 'SatellizerService', 'RoomsRtc',
    function($injector, $window, $http, toaster, $websocket, AppSystem, $auth, SatellizerService, RoomsRtc) {
      var ctrlStream = $websocket(AppSystem.CtrlUrl);

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

      // TODO rename
      service.getCameraList = function() {
        service.get('UserCameras');
      };

      // Response from one, not from server
      var onResponse = function(response) {
        switch (response.to) {
          case 'ManageSetRoomName':
            // setter
            RoomsRtc.setRoomName(response.content);
            break;
          case 'ManageDelRoom':
            RoomsRtc.delRoom(response.content);
            break;
          case 'ManageGetIpcam':
            // indect by endpoint in dialog
            if (service.ManageGetIpcamCallback) {
              service.ManageGetIpcamCallback(response.content);
              service.ManageGetIpcamCallback = null;
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
            RoomsRtc.setOffline(data.content);
            break;
          case 'Rooms':
            RoomsRtc.setRooms(data.content);
            break;
          case 'Room':
            RoomsRtc.setCameras(data.id, data.content);
            break;
          case 'RoomViews':
            RoomsRtc.setRoomViews(data.content);
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
