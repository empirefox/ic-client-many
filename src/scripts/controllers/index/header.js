'use strict';

angular.module('index.ctrl.header', ['app.header.service'])
// HeaderCtrl
.controller('IndexHeaderCtrl', ['$scope', 'HeaderService',
function($scope, HeaderService) {
	$scope.active = HeaderService.active;
}]);
