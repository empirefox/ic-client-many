'use strict';

angular.module('app.service.detect', []).factory('Detector', function() {
  return {
    supportedOs: ['Windows', 'MacOS', 'Linux'], // UNIX not supported
    osName: window.DetectRTC.osName,
    isWebRTCSupported: window.DetectRTC.isWebRTCSupported,
    browserName: window.DetectRTC.browser.name,
    browserVer: window.DetectRTC.browser.version,
  };
});
