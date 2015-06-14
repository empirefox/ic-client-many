'use strict';

angular.module('login.ctrl.main', ['app.service.login', 'login.service.oauth']).controller('LoginMainCtrl', [
// deps
'$scope', '$window', 'OauthFactory', 'LoginChecker',
function($scope, $window, OauthFactory, LoginChecker) {
	$scope.OauthFactory = OauthFactory;
	LoginChecker.success(function() {
		$window.location.assign('/');
	});
}]);
