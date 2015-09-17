'use strict';

var gulp = require('gulp');
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
var env = require('../../config').env;
var swig = $.swig;

var exclude = ["ng", "ngAnimate", "ngCookies", "ngLocale", "ngSanitize", "pascalprecht.translate",
  "ui.bootstrap", "ui.bootstrap.tpls", "angular-loading-bar", "chieffancypants.loadingBar",
  "angular.filter", "angular-jwt", "angular-jwt.interceptor", "angular-jwt.jwt", "ngDialog", "toaster",
  "ngWebSocket", "angular-websocket", "angularMoment", "irontec.simpleChat", "app.tpl"
];
var commonModule = 'app.common';
var commons = ['app.system', 'app.service.detect', 'app.i18n', 'app.navs', 'app.service.auth', 'app.service.login.auto', 'app.service.path'];

function addCopyPageJsTask(pagename) {
  gulp.task('copy:' + pagename + '.js', function() {
    // var src = Lazy([resource.js, config.src]).flatten().toArray();
    var resource = require('../../resource/' + pagename + '.json').local;

    return new StreamQueue({
        objectMode: true,
      }).
      // third libs that are not in cdn
    queue(gulp.src(resource.js)).
      // local src filterd by pagename|modulename
    queue(gulp.src(config.src).pipe(ngDeps(pagename, Lazy([exclude, commonModule, commons]).flatten().toArray()))).
      // done
    done().
      // sort files
      //		.pipe(angularFilesort())
      // concat
    pipe($.concat(pagename + '.js')).pipe(toStaticfilesCDN()).
      // pipe($.uglify()).
    pipe(gulp.dest(config.dest));
  });
}

gulp.task('copy:scripts:common', function() {
  let commonScripts = gulp.src(config.src).pipe(ngDeps(commonModule, exclude)).
  pipe($.concat('common.js')).
  pipe($.header('window.ApiData=' + JSON.stringify(env.ApiData) + ';'));
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
  }).queue(tplScripts, commonScripts).done().
  pipe($.concat(config.commonDestName)).
    // pipe($.uglify()).
  pipe(gulp.dest(config.dest));
});

var tasks = ['copy:scripts:common'];
pages.forEach(function(page) {
  addCopyPageJsTask(page);
  tasks.push('copy:' + page + '.js');
});

gulp.task('copy:scripts', function(done) {
  tasks.push(done);
  runSequence.apply(null, tasks);
});
