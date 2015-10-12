'use strict';

angular.module('rooms.ctrls', ['rooms.ctrl.header', 'rooms.ctrl.main']);
angular.module('rooms', ['ngSanitize', 'rooms.ctrls', 'app.common']);

angular.module('rooms').config(['$uibTooltipProvider', function($uibTooltipProvider) {
  $uibTooltipProvider.options({
    animation: false,
    popupDelay: 0,
    appendToBody: true
  });
}]);
