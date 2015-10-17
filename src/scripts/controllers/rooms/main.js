'use strict';

angular.module('rooms.ctrl.main', ['irontec.simpleChat', 'app.service.dialog', 'app.service.ctrl', 'rooms.directive.rtc-videojs', 'rooms.service.rooms']).
controller('RoomsMainCtrl', ['$scope', 'RoomsRtc', 'Dialog', 'CtrlClient',
  function($scope, RoomsRtc, Dialog, CtrlClient) {
    $scope.Dialog = Dialog;
    $scope.RoomsRtc = RoomsRtc;
    $scope.CtrlClient = CtrlClient;
  }
]);
