'use strict';

angular.module('login.service.oauth', ['app.system']).factory('OauthFactory', [
  '$http', '$window', 'AppSystem',
  function($http, $window, AppSystem) {
    var service = {
      get: function() {
        return $http.get(AppSystem.apiOrigin + '/auth/oauths').then(function(res) {
          var oauths = res.data;
          oauths.forEach(function(oauth) {
            oauth.text = 'PAGE.LOGIN.OAUTH.' + oauth.text.toUpperCase();
          });
          return oauths;
        });
      },
      doLogin: function(oauth) {
        $window.location.assign(oauth.path + $window.location.search);
      }
    };

    service.get().then(function(data) {
      service.oauths = data;
    });

    return service;
  }
]);
