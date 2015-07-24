'use strict';

angular.module('app.service.dialog', ['ngDialog', 'app.service.ctrl', 'app.service.invite']).factory('Dialog', [
  '$window', 'ngDialog', 'CtrlClient', 'Invite',
  function($window, ngDialog, CtrlClient, Invite) {
    var service = {};
    service.openManageRoomNameDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManagedSetRoomName.html',
        data: room,
        className: 'ngdialog-theme-plain',
      }).then(function(value) {
        CtrlClient.exec('ManageSetRoomName', room.id, value);
      });
    };

    service.openManageNewInviteUrlDialog = function(room) {
      ngDialog.open({
        template: '/views/join/dialogs/ManagedNewInviteUrl.html',
        className: 'ngdialog-theme-plain',
        showClose: true,

        resolve: {
          invite: function() {
            return Invite.getCode(room);
          }
        },

        controller: ['$scope', 'invite',
          function($scope, invite) {
            $scope.invite = invite;
          }
        ],

      });
    };

    service.openManageIpcamDialog = function(room, camera) {
      if (camera.disabled) {
        return;
      }
      camera.disabled = true;
      CtrlClient.ManageGetIpcamCallback = function(data) {
        var cameraId = data.id;
        ngDialog.openConfirm({
          template: '/views/rooms/dialogs/ManagedSetIpcam.html',
          data: {
            room: room,
            ipcam: data,
          },
          className: 'ngdialog-theme-plain',
        }).then(function(value) {
          value.target = cameraId;
          CtrlClient.exec('ManagedSetIpcam', room.id, value);
        }).finally(function() {
          camera.disabled = false;
        });
      };
      CtrlClient.exec('ManagedGetIpcam', room.id, camera.id);
    };

    return service;
  }
]);
