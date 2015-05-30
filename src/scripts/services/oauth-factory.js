'use strict';

angular.module('login.service.oauth', []).factory('OauthFactory', ['$http',
function($http) {
	var service = {
		get : function() {
			return $http.get('/auth/oauths').then(function(res) {
				return res.data;
			});
		},
		doLogin : function(oauth) {
			window.location = oauth.path;
		}
	};

	service.get().then(function(data) {
		service.oauths = data;
	});

	return service;
}]);
