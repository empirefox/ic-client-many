'use strict';

angular.module('app.service.invite', ['app.system']).factory('Invite', [
	'$http', '$window', 'AppSystem',
	function($http, $window, AppSystem) {
		var genInviteUrl = function(id, code) {
			return AppSystem.httpPrefix + '/many/invite/' + id + '/' + code;
		};
		var service = {
			getCode: function(room) {
				return $http.get('/many/invite-code/' + room.id).then(function(response) {
					var invite = response.data;
					invite.url = genInviteUrl(invite.room, invite.code);
					return invite;
				});
			},
			anwser: function(invite) {
				return $http.get(genInviteUrl(invite.room, invite.code), {
					params: {
						type: 'json',
					}
				}).then(function(response) {
					return response.data;
				});
			},
		};
		return service;
	}
]);
