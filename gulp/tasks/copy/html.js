var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var env = require('./env');
var cdnjsOps = require('./cdnjsOps.json');
var cdnHelper = require('./cdn-helper');
var config = require('../../config');
var swig = $.swig;

function addCopyPageTask(pagename) {
  var resource = require('../../resource/' + pagename + '.json');

  gulp.task('copy:' + pagename + '.html', function() {
    return gulp.src('./src/pages/' + pagename + '.html').
      // replace module with pagename
    pipe(swig({
        defaults: {
          varControls: ['[[', ']]'],
        },
        data: {
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

var tasks = [];
config.pages.forEach(function(page) {
  addCopyPageTask(page);
  tasks.push('copy:' + page + '.html');
});

gulp.task('copy:html', tasks);
