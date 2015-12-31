'use strict';

// used by build and run time
angular.module('app.const.providers-config', []).
constant('satellizerProvidersConfig', function(SatellizerConfig, AppSystem, state) {
  return AppSystem.Providers.map(function(sp) {
    var params = {
      name: sp.Name,
      url: sp.Proxied ? AppSystem.ProxyAuthServer + sp.Path : sp.Path,
      clientId: sp.ClientID,
      state: state,
    };
    if (sp.Scope) {
      params.scope = sp.Scope;
    }

    angular.forEach([
      'defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams',
      'scope', 'scopePrefix', 'scopeDelimiter', 'display', 'confirmLogin', 'popupOptions'
    ], function(k) {
      if (sp[k]) {
        params[k] = sp[k];
      }
    });

    if (SatellizerConfig.providers[sp.Name]) {
      if (sp.RedirectURL) {
        params.redirectUri = sp.RedirectURL;
      }
      params.exist = true;
    } else {
      params.redirectUri = sp.RedirectURL ? sp.RedirectURL : window.location.origin;
      params.authorizationEndpoint = sp.AuthURL;
    }

    return params;
  });
});
