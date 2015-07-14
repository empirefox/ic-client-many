'use strict';

angular.module('app.service.reg-room', ['toaster', 'app.system']).factory('RegLocal', [
  'toaster', 'AppSystem', 'IframeLocalService',
  function(toaster, AppSystem, IframeLocalService) {
    var service = {};

    var messenger = IframeLocalService.create({
      src: AppSystem.localRoomFrameUrl,
      target: 'regFrame',
      projectName: 'RegProject',
      name: 'regParent',
      onMessage: function(data) {
        switch (data.type) {
          case 'Status':
            service.status = data.content;
            break;
        }
      },
      onOpen: function() {
        service.hasLocalOne = true;
      },
      onClose: function() {
        service.hasLocalOne = false;
      },
      onError: function(error) {
        toaster.pop('error', 'Error', error);
      },

    });

    service.SetSecretAddress = function(addr) {
      messenger.send(JSON.stringify({
        type: 'SetSecretAddress',
        content: addr,
      }));
    };

    service.GetStatus = function() {
      messenger.send(JSON.stringify({
        type: 'GetStatus',
      }));
    };

    return service;
  }
]).factory('RegRoom', ['$http', 'toaster', 'RegLocal',
  function($http, toaster, RegLocal) {
    return {
      reg: function(name) {
        if (!RegLocal.hasLocalOne || RegLocal.status !== 'not_authed' || RegLocal.status !== 'auth_failed') {
          return;
        }
        $http.post('/many/reg-room', {
          name: name,
        }).success(function(data) {
          RegLocal.SetSecretAddress(data.addr);
          toaster.pop('success', 'Success', 'Reg room ok!');
        }).error(function() {
          toaster.pop('error', 'Error', 'Cannot reg room!');
        });
      }
    };
  }
]);
