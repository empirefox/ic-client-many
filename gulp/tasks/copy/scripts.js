'use strict';

let fs = require('fs');
let gulp = require('gulp');
let env = require('./env');
let Lazy = require("lazy.js");
let $ = require('gulp-load-plugins')();
let angularFilesort = $.angularFilesort;
let ngDeps = $.angularDependency;
let htmlmin = $.htmlMinifier;
let runSequence = require('run-sequence');
let StreamQueue = require('streamqueue');
let toStaticfilesCDN = require('./cdn-helper').toStaticfilesCDN;
let pages = require('../../config').pages;
let config = require('../../config').scripts;
let utils = require('../../utils');
let swig = $.swig;
let ngcompile = require('ng-node-compile');
ngcompile.prototype.envReadyCallback = () => global.Node = window.Node;

let exclude = ["ng", "ngAnimate", "ngCookies", "ngLocale", "ngSanitize", "pascalprecht.translate",
  "ui.bootstrap", "ui.bootstrap.tpls", "angular-loading-bar", "chieffancypants.loadingBar", "satellizer",
  "angular.filter", "ngDialog", "toaster", "ngWebSocket", "angular-websocket", "angularMoment",
  "irontec.simpleChat", "app.tpl", 'app.system'
];
let commonModule = 'app.common';
let commons = ['app.service.detect', 'app.i18n', 'app.navs', 'app.service.satellizer', 'app.service.path'];

function addCopyPageJsTask(pagename) {
  gulp.task(`copy:${pagename}.js`, () => {
    // let src = Lazy([resource.js, config.src]).flatten().toArray();
    let resource = require(`../../resource/${pagename}.json`).local;

    return new StreamQueue({
        objectMode: true,
      }).
      // third libs that are not in cdn
    queue(gulp.src(resource.js)).
      // local src filterd by pagename|modulename
    queue(gulp.src(config.src).pipe(ngDeps(pagename, Lazy([exclude, commonModule, commons]).flatten().toArray()))).
      // done
    done().
      // concat
    pipe($.concat(pagename + '.js')).pipe(toStaticfilesCDN()).
      // pipe($.uglify()).
    pipe(gulp.dest(config.dest));
  });
}

gulp.task('copy:scripts:export', () => {
  let ngEnviorment = new ngcompile([{
    name: 'satellizer',
    path: './bower_components/satellizer/satellizer.js',
  }, {
    name: 'app.const.providers-config',
    path: 'src/scripts/constants/providers-config-const.js',
  }, {
    name: 'pascalprecht.translate',
    path: './bower_components/angular-translate/angular-translate.js',
  }, {
    name: 'app.i18n.zh_CN',
    path: 'src/scripts/share/translate_zh-CN.js',
  }, {
    name: 'app.i18n.en_US',
    path: 'src/scripts/share/translate_en-US.js',
  }], './bower_components/angular/angular.js');

  let $injector = window.angular.injector(['ng', 'satellizer', 'app.const.providers-config', 'app.i18n.zh_CN', 'app.i18n.en_US']);
  $injector.invoke((SatellizerConfig, SatellizerPopup, SatellizerOauth2, I18nZhCN, satellizerProvidersConfig) => {

    let stateRegex = /&state=state/g;
    let authUrls = {};
    SatellizerPopup.open = (url, name) => {
      authUrls[name] = stateRegex.test(url) ? url.replace(stateRegex, '') + '&state=' : url;
      return {
        // needed by satellizer
        pollPopup: () => Promise.reject(),
      };
    };
    env.ApiData.Providers && satellizerProvidersConfig(SatellizerConfig, env.ApiData, 'state').forEach(r => {
      // will call SatellizerPopup.open
      new SatellizerOauth2().open(Object.assign({}, SatellizerConfig.providers[r.name], r));
    });

    let ApiDataJson = JSON.stringify({
      ApiOrigin: env.ApiData.ApiOrigin,
      ProxyAuthServer: env.ApiData.ProxyAuthServer,
      Providers: env.ApiData.Providers.map(p => {
        p.AuthUrlTpl = authUrls[p.Name];
        return p;
      }),
      Translates: I18nZhCN.PAGE.LOGIN.OAUTH,
      Stuns: require('./stuns.json'),
    });
    fs.writeFileSync(config.dest + '/api-data.js', `var ApiData=${ApiDataJson};`);
    fs.writeFileSync(config.dest + '/api-data.json', `${ApiDataJson}`);

  });
});

gulp.task('copy:scripts:common', function() {
  // ApiData and Providers
  let apiScripts = $.ngConstant({
    name: 'app.system',
    stream: true,
    constants: {
      AppSystem: env.ApiData,
    },
  }).pipe($.header(utils.readFile(`src/scripts/preload/env-${utils.getEnvName()}.js`)));

  // all local modules
  let commonScripts = gulp.src(config.src).pipe(ngDeps(commonModule, exclude)).pipe($.concat('common.js'));

  // all tpl
  let tplScripts = gulp.src(config.tpl).
  pipe(htmlmin({
    collapseWhitespace: true,
    conservativeCollapse: true,
  })).
  pipe($.angularTemplatecache({
    filename: 'templates.js',
    standalone: true,
    module: 'app.tpl',
    root: '/views',
  })).
  pipe($.rename({
    extname: '.js',
  })).
  pipe(swig({
    defaults: {
      varControls: ['[[', ']]'],
    },
    data: env,
  }));

  return new StreamQueue({
    objectMode: true,
  }).queue(apiScripts, tplScripts, commonScripts).done().
  pipe($.concat(config.commonDestName)).
    // pipe($.uglify()).
  pipe(gulp.dest(config.dest));
});

let tasks = ['copy:scripts:common', 'copy:scripts:export'];
pages.forEach(function(page) {
  addCopyPageJsTask(page);
  tasks.push(`copy:${page}.js`);
});

gulp.task('copy:scripts', function(done) {
  tasks.push(done);
  runSequence.apply(null, tasks);
});
