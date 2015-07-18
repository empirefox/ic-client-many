'use strict';

angular.module('app.translate.interpolate', []).factory('dynamicChooseInterpolation', ['$interpolate', function($interpolate) {

  var $locale;

  return {

    setLocale: function(locale) {
      $locale = locale;
    },

    getInterpolationIdentifier: function() {
      return 'dynamicChoose';
    },

    interpolate: function(string, interpolateParams) {
      var p = interpolateParams[$locale];
      return $interpolate(string)(p ? p : interpolateParams);
    },
  };
}]);
