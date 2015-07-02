'use strict';

angular.module('rooms.github', ['ui.bootstrap', 'sidenav']);
angular.module('rooms.ctrls', ['rooms.ctrl.header', 'rooms.ctrl.main']);
angular.module('rooms', ['rooms.github', 'rooms.ctrls', 'l2m-tpl', 'app.i18n']);

angular.module('rooms').config(['$tooltipProvider', function($tooltipProvider) {
  $tooltipProvider.options({
    animation: false,
    popupDelay: 0,
    appendToBody: true
  });
}]);