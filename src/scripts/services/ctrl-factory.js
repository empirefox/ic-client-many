'use strict';

angular.module('app.service.ctrl', ['toaster', 'ngAnimate', 'ngWebsocket', 'app.system.const']).factory('CtrlClient', [
// inject
'toaster', '$websocket', 'SystemData',
function(toaster, $websocket, SystemData) {
	var ctrlStream = $websocket('wss://' + SystemData.Host + '/many/ctrl');

	var service = {
		chats : [],

		get : function(name) {
			ctrlStream.send('many:GetManyData:' + name);
		},

		// name: 'ManageGetIpcam'
		// content: 'ipcam1_id'
		// name: 'ManageSetIpcam'
		// content: managed_ipcam_object
		exec : function(name, room, content) {
			ctrlStream.send('many:Command:' + JSON.stringify({
				name : name,
				room : room,
				content : JSON.stringify(content)
			}));
			toaster.pop('success', 'info', 'Please wait! Sending command: ' + name);
		}
	};

	service.chat = function(msg) {
		if (service.chatTarget && msg && msg !== '') {
			ctrlStream.send('many:Chat:' + JSON.stringify({
				to : service.chatTarget.id,
				content : msg
			}));
		}
	};

	service.getCameraList = function() {
		service.get('CameraList');
	};

	service.getUsername = function() {
		service.get('Username');
	};

	// Response from one, not from server
	var onResponse = function(response) {
		switch(response.type) {
			case 'ManageGetIpcam':
				if (service.ManageGetIpcamCallback) {
					service.ManageGetIpcamCallback(JSON.parse(response.content));
				}
				break;
		}
	};

	ctrlStream.onMessage(function(raw) {
		var data = JSON.parse(raw.data);
		switch (data.type) {
			case 'Userinfo':
				service.username = data.content;
				break;
			case 'CameraList':
				service.rooms = data.content;
				break;
			case 'Chat':
				service.chats.push({
					username : data.content.from,
					content : data.content.content
				});
				break;
			case 'Response':
				onResponse(JSON.parse(data.content));
				break;
			case 'Info':
				// TODO change content to pop option object
				toaster.pop('success', 'info', data.content);
				break;
			default:
				console.log('Unexpected data from server', data);
		}
	});

	// init
	service.getUsername();
	service.getCameraList();

	return service;
}]);