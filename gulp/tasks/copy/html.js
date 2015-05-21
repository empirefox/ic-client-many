var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var cdnjsOps = require('./cdnjsOps.json');
var cdnHelper = require('./cdn-helper');
var config = require('../../config');

function addCopyPageTask(pagename) {
	var resource = require('../../resource/' + pagename + '.json');

	gulp.task('copy:' + pagename + '.html', function() {
		return gulp.src('./src/' + pagename + '.html')
		// add jsdelivr css
		.pipe(cdnHelper.toJsdelivrCss(resource.jsdelivr.css))
		// add jsdelivr js
		.pipe(cdnHelper.toJsdelivrJs(resource.jsdelivr.js))
		// inject css files to html
		.pipe(plugins.inject(gulp.src(resource.cdn.css, {
			read : false
		}), {
			name : 'head'
		}))
		// inject js files to html
		.pipe(plugins.inject(gulp.src(resource.cdn.js, {
			read : false
		}), {
			name : 'head'
		}))
		// replace local file to cdn url
		.pipe(plugins.cdnizer({
			fallbackTest : null,
			files : cdnjsOps
		}))
		// replace with Staticfiles cdn
		.pipe(cdnHelper.toStaticfilesCDN())
		// output
		.pipe(gulp.dest(config.dest));
	});
}

addCopyPageTask('manage');

gulp.task('copy:html', ['copy:manage.html']);