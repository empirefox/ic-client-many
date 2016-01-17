'use strict';
var request = require('sync-request');
var utils = require('../../utils');

var sequence = ['mock', 'qq', 'baidu', 'google', 'facebook', 'github', 'twitter', 'linkedin', 'instagram', 'live', 'yahoo'];
var oauthProviders = require('./oauth-providers');
var env = require('../../envs/env-' + utils.getEnvName() + '.json');

function syncGet(path) {
  return JSON.parse(request('GET', env.ApiData.ApiOrigin + path).getBody());
}

try {
  var proxedPrds = syncGet('/oauth/proxied');
  env.ApiData.Providers = syncGet('/oauth/oauths').map((sp) => {
    console.log('Got ApiData...');
    let lp = oauthProviders[sp.Name];
    if (!lp) {
      console.log('Provider not found in oauth-shows.json:', sp.Name);
    }
    Object.assign(sp, lp);
    sp.Path = '/o/p/' + sp.Name;
    if (proxedPrds.indexOf(sp.Name) !== -1) {
      sp.Proxied = true;
    }
    sp.Text = 'PAGE.LOGIN.OAUTH.' + sp.Name;
    // sp.Url = env.ApiData.ApiOrigin + sp.Path;
    if (!sp.Btn) {
      // use default bootstrap-social Btn
      sp.Btn = 'btn-' + sp.Name;
    }
    if (!sp.Icon) {
      // use default font-awesome Icon
      sp.Icon = 'fa fa-' + sp.Name;
    }
    return sp;
  }).sort((a, b) => sequence.indexOf(a.Name) - sequence.indexOf(b.Name));
} catch (e) {
  console.log('env.js', e);
  env.ApiData.Providers = [];
}

env.ApiData.LoginUrl = '/login.html';
env.ApiData.Stuns = require('./stuns.json');

module.exports = env;
