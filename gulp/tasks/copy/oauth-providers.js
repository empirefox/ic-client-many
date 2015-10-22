'use strict';

var providers = {
  "mock": {
    "AuthURL": "http://127.0.0.1:14000/authorize",
    "Icon": "fa fa-sign-in",
  },
  "qq": {
    "AuthURL": "https://graph.qq.com/oauth2.0/authorize",
    "Scope": "get_user_info",
    "Icon": "fa icon-CN_tencent_QQ",
    popupOptions: {
      width: 724,
      height: 457,
    },
  },
  "baidu": {
    "AuthURL": "https://openapi.baidu.com/oauth/2.0/authorize",
    "Scope": "basic",
    "Icon": "fa icon-CN_baidu",
    popupOptions: {
      width: 676,
      height: 541,
    },
    getPictrue: (user) => `http://tb.himg.baidu.com/sys/portrait/item/${user.Picture}`,
  },
  "facebook": {
    getPictrue: (oid) => `https://graph.facebook.com/v2.3/${oid}/picture?type=large`,
  },
  "google": {},
  "github": {},
  "instagram": {},
  "linkedin": {},
  "live": {
    "Btn": "btn-microsoft",
    "Icon": "fa fa-windows",
  },
  "yahoo": {},
};

module.exports = providers;
