'use strict';

angular.module('dl.client.data', []).factory('ClientData', ['$q', function($q) {
  var data = [{
    icon: 'ic-client-50x60.png',
    size: '100MB',
    url: {
      // bit32: 'http://32',
      bit64: 'http://pan.baidu.com/s/1c0HGJyK',
    },
    os: 'linux',
    arch: '64bit',
    time: new Date(),
    'en_US': {
      name: 'IC Room',
      version: 'r1pre',
      desc: 'This is the client software for ic center.',
    },
    'zh_CN': {
      name: 'IC监控室',
      version: 'r1预览版',
      desc: '这是监控中心的客户端，运行在与摄像头相同的内网中.',
    },
  }];
  return {
    get: function() {
      return $q.when(data);
    },
  };
}]);
