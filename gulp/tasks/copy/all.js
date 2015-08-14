var gulp = require('gulp');

gulp.task('copy', ['copy:html', 'copy:stylus', 'copy:scripts', 'copy:misc', 'standalone']);
