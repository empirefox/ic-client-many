var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
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
          varControls: ['[[', ']]']
        },
        data: {
          apiOrigin: config.env.apiOrigin,
          cdnJs: config.env.cdnJs,
          cdnCss: config.env.cdnCss,
          cdnImg: config.env.cdnImg,
          module: pagename,
        },
      })).
      // add jsdelivr css
    pipe(cdnHelper.toJsdelivrCss(resource.jsdelivr.css)).
      // add jsdelivr js
    pipe(cdnHelper.toJsdelivrJs(resource.jsdelivr.js)).
      // inject css files to html
    pipe($.inject(gulp.src(resource.cdn.css, {
        read: false
      }), {
        name: 'head'
      })).
      // inject js files to html
    pipe($.inject(gulp.src(resource.cdn.js, {
        read: false
      }), {
        name: 'head'
      })).
      // replace local file to cdn url
    pipe($.cdnizer({
        fallbackTest: null,
        files: cdnjsOps
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
