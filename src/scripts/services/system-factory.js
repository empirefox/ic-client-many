'use strict';

angular.module('app.system', ['app.constants.system']).factory('AppSystem', [
  '$window', 'SystemData',
  function($window, SystemData) {
    var wsProto = SystemData.DevProd.WsProto;
    var localRoomPort = wsProto === 'ws' ? '12301' : '12302';
    var wsPrefix = wsProto + '://' + $window.location.hostname + ':' + SystemData.DevProd.WsPort;

    return {
      wsPrefix: wsPrefix,
      ctrlUrl: wsPrefix + '/many/ctrl',
      signalingUrl: wsPrefix + '/many/signaling',
      localRoomUrl: wsProto + '://127.0.0.1:' + localRoomPort + '/register',
      httpPrefix: SystemData.DevProd.HttpProto + '://' + $window.location.host,
    };
  }
]);
