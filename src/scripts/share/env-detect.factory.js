'use strict';

angular.module('app.service.detect', []).factory('Detector', function() {
  Detectizr.detect({
    // option for enabling HTML classes of all features (not only the true features) to be added
    addAllFeaturesAsClass: 0,
    // option for enabling detection of device
    detectDevice: 1,
    // option for enabling detection of device model
    detectDeviceModel: 0,
    // option for enabling detection of screen size
    detectScreen: 0,
    // option for enabling detection of operating system type and version
    detectOS: 1,
    // option for enabling detection of browser type and version
    detectBrowser: 1,
    // option for enabling detection of common browser plugins
    detectPlugins: 0
  });
  return {
    supportedOs: ['windows', 'mac os', 'linux'], // UNIX not supported
    osName: Detectizr.os.name,
    isWebRTCSupported: !!window.RTCPeerConnection,
    browserName: Detectizr.browser.name,
    browserVer: Detectizr.browser.version,
  };
});
