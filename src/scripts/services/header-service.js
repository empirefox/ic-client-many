'use strict';

angular.module('app.header.service', []).service('HeaderService', ['$location',
function($location) {
    return {
        active : function(nav) {
            var path = $location.path();
            return {
                active : path === nav.when
            };
        }
    };
}]);