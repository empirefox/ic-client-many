var data=require('gulp-cdnizer/node_modules/cdnizer/node_modules/cdnjs-cdn-data');
var gulp = require('gulp');

gulp.task('cdnjs', function() {
    console.log(data['string.js'].url('0.4.14'));
});