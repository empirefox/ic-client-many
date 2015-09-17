'use strict';

angular.module('index.ctrl.main', ['app.service.auth', 'app.service.detect']).controller('IndexCtrl', [
  '$scope', '$window', 'AuthToken', 'Detector',
  function($scope, $window, AuthToken, Detector) {
    $scope.Detector = Detector;
    $scope.start = function() {
      if (AuthToken.ok()) {
        $window.location.assign('/rooms.html');
      } else {
        $window.location.assign('/login.html');
      }
    };
  }
]);
