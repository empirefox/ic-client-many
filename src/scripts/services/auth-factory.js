'use strict';

angular.module('app.service.auth', ['angular-jwt', 'toaster', 'app.service.path']).factory('AuthToken', [
  '$window', 'jwtHelper', 'UrlParser',
  function($window, jwtHelper, UrlParser) {
    var service = {
      get: function() {
        return $window.sessionStorage.getItem('api-token');
      },
      put: function(token) {
        $window.sessionStorage.setItem('api-token', token);
      },
    };

    service.ok = function() {
      var t = service.get();
      return typeof t === 'string' && t.split('.').length === 3 && !jwtHelper.isTokenExpired(t);
    };

    service.send = function(sender) {
      if (service.ok()) {
        sender.send(service.get());
      } else {
        var paths = $window.location.href.match(UrlParser);
        if (paths) {
          $window.location.assign('/login.html?from=' + paths[6] + paths[8]);
        } else {
          $window.location.assign('/login.html');
        }
      }
    };
    return service;
  }
]).config(['$httpProvider', 'jwtInterceptorProvider', function($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['jwtHelper', 'AuthToken', function(jwtHelper, AuthToken) {
    var t = AuthToken.get();
    if (typeof t === 'string' && t.split('.').length === 3 && !jwtHelper.isTokenExpired(t)) {
      return t;
    }
  }];
  $httpProvider.interceptors.push('jwtInterceptor');
}]);

angular.module('app.service.login.auto', ['app.service.auth']).config(
  ['UrlParser', 'getURLParam', function(UrlParser, getURLParam) {
    var initInjector = angular.injector(['angular-jwt.jwt', 'ng']);
    var jwtHelper = initInjector.get('jwtHelper');
    // int SCHEMA = 2, DOMAIN = 3, PORT = 5, PATH = 6, FILE = 8, QUERYSTRING = 9, HASH = 12
    // see http://stackoverflow.com/a/309360/2778814
    // here use 6+8=> /questions/27745/getting-parts-of-a-url-regex
    var t = window.sessionStorage.getItem('api-token');
    if (typeof t !== 'string' || t.split('.').length !== 3 || jwtHelper.isTokenExpired(t)) {
      var paths = window.location.href.match(UrlParser);
      if (paths) {
        var path = paths[6] + paths[8];
        if (path === '/join.html') {
          var j = getURLParam(window.location, 'j');
          if (j) {
            path = '/j/' + j;
          }
        }
        window.location.assign('/login.html?from=' + path);
      } else {
        window.location.assign('/login.html');
      }
    }
  }]
);
