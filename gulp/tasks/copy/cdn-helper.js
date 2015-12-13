var swig = require('swig');
var replace = require('gulp-replace');
var Lazy = require("lazy.js");
var config = require('../../config');

var cdnReplacer = {
  css: {
    reg: config.jsdelivr.cssReg,
    tpl: swig.compile('<link rel="stylesheet" href="https://cdn.jsdelivr.net/g/{{ cdns }}" />')
  },
  js: {
    reg: config.jsdelivr.jsReg,
    tpl: swig.compile('<script src="https://cdn.jsdelivr.net/g/{{ cdns }}"></script>')
  }
};

var helper = {

  toJsdelivr: function(replacer, names) {
    var cdns = Lazy(names).compact().map(function(cdn) {
      var files = (typeof cdn.files === 'string' && cdn.files.length > 0) ? '(' + cdn.files + ')' : '';
      return cdn.package + files;
    }).join();
    var markup = cdns === '' ? '' : replacer.tpl({
      cdns: cdns
    });
    return replace(replacer.reg, markup);
  },

  toStaticfilesCDN: function() {
    return replace(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs/g, 'https://dn-cdnjscn.qbox.me/ajax/libs');
    // return replace(/\/\/cdnjs\.cloudflare\.com\/ajax\/libs/g, 'https://cdn.bootcss.com');
  }
};

helper.toJsdelivrCss = function(names) {
  return helper.toJsdelivr(cdnReplacer.css, names);
};

helper.toJsdelivrJs = function(names) {
  return helper.toJsdelivr(cdnReplacer.js, names);
};

module.exports = helper;
