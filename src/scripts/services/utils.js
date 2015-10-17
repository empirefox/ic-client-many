'use strict';

/* globals trace */
angular.module('app.service.utils', []).service('appUtils', function() {
  /**
   * Copy from angularjs/resource.js
   * Create a shallow copy of an object and clear other fields from the destination
   */
  this.shallowClearAndCopy = function(src, dst) {
    dst = dst || {};

    angular.forEach(dst, function(value, key) {
      delete dst[key];
    });

    for (var key in src) {
      if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }

    return dst;
  };

  // Copy from apprtc/util.js
  // Parse the supplied JSON, or return null if parsing fails.
  this.parseJSON = function(json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      trace('Error parsing json: ' + json);
    }
    return null;
  };
});
