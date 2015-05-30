var gulp = require('gulp');
var Lazy = require("lazy.js");
var plugins = require('gulp-load-plugins')();
var angularFilesort = plugins.angularFilesort;
var angularBuilder = plugins.angularBuilder;
var streamqueue = require('streamqueue');
var toStaticfilesCDN = require('./cdn-helper').toStaticfilesCDN();
var pages = require('../../config').pages;
var config = require('../../config').scripts;

function addCopyPageJsTask(pagename) {
	var resource = require('../../resource/' + pagename + '.json').local || {};
	gulp.task('copy:' + pagename + '.js', function() {
		// var src = Lazy([resource.js, config.src]).flatten().toArray();

		return streamqueue({
			objectMode : true
		},
		// third libs that are not in cdn
		gulp.src(resource.js),
		// local src filterd by pagename|modulename
		gulp.src(config.src).pipe(angularBuilder(['./src/scripts/' + pagename + '.js'], {
			appModule : pagename,
			globalDependencies : ['dialogs', 'toaster']
		}))).
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

