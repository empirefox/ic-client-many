'use strict';

angular.module('rooms.ctrls', ['rooms.ctrl.header', 'rooms.ctrl.main']);
angular.module('rooms', ['ngSanitize', 'rooms.ctrls', 'app.common', 'app.service.login.auto']);

angular.module('rooms').config(['$tooltipProvider', function($tooltipProvider) {
  $tooltipProvider.options({
    animation: false,
    popupDelay: 0,
    appendToBody: true
  });
}]);
