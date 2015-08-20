'use strict';

angular.module('app.system', []).factory('AppSystem', [
  '$window',
  function($window) {
    // From templates by gulp
    var ApiData = window.ApiData;
    var wsProto = ApiData.DevProd.WsProto;
    var wsPrefix = wsProto + '://' + ApiData.ApiDomain + ':' + ApiData.DevProd.WsPort;
    var apiPort = ApiData.DevProd.ApiPort ? ':' + ApiData.DevProd.ApiPort : '';
    var apiOrigin = ApiData.DevProd.ApiProto + '://' + ApiData.ApiDomain + apiPort;

    return {
      apiOrigin: apiOrigin,
      wsPrefix: wsPrefix,
      ctrlUrl: wsPrefix + '/mws/ctrl',
      signalingUrl: wsPrefix + '/mws/signaling',
      httpPrefix: ApiData.DevProd.SiteProto + '://' + $window.location.host,
    };
  }
]);
