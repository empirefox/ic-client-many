'use strict';

angular.module('index.ctrl.main', ['app.service.satellizer', 'app.service.detect']).controller('IndexCtrl', [
  '$scope', '$window', '$auth', 'Detector', 'SatellizerService',
  function($scope, $window, $auth, Detector, SatellizerService) {
    $scope.Detector = Detector;
    $scope.start = function() {
      if ($auth.isAuthenticated()) {
        $window.location.assign('/rooms.html');
      } else {
        SatellizerService.openLoginDialog().then(function() {
          $window.location.assign('/rooms.html');
        });
      }
    };
  }
]);
