'use strict';

angular.module('dl.ctrl.main', ['dl.client.data', 'angular.filter', 'app.service.detect']).controller('DlMainCtrl', [
  '$scope', '$translate', 'ClientData', 'Detector',
  function($scope, $translate, ClientData, Detector) {
    $scope.$watch(function() {
      return $translate.proposedLanguage() || $translate.use();
    }, function(newValue, oldValue, scope) {
      scope.currentLang = newValue;
    });

    ClientData.get().then(function(data) {
      $scope.datas = data;
    });

    $scope.supportedOs = Detector.supportedOs;
    $scope.currentOs = Detector.OSName || Detector.supportedOs[0];
    $scope.setOs = function(os) {
      $scope.currentOs = os;
    };
  }
]);
