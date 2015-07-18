var swig = require('swig');
var r = new swig.Swig({
  locals: {
    src: 'src',
    dest: 'dist',
    test: 'test',
    views: 'views',
    base: process.env.PWD,
    pagename: '{{ pagename }}',
  }
}).render;

var config = {
  render: r,
  port: 8080,
  dest: r('{{ dest }}'),
  pages: ['rooms', 'login', 'reg-room', 'join', 'index', 'dl'],
  scripts: {
    src: r('{{ src }}/scripts/**/*.js'),
    tpl: r('{{ src }}/{{ views }}/**/*.html'),
    dest: r('{{ dest }}/js'),
  },
  stylus: {
    paths: [r('{{ base }}/{{ src }}/stylus'), r('{{ base }}/bower_components')],
    src: r('{{ src }}/stylus/*.styl'),
    dest: r('{{ dest }}/css'),
  },
  styles: {
    src: r('{{ src }}/styles/*.css'),
    dest: r('{{ dest }}/css'),
    name: 'app.css',
  },
  misc: {
    src: r('{{ src }}/static/**'),
    dest: r('{{ dest }}'),
  },
  test: {
    fixtures: r('{{ test }}/fixtures/**/*.json'),
    unit: [r('{{ test }}/unit/helper.js'), r('{{ test }}/unit/**/*.js')],
    e2e: r('{{ test }}/e2e/**/*.scenario.js'),
  },
  jsdelivr: {
    cssReg: /<!--\s*jsdelivr-css\s*-->/g,
    jsReg: /<!--\s*jsdelivr-js\s*-->/g,
  },

  sass: {
    src: r('{{ src }}/sass/*.{sass,scss}'),
    dest: r('{{ dest }}'),
    settings: {
      // Required if you want to use SASS syntax
      // See https://github.com/dlmanning/gulp-sass/issues/81
      sourceComments: 'map',
      imagePath: '/images', // Used by the image-url helper
    },
  },
  images: {
    src: r("{{ src }}/images/**"),
    dest: r("{{ dest }}/images"),
  },
};

module.exports = config;
