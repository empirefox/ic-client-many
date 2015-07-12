'use strict';

angular.module('app.service.reg-room', ['toaster', 'ngWebSocket', 'app.system']).factory('RegLocal', [
	'$websocket', 'AppSystem',
	function($websocket, AppSystem) {
		var ctrlStream = $websocket(AppSystem.localRoomUrl);

		var SetSecretAddress = function(addr) {
			ctrlStream.send(JSON.stringify({
				type: 'SetSecretAddress',
				content: addr,
			}));
		};

		var GetStatus = function() {
			ctrlStream.send(JSON.stringify({
				type: 'GetStatus',
			}));
		};

		var service = {
			SetSecretAddress: SetSecretAddress,
			GetStatus: GetStatus,
		};

		ctrlStream.onOpen(function() {
			service.hasLocalOne = true;
		});
		ctrlStream.onClose(function() {
			service.hasLocalOne = false;
		});

		ctrlStream.onMessage(function(raw) {
			var data = JSON.parse(raw.data);
			switch (data.type) {
				case 'Status':
					service.status = data.content;
					break;
			}
		});
		return service;
	}
]).factory('RegRoom', ['$http', 'toaster', 'RegLocal',
	function($http, toaster, RegLocal) {
		return {
			reg: function(name) {
				if (!RegLocal.hasLocalOne || RegLocal.status !== 'not_authed') {
					return;
				}
				$http.post('/many/reg-room', {
					name: name,
				}).success(function(data) {
					RegLocal.SetSecretAddress(data.addr);
					toaster.pop('success', 'Success', 'Reg room ok!');
				}).error(function() {
					toaster.pop('error', 'Error', 'Cannot reg room!');
				});
			}
		};
	}
]);
