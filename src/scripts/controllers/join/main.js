'use strict';

angular.module('join.ctrl.main', ['toaster', 'app.service.invite']).controller('JoinMainCtrl', [
  '$scope', '$window', '$location', 'toaster', 'Invite',
  function($scope, $window, $location, toaster, Invite) {
    $scope.join = function() {
      var invite = $scope.full && Invite.parseInvite($scope.full);
      return invite && Invite.anwser(invite).then(function() {
        toaster.pop('success', 'success', 'Join room success');
        $location.url('/rooms.html');
        $location.replace();
      }, function() {
        toaster.pop('error', 'error', 'Failed to join room');
        if ($location.hash()) {
          $location.hash(null);
          $location.replace();
        }
      });
    };

    $scope.full = $location.hash();
    $scope.join();
  }
]);
