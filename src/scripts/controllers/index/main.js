'use strict';

angular.module('index.ctrl.main', ['app.service.auth']).controller('IndexCtrl', [
  '$scope', '$window', 'AuthToken',
  function($scope, $window, AuthToken) {
    $scope.start = function() {
      if (AuthToken.ok()) {
        $window.location.assign('/rooms.html');
      } else {
        $window.location.assign('/login.html');
      }
    };
  }
]);
