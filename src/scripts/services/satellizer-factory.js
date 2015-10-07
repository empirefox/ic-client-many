'use strict';
angular.module('app.service.satellizer', ['satellizer', 'toaster', 'app.system']).factory('SatellizerService', [
  '$auth', 'SatellizerStorage', 'ngDialog',
  function($auth, SatellizerStorage, ngDialog) {
    var service = {};
    service.getUser = function() {
      return JSON.parse(SatellizerStorage.get('user'));
    };
    service.openLoginDialog = function() {
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
      $auth.logout();
    };

    return service;
  }

]).factory('skipIfLoggedIn', ['$q', '$auth', function skipIfLoggedIn($q, $auth) {
  var deferred = $q.defer();
  if ($auth.isAuthenticated()) {
    deferred.reject();
  } else {
    deferred.resolve();
  }
  return deferred.promise;

}]).factory('loginRequired', ['$q', '$auth', 'SatellizerService', function loginRequired($q, $auth, SatellizerService) {
  var deferred = $q.defer();
  if ($auth.isAuthenticated()) {
    deferred.resolve();
  } else {
    return SatellizerService.openLoginDialog();
  }
  return deferred.promise;

}]).controller('SatellizerLoginCtrl', [
  '$scope', '$auth', 'SatellizerStorage', 'AppSystem', 'toaster',
  function($scope, $auth, SatellizerStorage, AppSystem, toaster) {
    $scope.providers = AppSystem.Providers;
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function(response) {
        SatellizerStorage.set('user', JSON.stringify(response.data.user));
        toaster.pop('success', '', 'You have successfully signed in with ' + provider);
        if (angular.isFunction($scope.confirm)) {
          $scope.confirm();
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
