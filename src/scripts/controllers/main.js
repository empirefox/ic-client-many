'use strict';

angularApp.controller('MainCtrl', ['$scope', 'StatParser', '$websocket',
function($scope, StatParser, $websocket) {

	var dataStream = $websocket('ws://127.0.0.1:3129/stat');

	dataStream.onMessage(function(msg) {
		$scope.data = StatParser.parse(JSON.parse(msg.data));
	});

	$scope.typePingPerid = 'pie';
	$scope.typeDomainStatus = 'bar';

	// data

	$scope.PingDistance = {};
	$scope.DomainSuccess = {};
	$scope.DomainFail = {};
	$scope.DomainStatus = {};

	// config
	$scope.configPingDistance = {
		isAnimate : false,
		labels : false,
		title : "Ping Capability",
		legend : {
			display : true,
			position : 'left'
		},
		innerRadius : 30
	};

	$scope.configDomainStatus = {
		isAnimate : false,
		labels : false,
		title : "Domain Success/Fail Comparation",
		legend : {
			display : true,
			position : 'left'
		},
		innerRadius : 30
	};

	$scope.configDomainSuccess = {
		isAnimate : false,
		labels : false,
		title : "Domain Success",
		legend : {
			display : true,
			position : 'left'
		},
		innerRadius : 30
	};

	$scope.configDomainFail = {
		isAnimate : false,
		labels : false,
		title : "Domain Fail",
		legend : {
			display : true,
			position : 'left'
		},
		innerRadius : 30
	};
}]);
