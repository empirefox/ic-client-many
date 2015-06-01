'use strict';

angular.module('index.ctrl.main', ['ui.tree', 'irontec.simpleChat', 'app.service.ctrl', 'app.service.pcfactory', 'app.service.dialog']).
// controller
controller('IndexMainCtrl',
// deps
['$scope', 'CtrlClient', 'Streams', 'PCFactory', 'Dialog',
function($scope, CtrlClient, Streams, PCFactory, Dialog) {
	$scope.CtrlClient = CtrlClient;
	$scope.Streams = Streams;
	$scope.Dialog = Dialog;

	$scope.connect = function(room, camera) {
		PCFactory.createPeerConn(room.id, camera.id);
	};

	$scope.disconnect = function(room, camera) {
		PCFactory.closePeerConn(room.id, camera.id);
	};

	$scope.$on("$destroy", function() {
		PCFactory.clear();
	});
}]);
