'use strict';

angular.module('index.github', ['ui.bootstrap']);
angular.module('index', ['index.github', 'index.ctrl.main', 'l2m-tpl', 'app.i18n', 'app.navs', 'app.directive.color-bg']).run(
  function() {
    AniJS.run();
  });
