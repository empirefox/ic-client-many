'use strict';

angular.module('app.service.streams', []).factory('Streams', ['$rootScope',
function($rootScope) {
	var service = {
		// camera_id1: blob://aaa
		map : {}
	};

	service.add = function(camera, stream) {
		var old = service.map[camera];
		service.map[camera] = URL.createObjectURL(stream);
		if (old) {
			URL.revokeObjectURL(old);
		}
		if (!$rootScope.$$digest) {
			$rootScope.$apply();
		}
	};
	service.remove = function(camera) {
		var url = service.map[camera];
		if (url) {
			URL.revokeObjectURL(url);
			delete service.map[camera];
			if (!$rootScope.$$digest) {
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
}]);
