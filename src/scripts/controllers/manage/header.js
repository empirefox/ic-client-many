'use strict';

angular.module('manage.ctrl.header', ['app.header.service'])
// HeaderCtrl
.controller('ManageHeaderCtrl', ['$scope', 'HeaderService',
function($scope, HeaderService) {
	$scope.active = HeaderService.active;
}]);
