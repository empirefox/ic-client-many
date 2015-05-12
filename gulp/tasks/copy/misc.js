var gulp = require('gulp');
var config = require('../../config').misc;

gulp.task('copy:misc', function() {
    gulp.src(['bower_components/font-awesome/fonts/*','bower_components/bootstrap/dist/fonts/*']).pipe(gulp.dest(config.dest + '/fonts'));
    gulp.src(['bower_components/bootstrap/dist/css/*']).pipe(gulp.dest(config.dest + '/css'));
	return gulp.src(config.src, {
		// Include hidden files by default
		dot : true
	}).pipe(gulp.dest(config.dest));
});