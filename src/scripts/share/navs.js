'use strict';

angular.module('app.navs', ['ngDialog', 'toaster', 'app.i18n', 'app.system', 'app.service.auth']).directive('navBar', [
  '$translate', 'NavsService',
  function($translate, NavsService) {
    return {
      restrict: 'E',
      templateUrl: '/views/share/navbar.html',
      link: function(scope) {
        scope.navs = NavsService.get();
        scope.change = $translate.use;
      },
    };
  }
]).factory('NavsService', [
  '$injector', '$window', '$q', 'ngDialog', 'NavList', 'AuthToken',
  function($injector, $window, $q, ngDialog, NavList, AuthToken) {
    var path = window.location.pathname;

    function visit(nav) {
      if (nav.authOnly && !AuthToken.ok()) {
        $window.location.assign('/login.html');
      } else {
        confirm(nav);
      }
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
        var authed = AuthToken.ok();
        return NavList.filter(function(nav) {
          return !((nav.authOnly && !authed) || (nav.unauthedOnly && authed));
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
        if (nav.afterConfirm) {
          $injector.invoke(nav.afterConfirm);
        } else {
          $window.location.assign(nav.href);
        }
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
        return seperate(!self.authOnly && !self.unauthedOnly).map(initNav);
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
  href: '/logoff',
  icon: 'fa fa-user-times',
  txt: 'PAGE_NAME.LOGOFF',
  hideFrom: ['/login.html', '/reg-room.html'],
  authOnly: true,
  right: false,
  dialog: 'ConfirmLogoff',
  afterConfirm: ['$http', '$window', 'AuthToken', 'toaster', 'AppSystem',
    function($http, $window, AuthToken, toaster, AppSystem) {
      $http.delete(AppSystem.apiOrigin + '/many/logoff').success(function() {
        AuthToken.put('');
        $window.location.assign('/');
      }).error(function(err) {
        toaster.pop('info', 'info', err);
      });
    }
  ],
  hideXs: true,
}, {
  href: '/logout',
  icon: 'fa fa-bolt',
  txt: 'PAGE_NAME.LOGOUT',
  hideFrom: ['/login.html'],
  authOnly: true,
  right: false,
  hideXs: false,
  afterConfirm: ['$window', 'AuthToken', function($window, AuthToken) {
    AuthToken.put('');
    $window.location.assign('/');
  }],
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
