var data=require('cdnjs-cdn-data');
var gulp = require('gulp');

gulp.task('cdnjs', function() {
    console.log(data['ng-dialog'].url('0.5.1'));
});
