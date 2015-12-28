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

      var onT2M = function(data) {
        //{"type": "T2M", "ID": oneId, "name": k, "part": part}
        switch (data.name) {
          case 'SecIc':
            // indect by endpoint in dialog
            if (service.ManageGetIpcamCallback) {
              service.ManageGetIpcamCallback(data.part);
              service.ManageGetIpcamCallback = null;
            }
            break;
          case 'NoIc':
            service.ManageGetIpcamCallback = null;
            break;
          case 'Info':
            toaster.pop('info', 'info', data.part);
            break;
          default:
            RoomsRtc.setRoomPart(data);
        }
      };

      // TODO fix it
      ctrlStream.onOpen(function() {
        $injector.get('loginWs')(ctrlStream);
      });

      ctrlStream.onMessage(function(raw) {
        console.log(raw.data);
        var data = JSON.parse(raw.data);
        switch (data.type) {
          case 'LoginOk':
            // TODO start a update token loop?
            break;
          case 'LoginFailed':
            toaster.pop('info', 'info', 'Auth failed');
            SatellizerService.logout();
            $injector.get('loginWs')(ctrlStream);
            break;
          case 'RoomOnline':
            //{"ID":%d,"type":"RoomOnline"}
            RoomsRtc.online(data.ID);
            break;
          case 'RoomOffline':
            //{"type":"RoomOffline","ID":%d}
            RoomsRtc.offline(data.ID);
            break;
          case 'XRoom':
            //{"type":"XRoom","ID":%d}
            RoomsRtc.xRoom(data.ID);
            break;
          case 'Rooms':
            //{"type": "Rooms", "rooms": ones}
            RoomsRtc.setRooms(data.rooms);
            break;
          case 'RoomViews':
            // [{OneId:ddd, ViewByViewer:"", CreatedAt:ddd},{}]
            RoomsRtc.setRoomViews(data.views);
            break;
          case 'T2M':
            onT2M(data);
            break;
          case 'Chat':
            service.chats.push({
              username: data.content.from,
              content: data.content.content,
            });
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
