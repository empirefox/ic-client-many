var gulp = require('gulp');
var Lazy = require("lazy.js");
var concat = require('gulp-concat');
var header = require('gulp-header');
var pkg = require('../../../package.json');
var pages = require('../../config').pages;
var config = require('../../config').styles;

function addCopyPageCssTask(pagename) {
	var resource = require('../../resource/' + pagename + '.json').local || {};

	gulp.task('copy:' + pagename + '.css', function() {
		var banner = '/*! L2M v' + pkg.version + ' | ' + pkg.license.type + ' License' + ' | ' + pkg.homepage + ' */\n\n';
		var src = Lazy([resource.css, config.src]).flatten().toArray();
		return gulp.src(src).pipe(concat(pagename + '.css')).pipe(header(banner)).pipe(gulp.dest(config.dest));

	});
}

var tasks = [];
pages.forEach(function(page) {
	addCopyPageCssTask(page);
	// 'copy:manage.css'
	tasks.push('copy:' + page + '.css');
});

gulp.task('copy:styles', tasks);