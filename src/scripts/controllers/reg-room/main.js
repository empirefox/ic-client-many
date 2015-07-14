'use strict';

angular.module('reg-room.ctrl.main', ['app.service.reg-room']).controller('RegRoomMainCtrl', [
  '$scope', 'RegRoom', 'RegLocal',
  function($scope, RegRoom, RegLocal) {
    $scope.RegLocal = RegLocal;
    $scope.regRoom = RegRoom.reg;
    RegLocal.GetStatus();
  }
]);
