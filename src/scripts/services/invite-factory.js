'use strict';

angular.module('app.service.invite', ['app.constants.system']).factory('Invite', [
// deps
'$http', '$window', 'SystemData',
function($http, $window, SystemData) {
	var genInviteUrl = function(id, code) {
		return SystemData.DevProd.WsPrefix + $window.location.host + '/many/invite/' + id + '/' + code;
	};
	var service = {
		getCode : function(room) {
			return $http.get('/many/invite-code/' + room.id).then(function(response) {
				var invite = response.data;
				invite.url = genInviteUrl(invite.room, invite.code);
				return invite;
			});
		},
		anwser : function(invite) {
			return $http.get(genInviteUrl(invite.room, invite.code), {
				params : {
					type : 'json'
				}
			}).then(function(response) {
				return response.data;
			});
		}
	};
	return service;
}]);
