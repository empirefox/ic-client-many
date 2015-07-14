'use strict';

angular.module('app.system', ['app.constants.system']).factory('AppSystem', [
  '$window', 'SystemData',
  function($window, SystemData) {
    var wsProto = SystemData.DevProd.WsProto;
    var wsPrefix = wsProto + '://' + $window.location.hostname + ':' + SystemData.DevProd.WsPort;

    return {
      wsPrefix: wsPrefix,
      ctrlUrl: wsPrefix + '/many/ctrl',
      signalingUrl: wsPrefix + '/many/signaling',
      localRoomFrameUrl: 'http://127.0.0.1:12301/iframeLocal.html',
      httpPrefix: SystemData.DevProd.HttpProto + '://' + $window.location.host,
    };
  }
]);
