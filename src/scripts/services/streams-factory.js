'use strict';

angular.module('app.service.streams', []).factory('Streams', ['$rootScope',
  function($rootScope) {
    var service = {
      // camera_id1: blob://aaa
      map: {},
    };

    service.add = function(camera, stream) {
      var cid = camera.Id;
      var old = service.map[cid];
      service.map[cid] = URL.createObjectURL(stream);
      if (old) {
        URL.revokeObjectURL(old);
      }
      camera.playing = true;
      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }
    };
    service.remove = function(camera) {
      var cid = camera.Id;
      var url = service.map[cid];
      camera.playing = false;
      if (url) {
        URL.revokeObjectURL(url);
        delete service.map[cid];
        if (!$rootScope.$$phase) {
          $rootScope.$apply();
        }
      }
    };
    service.clear = function() {
      var old = service.map;
      service.map = {};
      angular.forEach(old, function(url) {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };

    return service;
  }
]);
