'use strict';

angular.module('app.navs', ['ngDialog', 'app.i18n', 'app.service.login']).directive('navBar', [
  '$translate', 'NavsService',
  function($translate, NavsService) {
    return {
      restrict: 'E',
      templateUrl: '/views/share/navbar.html',
      link: function(scope) {
        NavsService.get().then(function(navs) {
          scope.navs = navs;
        });
        scope.change = $translate.use;
      },
    };
  }
]).factory('NavsService', [
  '$window', '$http', '$q', 'ngDialog', 'NavList', 'LoginChecker',
  function($window, $http, $q, ngDialog, NavList, LoginChecker) {
    var path = window.location.pathname;

    function visit(nav) {
      var promise = nav.authOnly ? LoginChecker.check().catch(function() {
        $window.location.assign('/login.html');
        return $q.reject();
      }) : $q.when();

      return promise.then(function() {
        return confirm(nav);
      });
    }

    function initNav(nav) {
      nav.visible = nav.hideFrom.every(function(hide) {
        if (hide === '*') {
          return false;
        }
        if (path !== hide) {
          return true;
        }
      });
      nav.active = nav.href === path;

      nav.go = function(e) {
        e.preventDefault();
        e.stopPropagation();
        visit(nav);
      };
      return nav;
    }

    function seperate(needSeperate) {
      if (needSeperate) {
        return LoginChecker.check().then(function() {
          return true;
        }, function() {
          return false;
        }).then(function(authed) {
          return NavList.filter(function(nav) {
            return !((nav.authOnly && !authed) || (nav.unauthedOnly && authed));
          });
        });
      } else {
        return NavList;
      }
    }

    function confirm(nav) {
      var promise = nav.dialog ? ngDialog.openConfirm({
        template: '/views/share/dialogs/' + nav.dialog + '.html',
        className: 'ngdialog-theme-plain',
      }) : $q.when();

      return promise.then(function() {
        $window.location.assign(nav.href);
      });
    }

    // include path === '/' || path === 'index.html', cause no authed provided
    var self = {};
    NavList.some(function(nav) {
      if (nav.href === path) {
        self = nav;
        return true;
      }
    });

    return {
      get: function() {
        return $q.when(!self.authOnly && !self.unauthedOnly).then(seperate).then(function(navs) {
          return navs.map(initNav);
        });
      },
    };
  }
]).constant('NavList', [{
  href: '/rooms.html',
  icon: 'fa fa-desktop',
  txt: 'PAGE_NAME.ROOMS',
  hideFrom: ['/login.html', '/reg-room.html'],
  authOnly: true,
  right: false,
  hideXs: false,
}, {
  href: '/reg-room.html',
  icon: 'fa fa-plus',
  txt: 'PAGE_NAME.REG_ROOM',
  hideFrom: ['*'],
  authOnly: true,
  right: true,
  hideXs: true,
}, {
  href: '/join.html',
  icon: 'fa fa-wifi',
  txt: 'PAGE_NAME.JOIN',
  hideFrom: ['/login.html', '/reg-room.html'],
  authOnly: true,
  right: false,
  hideXs: false,
}, {
  href: '/many/logoff',
  icon: 'fa fa-user-times',
  txt: 'PAGE_NAME.LOGOFF',
  hideFrom: ['/login.html', '/reg-room.html'],
  authOnly: true,
  right: false,
  dialog: 'ConfirmLogoff',
  hideXs: true,
}, {
  href: '/logout',
  icon: 'fa fa-bolt',
  txt: 'PAGE_NAME.LOGOUT',
  hideFrom: ['/login.html'],
  authOnly: true,
  right: false,
  hideXs: false,
}, {
  href: '/login.html',
  icon: 'fa fa-sign-in',
  txt: 'PAGE_NAME.LOGIN',
  hideFrom: ['/rooms.html', '/reg-room.html', '/join.html', '/login.html'],
  authOnly: false,
  right: false,
  hideXs: false,
  unauthedOnly: true,
}, {
  href: '/dl.html',
  icon: 'fa fa-cloud-download',
  txt: 'PAGE_NAME.DOWNLOAD',
  hideFrom: [],
  authOnly: false,
  right: false,
  hideXs: true,
  unauthedOnly: false,
}]);
