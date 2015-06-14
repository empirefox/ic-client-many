'use strict';

angular.module('app.service.login', []).factory('LoginChecker', ['$http',
function($http) {
	var service = {
		check : function() {
			return $http.get('/many/checklogin');
		}
	};

	service.success = function(fn) {
		service.check().success(fn);
	};
	service.fail = function(fn) {
		service.check().error(fn);
	};
	return service;
}]);
