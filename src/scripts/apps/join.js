'use strict';

angular.module('join', ['ngSanitize', 'join.ctrl.main', 'app.common']).
config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}]);
