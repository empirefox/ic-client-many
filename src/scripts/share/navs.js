'use strict';

angular.module('app.navs', ['ngDialog', 'app.i18n', 'app.service.login']).directive('navBar', [
  '$translate', 'Navs',
  function($translate, Navs) {
    return {
      restrict: 'E',
      templateUrl: '/views/share/navbar.html',
      link: function(scope) {
        scope.navs = Navs;
        scope.change = $translate.use;
      },
    };
  }
]).factory('Navs', [
  '$window', '$http', 'ngDialog', 'NavList', 'LoginChecker',
  function($window, $http, ngDialog, NavList, LoginChecker) {

    function confirm(nav) {
      if (nav.dialog) {
        ngDialog.open({
          template: '/views/share/dialogs/' + nav.dialog + '.html',
          className: 'ngdialog-theme-plain',
          showClose: true,
        }).then(function() {
          $window.location.assign(nav.href);
        });
      }
    }

    return NavList.map(function(nav) {
      var path = window.location.pathname;
      nav.visible = nav.hideFrom.every(function(hide) {
        if (path !== hide) {
          return true;
        }
      });
      nav.active = nav.href === path;

      nav.go = function() {
        if (nav.needAuth) {
          LoginChecker.check().
          then(function() {
            confirm(nav);
          }, function() {
            $window.location.assign('/login.html');
          });
        } else {
          confirm(nav);
        }
      };
      return nav;
    });
  }
]).constant('NavList', [{
  href: '/rooms.html',
  icon: 'fa fa-desktop',
  txt: 'PAGE_NAME.ROOMS',
  hideFrom: ['/login.html'],
  needAuth: true,
  right: false,
  hideXs: false,
}, {
  href: '/reg-room.html',
  icon: 'fa fa-plus',
  txt: 'PAGE_NAME.REG_ROOM',
  hideFrom: ['/login.html'],
  needAuth: true,
  right: true,
  hideXs: true,
}, {
  href: '/join.html',
  icon: 'fa fa-wifi',
  txt: 'PAGE_NAME.JOIN',
  hideFrom: ['/login.html'],
  needAuth: true,
  right: false,
  hideXs: false,
}, {
  href: '/logoff',
  icon: 'fa fa-user-times',
  txt: 'PAGE_NAME.LOGOFF',
  hideFrom: ['/login.html'],
  needAuth: true,
  right: false,
  dailog: 'ConfirmLogoff',
  hideXs: true,
}, {
  href: '/logout',
  icon: 'fa fa-bolt',
  txt: 'PAGE_NAME.LOGOUT',
  hideFrom: ['/login.html'],
  needAuth: true,
  right: false,
  hideXs: false,
}, {
  href: '/login.html',
  icon: 'fa fa-wifi',
  txt: 'PAGE_NAME.JOIN',
  hideFrom: ['/', '/rooms.html', '/reg-room.html', '/join.html', '/login.html'],
  needAuth: false,
  right: false,
  hideXs: false,
}]);
