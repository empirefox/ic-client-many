'use strict';

angular.module('join.ctrl.main', ['toaster', 'app.service.invite']).controller('JoinMainCtrl', [
  '$scope', '$window', '$location', 'toaster', 'Invite',
  function($scope, $window, $location, toaster, Invite) {
    $scope.join = function() {
      var invite = $scope.full && Invite.parseInvite($scope.full);
      return invite && Invite.anwser(invite).then(function() {
        toaster.pop('success', 'success', 'Join room success');
        $window.location.assign('/rooms.html');
      }, function() {
        toaster.pop('error', 'error', 'Failed to join room');
      });
    };

    $scope.full = $location.search().j;
    $scope.join();
  }
]);
