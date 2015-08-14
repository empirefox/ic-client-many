'use strict';

angular.module('rooms.ctrl.main', ['irontec.simpleChat', 'app.service.ctrl', 'app.service.pcfactory', 'app.service.dialog', 'app.directive.rtc-video']).
controller('RoomsMainCtrl', ['$scope', 'CtrlClient', 'Streams', 'PCFactory', 'Dialog',
  function($scope, CtrlClient, Streams, PCFactory, Dialog) {
    $scope.CtrlClient = CtrlClient;
    $scope.Streams = Streams;
    $scope.Dialog = Dialog;

    $scope.connect = function(room, camera) {
      if (!Streams.map[camera.id] && camera.online) {
        if (!camera.playing) {
          camera.playing = true;
          PCFactory.createPeerConn(room.id, camera.id);
        }
      }
    };

    $scope.disconnect = function(room, camera) {
      PCFactory.closePeerConn(room.id, camera.id);
      Streams.remove(camera.id);
      camera.playing = false;
    };

    $scope.$on("$destroy", function() {
      PCFactory.clear();
    });
  }
]);
