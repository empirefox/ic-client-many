'use strict';

var gulp = require('gulp');
var env = require('./env');
var Lazy = require("lazy.js");
var $ = require('gulp-load-plugins')();
var angularFilesort = $.angularFilesort;
var ngDeps = $.angularDependency;
var htmlmin = $.htmlMinifier;
var runSequence = require('run-sequence');
var StreamQueue = require('streamqueue');
var toStaticfilesCDN = require('./cdn-helper').toStaticfilesCDN;
var pages = require('../../config').pages;
var config = require('../../config').scripts;
var swig = $.swig;
var ngcompile = require('ng-node-compile');

var exclude = ["ng", "ngAnimate", "ngCookies", "ngLocale", "ngSanitize", "pascalprecht.translate",
  "ui.bootstrap", "ui.bootstrap.tpls", "angular-loading-bar", "chieffancypants.loadingBar", "satellizer",
  "angular.filter", "ngDialog", "toaster", "ngWebSocket", "angular-websocket", "angularMoment",
  "irontec.simpleChat", "app.tpl", 'app.system'
];
var commonModule = 'app.common';
var commons = ['app.service.detect', 'app.i18n', 'app.navs', 'app.service.satellizer', 'app.service.path'];

function addCopyPageJsTask(pagename) {
  gulp.task('copy:' + pagename + '.js', function() {
    // var src = Lazy([resource.js, config.src]).flatten().toArray();
    let resource = require('../../resource/' + pagename + '.json').local;

    return new StreamQueue({
        objectMode: true,
      }).
      // third libs that are not in cdn
    queue(gulp.src(resource.js)).
      // local src filterd by pagename|modulename
    queue(gulp.src(config.src).pipe(ngDeps(pagename, Lazy([exclude, commonModule, commons]).flatten().toArray()))).
      // done
    done().
      // concat
    pipe($.concat(pagename + '.js')).pipe(toStaticfilesCDN()).
      // pipe($.uglify()).
    pipe(gulp.dest(config.dest));
  });
}

gulp.task('copy:scripts:export', () => {
  let ngEnviorment = new ngcompile([{
    name: 'satellizer',
    path: './bower_components/satellizer/satellizer.js',
  }, {
    name: 'pascalprecht.translate',
    path: './bower_components/angular-translate/angular-translate.js',
  }, {
    name: 'app.i18n.zh_CN',
    path: 'src/scripts/share/translate_zh-CN.js',
  }, {
    name: 'app.i18n.en_US',
    path: 'src/scripts/share/translate_en-US.js',
  }], './bower_components/angular/angular.js');
  let $injector = window.angular.injector(['ng', 'satellizer', 'app.i18n.zh_CN', 'app.i18n.en_US']);
  $injector.invoke((SatellizerConfig, I18nZhCN) => {
    let ApiDataJson = JSON.stringify({
      Providers: env.ApiData.Providers,
      Satellizers: SatellizerConfig.providers,
      Translates: I18nZhCN.PAGE.LOGIN.OAUTH,
    });
    require('fs').writeFileSync(config.dest + '/api-data.js', `var ApiData=${ApiDataJson};`);
    require('fs').writeFileSync(config.dest + '/api-data.json', `${ApiDataJson}`);
  });
});

gulp.task('copy:scripts:common', function() {
  // ApiData and Providers
  let apiScripts = $.ngConstant({
    name: 'app.system',
    stream: true,
    constants: {
      AppSystem: env.ApiData,
    },
  });

  // all local modules
  let commonScripts = gulp.src(config.src).pipe(ngDeps(commonModule, exclude)).pipe($.concat('common.js'));

  // all tpl
  let tplScripts = gulp.src(config.tpl).
  pipe(htmlmin({
    collapseWhitespace: true,
    conservativeCollapse: true,
  })).
  pipe($.angularTemplatecache({
    filename: 'templates.js',
    standalone: true,
    module: 'app.tpl',
    root: '/views',
  })).
  pipe($.rename({
    extname: '.js',
  })).
  pipe(swig({
    defaults: {
      varControls: ['[[', ']]'],
    },
    data: env,
  }));

  return new StreamQueue({
    objectMode: true,
  }).queue(apiScripts, tplScripts, commonScripts).done().
  pipe($.concat(config.commonDestName)).
    // pipe($.uglify()).
  pipe(gulp.dest(config.dest));
});

var tasks = ['copy:scripts:common', 'copy:scripts:export'];
pages.forEach(function(page) {
  addCopyPageJsTask(page);
  tasks.push('copy:' + page + '.js');
});

gulp.task('copy:scripts', function(done) {
  tasks.push(done);
  runSequence.apply(null, tasks);
});
