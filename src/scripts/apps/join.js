'use strict';

angular.module('join.github', ['ui.bootstrap']);
angular.module('join', ['ngSanitize', 'join.github', 'join.ctrl.main', 'l2m-tpl', 'app.i18n', 'app.navs', 'app.service.login.auto']).
config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}]);
