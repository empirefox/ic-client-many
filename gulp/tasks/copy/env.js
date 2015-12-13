'use strict';
var request = require('sync-request');
var utils = require('../../utils');

var sequence = ['mock', 'qq', 'baidu', 'google', 'facebook', 'github', 'twitter', 'linkedin', 'instagram', 'live', 'yahoo'];
var oauthProviders = require('./oauth-providers');
var env = require('../../envs/env-' + utils.getEnvName() + '.json');
try {
  var res = request('GET', env.ApiData.ApiOrigin + '/oauth/oauths');
  env.ApiData.Providers = JSON.parse(res.getBody()).map((sp) => {
    console.log('Got ApiData...');
    let lp = oauthProviders[sp.Name];
    if (!lp) {
      console.log('Provider not found in oauth-shows.json:', sp.Name);
    }
    Object.assign(sp, lp);
    sp.Path = '/o/p/' + sp.Name;
    if (sp.proxied){
      sp.Path = env.proxyAuthServer + sp.Path;
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
}

env.ApiData.LoginUrl = '/login.html';
env.ApiData.Stuns = require('./stuns.json').map(s => 'stun:' + s);

module.exports = env;
