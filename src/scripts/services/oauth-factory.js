'use strict';

angular.module('login.service.oauth', ['app.system']).factory('OauthFactory', [
  '$http', '$window',
  function($http, $window) {
    var service = {
      doLogin: function(oauth) {
        $window.location.assign(oauth.path + $window.location.search);
      }
    };

    return service;
  }
]);
