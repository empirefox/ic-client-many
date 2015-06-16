'use strict';

angular.module('app.directive.rtc-video', []).directive('rtcVideo', function() {
	return {
		priority : 99, // it needs to run after the attributes are interpolated
		restrict : 'A',
		link : function(scope, iElement, iAttrs) {
			scope.$watch(iAttrs.rtcVideo, function(newVal) {
			    console.log(newVal);
				iElement.prop('src', newVal);
			});
		}
	};
});
