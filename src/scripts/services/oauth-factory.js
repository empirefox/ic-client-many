'use strict';

angular.module('login.service.oauth', []).factory('OauthFactory', ['$http', '$window',
function($http, $window) {
	var service = {
		get : function() {
			return $http.get('/auth/oauths').then(function(res) {
				return res.data;
			});
		},
		doLogin : function(oauth) {
			$window.location.assign(oauth.path + $window.location.search);
		}
	};

	service.get().then(function(data) {
		service.oauths = data;
	});

	return service;
}]);
