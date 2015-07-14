var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('../../config');

gulp.task('copy:iframeLocal', function() {
  return gulp.src('./src/pages/iframeLocal.html').
  pipe($.inlineSource()).
  pipe(gulp.dest(config.dest));
});
