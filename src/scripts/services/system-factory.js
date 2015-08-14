'use strict';

angular.module('app.system', []).factory('AppSystem', [
  '$window',
  function($window) {
    // From templates by gulp
    var ApiData = window.ApiData;
    var wsProto = ApiData.DevProd.WsProto;
    var wsPrefix = wsProto + '://' + ApiData.ApiDomain + ':' + ApiData.DevProd.WsPort;
    var httpPort = ApiData.DevProd.HttpPort ? ':' + ApiData.DevProd.HttpPort : '';
    var apiOrigin = ApiData.DevProd.HttpProto + '://' + ApiData.ApiDomain + httpPort;

    return {
      apiOrigin: apiOrigin,
      wsPrefix: wsPrefix,
      ctrlUrl: wsPrefix + '/mws/ctrl',
      signalingUrl: wsPrefix + '/mws/signaling',
      httpPrefix: ApiData.DevProd.HttpProto + '://' + $window.location.host,
    };
  }
]);
