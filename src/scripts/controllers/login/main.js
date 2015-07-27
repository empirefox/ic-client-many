'use strict';

angular.module('login.ctrl.main', ['app.service.login', 'login.service.oauth']).controller('LoginMainCtrl', [
  // deps
  '$scope', '$window', 'OauthFactory', 'LoginChecker',
  function($scope, $window, OauthFactory, LoginChecker) {
    $scope.OauthFactory = OauthFactory;
    LoginChecker.check(true).then(function() {
      // https://icv3.luck2.me/login.html?from=/reg-room.html
      // simplely remove /login.html?from=
      var whole = $window.location.href;
      var to = /\?from=/i.test(whole) ? whole.replace(/\/login\.html\?from=/gi, '') : '/';
      $window.location.assign(to);
    });
  }
]);
