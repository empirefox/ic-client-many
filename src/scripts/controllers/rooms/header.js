'use strict';

angular.module('rooms.ctrl.header', ['app.header.service'])
// HeaderCtrl
.controller('RoomsHeaderCtrl', ['$scope', 'HeaderService',
function($scope, HeaderService) {
	$scope.active = HeaderService.active;
}]);
