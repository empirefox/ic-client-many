'use strict';

angular.module('app.service.detect', []).factory('Detector', function() {
  var service = {};
  service.supportedOs = ['windows', 'linux', 'mac'];
  var appVersion = navigator.appVersion;
  if (appVersion.indexOf("Mac") !== -1) {
    service.OSName = "mac";
  } else if (appVersion.indexOf("X11") !== -1) {
    service.OSName = "linux";
  } else if (appVersion.indexOf("Linux") !== -1) {
    service.OSName = "linux";
  } else {
    // default to windows
    service.OSName = "windows";
  }
  return service;
});
