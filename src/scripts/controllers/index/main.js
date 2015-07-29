'use strict';

angular.module('index.ctrl.main', ['app.service.login']).controller('IndexCtrl', [
  '$scope', '$window', 'LoginChecker',
  function($scope, $window, LoginChecker) {
    $scope.start = function() {
      LoginChecker.check().then(function() {
        $window.location.assign('/rooms.html');
      }, function() {
        $window.location.assign('/login.html');
      });
    };
  }
]);
