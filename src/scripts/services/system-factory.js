'use strict';

angular.module('app.system', ['app.constants.system']).factory('AppSystem', [
  '$window', 'SystemData',
  function($window, SystemData) {
    var service = {
      wsPrefix: SystemData.DevProd.WsProto + '://' + $window.location.hostname + ':' + SystemData.DevProd.WsPort,
      httpPrefix: SystemData.DevProd.HttpProto + '://' + $window.location.host,
    };
    service.ctrlUrl = service.wsPrefix + '/many/ctrl';
    service.signalingUrl = service.wsPrefix + '/many/signaling';
    return service;
  }
]);
