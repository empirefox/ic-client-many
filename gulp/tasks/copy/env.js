'use strict';
var request = require('sync-request');
var utils = require('../../utils');

var oauthShows = require('./oauth-shows.json');
var env = require('../../envs/env-' + utils.getEnvName() + '.json');

var res = request('GET', env.ApiData.ApiOrigin + '/oauth/oauths');
env.ApiData.Providers = JSON.parse(res.getBody()).map(function(sp) {
  let lp = oauthShows[sp.Name];
  if (!lp) {
    console.log('Provider not found in oauth-shows.json:', sp.Name);
  }
  Object.assign(sp, lp);
  sp.Path = '/o/p/' + sp.Name;
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
});

module.exports = env;
