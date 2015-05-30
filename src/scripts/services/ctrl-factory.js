'use strict';

angular.module('app.service.ctrl', ['ngWebsocket', 'app.system.const']).factory('CtrlClient', ['$websocket', 'SystemData',
function($websocket, SystemData) {
	var ctrlStream = $websocket('wss://' + SystemData.Host + '/many/ctrl');

	var service = {
		chats : [],

		get : function(name) {
			ctrlStream.send('many:GetManyData:' + name);
		},
		exec : function(cmd) {
			ctrlStream.send('many:Command:' + JSON.stringify(cmd));
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

	var OnResponse = function(response) {
	    switch(response.type){
            case 'ManageGetIpcam':
            break;
            case 'ManageSetIpcam':
            break;
            case 'ManageReconnectIpcam':
            break;
	    }
	};

	ctrlStream.onMessage(function(raw) {
		var data = JSON.parse(raw.data);
		switch (data.type) {
			case 'Username':
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
				OnResponse(JSON.parse(data.content));
				break;
			case 'Info':
				break;
			// TODO add Log type
			default:
				console.log('Unexpected data from server', data);
		}
	});

	// init
	service.getUsername();
	service.getCameraList();

	return service;
}]);