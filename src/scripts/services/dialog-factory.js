'use strict';

angular.module('app.service.dialog', ['ngDialog', 'app.service.ctrl']).factory('Dialog', ['ngDialog', 'CtrlClient',
function(ngDialog, CtrlClient) {
	var callbacks = {};

	var service = {};
	service.openManageRoomNameDialog = function(room) {
		ngDialog.openConfirm({
			template : '/views/index/dialog/ManagedSetRoomName.html',
			data : room,
			className : 'ngdialog-theme-plain'
		}).then(function(value) {
			CtrlClient.exec('ManageSetRoomName', room.id, value);
		});
	};

	service.openManageIpcamDialog = function(room, camera) {
		if (camera.disabled) {
			return;
		}
		camera.disabled = true;
		CtrlClient.ManageGetIpcamCallback = function(data) {
			ngDialog.openConfirm({
				template : '/views/index/dialog/ManagedSetIpcam.html',
				data : {
					room : room,
					ipcam : data
				},
				className : 'ngdialog-theme-plain'
			}).then(function(value) {
				CtrlClient.exec('ManagedSetIpcam', room.id, value);
			}).finally(function() {
				camera.disabled = false;
			});
		};
		CtrlClient.exec('ManagedGetIpcam', room.id, camera.id);
	};

	return service;
}]);
