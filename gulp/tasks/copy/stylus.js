var gulp = require('gulp');
var stylus = require('gulp-stylus');
var config = require('../../config').stylus;

gulp.task('copy:stylus', function() {
  return gulp.src(config.src).pipe(stylus({
    'include css': true,
    'paths': config.paths,
  })).pipe(gulp.dest(config.dest));
});
