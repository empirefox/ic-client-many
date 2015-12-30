'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let cspBuilder = require("content-security-policy-builder");
let env = require('./env');
let cdnjsOps = require('./cdnjsOps.json');
let cdnHelper = require('./cdn-helper');
let config = require('../../config');
let swig = $.swig;

let csp = cspBuilder({
  directives: {
    'default-src': [`'self'`, `'unsafe-eval'`, 'https://dn-cdnjscn.qbox.me', 'https://cdn.rawgit.com'],
    'connect-src': [env.ApiData.ApiOrigin, env.ApiData.WsPrefix, env.ApiData.ProxyAuthServer],
    'style-src': [`'self'`, `'unsafe-inline'`, 'https://dn-cdnjscn.qbox.me', 'https://cdn.rawgit.com'],
    'font-src': [`'self'`, 'https:', 'data:'],
    'img-src': [`'self'`, 'https:', 'data:'],
    'media-src': [`'self'`, 'https:', 'blob:'],
    'child-src': `'none'`,
    'object-src': `'none'`,
  },
});

function addCopyPageTask(pagename) {
  let resource = require('../../resource/' + pagename + '.json');

  gulp.task('copy:' + pagename + '.html', function() {
    return gulp.src('./src/pages/' + pagename + '.html').
      // replace module with pagename
    pipe(swig({
        defaults: {
          varControls: ['[[', ']]'],
        },
        data: {
          csp: () => csp,
          apiOrigin: env.ApiData.ApiOrigin,
          cdnJs: env.cdnJs,
          cdnCss: env.cdnCss,
          cdnImg: env.cdnImg,
          module: pagename,
          commonDestName: config.scripts.commonDestName,
        },
      })).
      // add jsdelivr css
    pipe(cdnHelper.toJsdelivrCss(resource.jsdelivr.css)).
      // add jsdelivr js
    pipe(cdnHelper.toJsdelivrJs(resource.jsdelivr.js)).
      // inject css files to html
    pipe($.inject(gulp.src(resource.cdn.css, {
        read: false,
      }), {
        name: 'head',
      })).
      // inject js files to html
    pipe($.inject(gulp.src(resource.cdn.js, {
        read: false,
      }), {
        name: 'head',
      })).
      // replace local file to cdn url
    pipe($.cdnizer({
        fallbackScript: '',
        fallbackTest: null,
        files: cdnjsOps,
      })).
      // replace with Staticfiles cdn
    pipe(cdnHelper.toStaticfilesCDN()).
      // output
    pipe(gulp.dest(config.dest));
  });
}

let tasks = [];
config.pages.forEach(function(page) {
  addCopyPageTask(page);
  tasks.push('copy:' + page + '.html');
});

gulp.task('copy:html', tasks);
