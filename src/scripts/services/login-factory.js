'use strict';

angular.module('app.service.login', ['ngCookies', 'toaster']).factory('LoginChecker', [
  '$http', '$cookies', '$q', 'toaster',
  function($http, $cookies, $q, toaster) {
    var sessionKey = 'MC_OK';
    var service = {
      check: function(force) {
        if (!force && $cookies.get(sessionKey) === '1') {
          return $q.when();
        }

        toaster.pop({
          timeout: null,
          type: 'wait',
          title: 'wait',
          toasterId: 'LoginCheckWait',
        });
        return $http.get('/many/checklogin').then(function() {
          $cookies.put(sessionKey, '1');
        }, function() {
          $cookies.put(sessionKey, '');
          return $q.reject();
        }).finally(function() {
          toaster.clear('LoginCheckWait');
        });
      }
    };

    service.success = function(fn) {
      service.check().then(fn);
    };
    service.fail = function(fn) {
      service.check().catch(fn);
    };
    return service;
  }
]);

angular.module('app.service.login.auto', ['app.service.login', 'app.service.path']).run(['$window', 'LoginChecker', 'UrlParser',
  function($window, LoginChecker, UrlParser) {
    // int SCHEMA = 2, DOMAIN = 3, PORT = 5, PATH = 6, FILE = 8, QUERYSTRING = 9, HASH = 12
    // see http://stackoverflow.com/a/309360/2778814
    // here use 6+8=> /questions/27745/getting-parts-of-a-url-regex
    LoginChecker.check(true).catch(function() {
      var paths = $window.location.href.match(UrlParser);
      $window.location.assign('/login.html?from=' + paths[6] + paths[8]);
    });
  }
]);
