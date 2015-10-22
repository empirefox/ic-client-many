'use strict';
angular.module('app.service.satellizer', ['satellizer', 'toaster', 'app.system']).factory('SatellizerService', [
  '$q', '$auth', 'SatellizerStorage', 'ngDialog',
  function($q, $auth, SatellizerStorage, ngDialog) {
    var service = {};
    service.getUser = function() {
      return JSON.parse(SatellizerStorage.get('user'));
    };
    service.openLoginDialog = function() {
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
    }).catch(function() {
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
        SatellizerStorage.remove('user');
        toaster.pop('error', '', response.data.message);
      });
    };

  }
]).config(['SatellizerConfig', '$authProvider', 'AppSystem', function(SatellizerConfig, $authProvider, AppSystem) {
  $authProvider.withCredentials = false;
  $authProvider.baseUrl = AppSystem.ApiOrigin;
  $authProvider.loginUrl = '/not/login';
  $authProvider.signupUrl = '/not/signup';
  $authProvider.unlinkUrl = '/many/unlink/';

  var redirectUri = window.location.origin || window.location.protocol + '//' + window.location.host;
  var state = function() {
    return Math.random().toString(36).slice(2);
  };
  AppSystem.Providers.forEach(function(sp) {
    if (SatellizerConfig.providers[sp.Name]) {
      var params = {
        url: sp.Path,
        clientId: sp.ClientID,
        state: state,
      };
      if (sp.Scope) {
        params.scope = sp.Scope;
      }
      if (sp.RedirectURL) {
        params.redirectUri = sp.RedirectURL;
      }
      $authProvider[sp.Name](params);
    } else {
      $authProvider.oauth2({
        name: sp.Name,
        url: sp.Path,
        clientId: sp.ClientID,
        redirectUri: sp.RedirectURL ? sp.RedirectURL : redirectUri,
        authorizationEndpoint: sp.AuthURL,
        scope: sp.Scope,
        state: state,
      });
    }
  });
}]);
