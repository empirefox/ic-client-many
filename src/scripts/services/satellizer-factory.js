'use strict';
angular.module('app.service.satellizer', ['satellizer', 'toaster', 'app.system', 'app.const.providers-config']).
factory('SatellizerService', [
  '$q', '$auth', 'SatellizerStorage', 'ngDialog', 'AppSystem',
  function($q, $auth, SatellizerStorage, ngDialog, AppSystem) {
    var service = {};
    service.getUser = function() {
      try {
        return JSON.parse(SatellizerStorage.get('user'));
      } catch (e) {}
      return {};
    };
    service.openLoginDialog = function() {
      if (window.location.protocol + '//' !== AppSystem.SiteProto) {
        window.location.assign(AppSystem.SiteProto + window.location.host + '/login.html');
      }
      service.logout();
      return ngDialog.openConfirm({
        template: '/views/login/dialogs/Login.html',
        className: 'ngdialog-theme-plain',
        showClose: true,
        resolve: {
          skipIfLoggedIn: 'skipIfLoggedIn',
        },
        controller: 'SatellizerLoginCtrl',
      });
    };
    service.logout = function() {
      SatellizerStorage.remove('user');
      return $auth.logout();
    };

    return service;
  }

]).factory('skipIfLoggedIn', ['$q', '$auth', function skipIfLoggedIn($q, $auth) {
  if ($auth.isAuthenticated()) {
    return $q.reject('already_authed');
  } else {
    return $q.when();
  }

}]).factory('loginRequired', ['$q', '$auth', 'SatellizerService', function loginRequired($q, $auth, SatellizerService) {
  if ($auth.isAuthenticated()) {
    return $q.when();
  } else {
    return SatellizerService.openLoginDialog().catch(function(err) {
      if (err === 'already_authed') {
        return $q.when();
      } else {
        return $q.reject(err);
      }
    });
  }

}]).factory('loginWs', ['$auth', '$injector', function($auth, $injector) {
  return function(ws) {
    ws = ws || this;
    $injector.get('loginRequired').then(function() {
      if (ws.readyState > 1) {
        window.location.assign('/rooms.html');
      } else {
        ws.send($auth.getToken());
      }
    }).catch(function(e) {
      // TODO
      console.log(e);
      window.location.assign('/login.html');
    });
  };

}]).controller('SatellizerLoginCtrl', [
  '$scope', '$window', '$location', '$auth', 'SatellizerStorage', 'AppSystem', 'toaster',
  function($scope, $window, $location, $auth, SatellizerStorage, AppSystem, toaster) {
    $scope.providers = AppSystem.Providers;
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function(response) {
        SatellizerStorage.set('user', JSON.stringify(response.data.user));
        toaster.pop('success', '', 'You have successfully signed in with ' + provider);
        if (angular.isFunction($scope.confirm)) {
          $scope.confirm();
        }
        if ($scope.redirect || $location.path() === '/login.html') {
          $window.location.assign('/rooms.html');
        }
      }).catch(function(response) {
        console.log(response);
        SatellizerStorage.remove('user');
        toaster.pop('error', '', response.data.message);
      });
    };

  }
]).config(['SatellizerConfig', '$authProvider', 'AppSystem', 'satellizerProvidersConfig',
  function(SatellizerConfig, $authProvider, AppSystem, satellizerProvidersConfig) {
    $authProvider.withCredentials = false;
    $authProvider.baseUrl = AppSystem.ApiOrigin;
    $authProvider.loginUrl = '/not/login';
    $authProvider.signupUrl = '/not/signup';
    $authProvider.unlinkUrl = '/many/unlink/';

    var state = function() {
      return Math.random().toString(36).slice(2);
    };
    satellizerProvidersConfig(SatellizerConfig, AppSystem, state).forEach(function(r) {
      if (r.exist) {
        $authProvider[r.name](r);
      } else {
        $authProvider.oauth2(r);
      }
    });
  }
]);
