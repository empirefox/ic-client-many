var gulp = require('gulp');
var Lazy = require("lazy.js");
var plugins = require('gulp-load-plugins')();
var angularFilesort = plugins.angularFilesort;
var angularDependency = plugins.angularDependency;
var StreamQueue = require('streamqueue');
var toStaticfilesCDN = require('./cdn-helper').toStaticfilesCDN();
var pages = require('../../config').pages;
var config = require('../../config').scripts;

function addCopyPageJsTask(pagename) {
	gulp.task('copy:' + pagename + '.js', function() {
		// var src = Lazy([resource.js, config.src]).flatten().toArray();
		var resource = require('../../resource/' + pagename + '.json').local;

		return new StreamQueue({
			objectMode : true
		}).
		// third libs that are not in cdn
		queue(gulp.src(resource.js)).
		// local src filterd by pagename|modulename
		queue(gulp.src(config.src).pipe(angularDependency(pagename))).
		// done
		done().
		// sort files
		//		.pipe(angularFilesort())
		// concat
		pipe(plugins.concat(pagename + '.js')).pipe(toStaticfilesCDN).
		//.pipe(plugins.uglify())
		pipe(gulp.dest(config.dest));
	});
}

gulp.task('copy:scripts:tpl', function() {
	// all tpl
	return gulp.src(config.tpl).pipe(plugins.angularTemplatecache({
		filename : 'templates.js',
		standalone : true,
		module : 'l2m-tpl',
		root : '/views'
	})).pipe(gulp.dest(config.dest));
});

var tasks = ['copy:scripts:tpl'];
pages.forEach(function(page) {
	addCopyPageJsTask(page);
	tasks.push('copy:' + page + '.js');
});

gulp.task('copy:scripts', tasks);

