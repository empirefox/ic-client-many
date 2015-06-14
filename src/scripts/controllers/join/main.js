'use strict';

angular.module('join.ctrl.main', ['app.service.invite', 'toaster']).controller('JoinMainCtrl', [
// deps
'$scope', 'toaster', 'Invite',
function($scope, toaster, Invite) {
	$scope.invite = {};
	$scope.join = function(invite) {
		Invite.anwser(invite).then(function() {
			delete invite.room;
			delete invite.code;
			toaster.pop('success', 'success', 'Join room success');
		}, function(reason) {
			toaster.pop('error', 'error', reason);
		});
	};
}]);
