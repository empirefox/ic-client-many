var swig = require('swig');
var r = new swig.Swig({
	locals : {
		src : './src',
		dest : './dist',
		test : './test',
		views : 'views'
	}
}).render;

var config = {
	render : r,
	port : 8080,
	dest : r('{{ dest }}'),
	'index.html' : {
		src : r('{{ src }}/index.html'),
		dest : r('{{ dest }}')
	},
	scripts : {
		src : r('{{ src }}/scripts/**/*.js'),
		tpl : r('{{ src }}/{{ views }}/**/*.html'),
		dest : r('{{ dest }}/js'),
		name : 'app.min.js'
	},
	styles : {
		src : r('{{ src }}/styles/*.css'),
		dest : r('{{ dest }}/css'),
		name : 'app.css'
	},
	misc : {
		src : [r('{{ src }}/.*'), r('!{{ src }}/index.html'), r('!{{ src }}/scripts'), r('!{{ src }}/styles'), r('!{{ src }}/{{ views }}')],
		dest : r('{{ dest }}')
	},
	test : {
		fixtures : r('{{ test }}/fixtures/**/*.json'),
		unit : [r('{{ test }}/unit/helper.js'), r('{{ test }}/unit/**/*.js')],
		e2e : r('{{ test }}/e2e/**/*.scenario.js')
	},
	jsdelivr : {
		cssReg : /<!--\s*jsdelivr-css\s*-->/g,
		jsReg : /<!--\s*jsdelivr-js\s*-->/g
	},

	images : {
		src : r("{{ src }}/images/**"),
		dest : r("{{ dest }}/images")
	}
};

module.exports = config;
