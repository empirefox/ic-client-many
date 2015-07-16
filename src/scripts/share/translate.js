'use strict';

angular.module('app.i18n', ['ngCookies', 'app.i18n.en_US', 'app.i18n.zh_CN']).config(['$translateProvider', function(
  $translateProvider) {
  $translateProvider.determinePreferredLanguage();
  $translateProvider.fallbackLanguage('en_US');
  $translateProvider.useCookieStorage();
}]);
