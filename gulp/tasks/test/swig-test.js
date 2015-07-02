var gulp = require('gulp');
var swig = require('swig');
var r = new swig.Swig({
	locals : {
		src : './src',
		dest : './dist',
		test : './test',
		views : 'views',
		pagename : '{{ pagename }}'
	}
}).render;

gulp.task('swig-test', function() {
	var src = swig.compile(r('{{ src }}/stylus/{{ pagename }}.js'));
	console.log(src({
		pagename : 'rooms'
	}));
});
