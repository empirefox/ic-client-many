'use strict';

angular.module('githubs', ['ui.bootstrap', 'ngRoute', 'angularCharts', 'ngWebSocket']);
angular.module('app.filters', []);
angular.module('app.directives', []);
angular.module('app.navs', ['app.header', 'app.navs.const']);
/* jshint unused: false, -W079 */
var angularApp = angular.module('myApp', ['githubs', 'app.filters', 'app.directives', 'l2m-tpl', 'app.navs']);

angularApp.config(['$routeProvider', 'navs',
function($routeProvider, navs) {
	angular.forEach(navs, function(nav) {
		$routeProvider.when(nav.when, nav);
	});
	$routeProvider.when('/table/:fname', {
		templateUrl : '/views/tables.html',
		controller : 'TablesCtrl'
	});
	$routeProvider.otherwise({
		redirectTo : '/'
	});
}]).config(['$tooltipProvider',
function($tooltipProvider) {
	$tooltipProvider.options({
		placement : 'top',
		animation : false,
		popupDelay : 0,
		appendToBody : true
	});
}]).run(function() {
});
