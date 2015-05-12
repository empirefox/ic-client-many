'use strict';

angular.module('app.header.service', []).service('HeaderService', ['$location',
function($location) {
	return {
		active : function(nav) {
			var path = $location.path();
			return {
				active : path === nav.when
			};
		}
	};
}]);

angular.module('app.header', ['app.header.service', 'app.navs.const'])
// HeaderCtrl
.controller('HeaderCtrl', ['$scope', 'HeaderService', 'navs',
function($scope, TablesService, HeaderService, navs) {
	$scope.active = HeaderService.active;
	$scope.navs = navs;
}]);
