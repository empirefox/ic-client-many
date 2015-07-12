'use strict';

angular.module('index.ctrl.main', ['app.service.login']).controller('IndexCtrl', [
  '$scope', '$window', 'LoginChecker',
  function($scope, $window, LoginChecker) {
    $scope.start = function() {
      LoginChecker.check().success(function() {
        $window.location.assign('/rooms.html');
      }).error(function() {
        $window.location.assign('/login.html');
      });
    };
  }
]);
