'use strict';

angular.module('login.ctrl.main', ['login.service.oauth']).controller('LoginMainCtrl', ['$scope', '$http', 'OauthFactory',
function($scope, $http, OauthFactory) {
	$scope.OauthFactory = OauthFactory;
	window.setTimeout(function() {
		$http.get('/many/checklogin').success(function() {
			window.location = '/';
		});
	}, 200);
}]);
