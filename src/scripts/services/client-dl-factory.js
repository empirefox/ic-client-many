'use strict';

angular.module('dl.client.data', []).factory('ClientData', ['$q', function($q) {
  var data = [{
    icon: 'ic-client-50x60.png',
    size: '46.9MB',
    url: {
      // bit32: 'http://32',
      bit64: 'http://pan.baidu.com/s/1o61OYCi',
    },
    os: 'linux',
    arch: '64bit',
    time: 1439280760182,
    'en_US': {
      name: 'IC Room',
      version: '1.1.0',
      desc: 'This is the client software for ic center.',
    },
    'zh_CN': {
      name: 'IC监控室',
      version: '1.1.0',
      desc: '这是监控中心的客户端，运行在与摄像头相同的内网中.',
    },
  }];
  return {
    get: function() {
      return $q.when(data);
    },
  };
}]);
