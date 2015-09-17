'use strict';

angular.module('app.service.dialog', ['ngDialog', 'app.service.ctrl', 'app.service.invite']).factory('Dialog', [
  '$window', 'ngDialog', 'CtrlClient', 'Invite',
  function($window, ngDialog, CtrlClient, Invite) {
    var service = {};
    service.openManageRoomNameDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageSetRoomName.html',
        data: room,
        className: 'ngdialog-theme-plain',
      }).then(function(value) {
        CtrlClient.exec('ManageSetRoomName', room.id, value);
      });
    };

    service.openManageDelRoomDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageDelRoom.html',
        data: {
          room: room,
        },
        className: 'ngdialog-theme-plain',
      }).then(function() {
        CtrlClient.exec('ManageDelRoom', room.id);
      });
    };

    service.openManageNewInviteUrlDialog = function(room) {
      ngDialog.open({
        template: '/views/join/dialogs/ManageNewInviteUrl.html',
        className: 'ngdialog-theme-plain',
        showClose: true,

        resolve: {
          invite: function() {
            return Invite.getInvite(room);
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
        if (!cameraId) {
          return;
        }
        ngDialog.openConfirm({
          template: '/views/rooms/dialogs/ManageSetIpcam.html',
          data: {
            room: room,
            ipcam: data,
          },
          className: 'ngdialog-theme-plain',
        }).then(function(value) {
          value.target = cameraId;
          CtrlClient.exec('ManageSetIpcam', room.id, value);
        }).finally(function() {
          camera.disabled = false;
        });
      };
      CtrlClient.exec('ManageGetIpcam', room.id, camera.id);
    };

    service.openManageNewIpcamDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageNewIpcam.html',
        data: {
          room: room,
          ipcam: {
            audioOff: true,
          },
        },
        className: 'ngdialog-theme-plain',
      }).then(function(camera) {
        console.log(camera);
        CtrlClient.exec('ManageSetIpcam', room.id, camera);
      });
    };

    service.openManageDelIpcamDialog = function(room, ipcam) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageDelIpcam.html',
        data: {
          room: room,
          ipcam: ipcam,
        },
        className: 'ngdialog-theme-plain',
      }).then(function(camera) {
        CtrlClient.exec('ManageDelIpcam', room.id, camera.id);
      });
    };

    return service;
  }
]);
