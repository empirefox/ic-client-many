'use strict';

angular.module('rooms.ctrl.main', ['irontec.simpleChat', 'app.service.ctrl', 'app.service.pcfactory', 'app.service.dialog', 'app.directive.rtc-video']).
controller('RoomsMainCtrl', ['$scope', 'CtrlClient', 'Streams', 'PCFactory', 'Dialog',
  function($scope, CtrlClient, Streams, PCFactory, Dialog) {
    $scope.CtrlClient = CtrlClient;
    $scope.Streams = Streams;
    $scope.Dialog = Dialog;

    $scope.connect = function(room, camera) {
      // online is a server ipcam status
      if (!camera.playing && camera.online) {
        PCFactory.createPeerConn(room, camera);
      }
    };

    $scope.disconnect = function(room, camera) {
      PCFactory.closePeerConn(room, camera);
      Streams.remove(camera);
    };

    $scope.$on("$destroy", function() {
      PCFactory.clear();
    });
  }
]);
