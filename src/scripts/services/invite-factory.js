'use strict';

angular.module('app.service.invite', ['app.system']).factory('Invite', [
  '$http', '$window', 'AppSystem',
  function($http, $window, AppSystem) {
    var genCode = function(invite) {
      return invite.room.toString(36) + '_' + invite.code;
    };
    var service = {
      getInvite: function(room) {
        return $http.post(AppSystem.ApiOrigin + '/many/invite-code', {
          room: room.id,
        }).then(function(response) {
          var code = genCode(response.data);
          return {
            code: code,
            url: AppSystem.SiteProto + '/join.html#' + code,
          };
        });
      },
      parseInvite: function(full) {
        full = full.replace(AppSystem.SiteProto + '/join.html#', '');
        var pos = full.indexOf('_');
        if (pos === -1) {
          return;
        }
        return {
          room: parseInt(full.split('_', 1), 36),
          code: full.substr(pos + 1),
        };
      },
      anwser: function(invite) {
        return $http.post(AppSystem.ApiOrigin + '/many/invite-join', invite).then(function(response) {
          return response.data;
        });
      },
    };
    return service;
  }
]);
