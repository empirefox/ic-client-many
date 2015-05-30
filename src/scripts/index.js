'use strict';

angular.module('github', ['ui.bootstrap', 'ngRoute']);
angular.module('index.ctrls', ['index.ctrl.header', 'index.ctrl.main']);
angular.module('index', ['github', 'l2m-tpl', 'index.navs']);

angular.module('index').config(['$routeProvider', 'navs',
function($routeProvider, navs) {
	angular.forEach(navs, function(nav) {
		$routeProvider.when(nav.when, nav);
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
