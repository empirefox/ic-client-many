'use strict';

angular.module('login.ctrl.main', ['login.service.oauth']).controller('LoginMainCtrl', [
  '$scope', 'OauthFactory',
  function($scope, OauthFactory) {
    $scope.OauthFactory = OauthFactory;
  }
]);
