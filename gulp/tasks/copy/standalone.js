'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var swig = $.swig;
var config = require('../../config');

gulp.task('standalone:page', function() {
  gulp.src('src/standalone/*.html').
  pipe(swig({
    defaults: {
      varControls: ['[[', ']]'],
    },
    data: config.env,
  })).
  pipe(gulp.dest(config.dest));
});

gulp.task('standalone:js', function() {
  gulp.src('src/standalone/*.js').
  pipe($.uglify()).
  pipe(gulp.dest(config.scripts.dest));
});

gulp.task('standalone', ['standalone:page', 'standalone:js']);
