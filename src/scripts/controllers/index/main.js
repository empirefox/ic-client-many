'use strict';

angular.module('index.ctrl.main', ['ui.tree', 'irontec.simpleChat', 'app.service.ctrl', 'app.service.pcfactory']).
// controller
controller('IndexMainCtrl',
// deps
['$scope', '$websocket', 'CtrlClient', 'Streams', 'PCFactory',
function($scope, $websocket, CtrlClient, Streams, PCFactory) {
	$scope.CtrlClient = CtrlClient;
	$scope.Streams = Streams;

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
