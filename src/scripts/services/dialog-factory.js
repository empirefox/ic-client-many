'use strict';

angular.module('app.service.dialog', ['ngDialog', 'app.service.ctrl', 'app.service.invite', 'app.service.satellizer']).factory('Dialog', [
  '$window', 'ngDialog', 'CtrlClient', 'Invite',
  function($window, ngDialog, CtrlClient, Invite) {
    var service = {};

    service.openManageRoomNameDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageSetRoomName.html',
        data: room,
        className: 'ngdialog-theme-plain',
        resolve: {
          loginRequired: 'loginRequired',
        },
      }).then(function(value) {
        CtrlClient.exec('ManageSetRoomName', room.ID, value);
      });
    };

    service.openManageDelRoomDialog = function(room) {
      ngDialog.openConfirm({
        template: '/views/rooms/dialogs/ManageDelRoom.html',
        data: {
          room: room,
        },
        className: 'ngdialog-theme-plain',
        resolve: {
          loginRequired: 'loginRequired',
        },
      }).then(function() {
        CtrlClient.exec('ManageDelRoom', room.ID);
      });
    };

    service.openManageNewInviteUrlDialog = function(room) {
      ngDialog.open({
        template: '/views/join/dialogs/ManageNewInviteUrl.html',
        className: 'ngdialog-theme-plain',
        showClose: true,

        resolve: {
          loginRequired: 'loginRequired',
          invite: function() {
            return Invite.getInvite(room);
          },
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
        var cameraId = data.Id;
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
          resolve: {
            loginRequired: 'loginRequired',
          },
        }).then(function(value) {
          value.target = cameraId;
          CtrlClient.exec('ManageSetIpcam', room.ID, value);
        }).finally(function() {
          camera.disabled = false;
        });
      };
      CtrlClient.exec('ManageGetIpcam', room.ID, camera.Id);
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
        resolve: {
          loginRequired: 'loginRequired',
        },
      }).then(function(camera) {
        console.log(camera);
        CtrlClient.exec('ManageSetIpcam', room.ID, camera);
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
        resolve: {
          loginRequired: 'loginRequired',
        },
      }).then(function(camera) {
        CtrlClient.exec('ManageDelIpcam', room.ID, camera.Id);
      });
    };

    return service;
  }
]);
