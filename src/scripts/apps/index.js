'use strict';

angular.module('index.github', ['ui.bootstrap']);
angular.module('index.ctrls', ['index.ctrl.header', 'index.ctrl.main']);
angular.module('index', ['index.github', 'index.ctrls', 'l2m-tpl']);

angular.module('index').config(['$tooltipProvider',
function($tooltipProvider) {
	$tooltipProvider.options({
		placement : 'top',
		animation : false,
		popupDelay : 0,
		appendToBody : true
	});
}]);
