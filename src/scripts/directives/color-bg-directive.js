'use strict';

angular.module('app.directive.color-bg', ['app.service.color-bg']).directive('randomColor', [
	'ColorfulGenerator',
	function(ColorfulGenerator) {
		return {
			priority: 200, // it needs to run after the attributes are interpolated
			restrict: 'A',
			link: function(scope, iElement) {
				function click() {
					ColorfulGenerator.random(iElement.get(0));
				}
				iElement.bind('click', click);
				click();
			}
		};
	}
]);
