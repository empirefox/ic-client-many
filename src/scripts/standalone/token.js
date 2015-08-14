'use strict';

function getURLParam(oTarget, sVar) {
  return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function getLoginHref(src) {
  var url = document.createElement('a');
  url.href = decodeURIComponent(src);
  switch (url.pathname) {
    case '/login.html':
    case '/logout':
    case '/token.html':
    case '/rooms.html':
    case '/index.html':
    case '/':
      return 'login.html';
  }
  return '/login.html?from=' + src;
}

function exchange() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/o/token', true);
  xhr.setRequestHeader("Content-type", "text/plain; charset=utf-8");
  xhr.responseType = 'text';

  var src = getURLParam(window.location, 'from') || '/rooms.html';

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        window.sessionStorage.setItem('api-token', xhr.response);
        window.location.assign(decodeURIComponent(src));
      } else {
        window.location.assign(getLoginHref(src) + '&error=' + (xhr.status || 0));
      }
    }
  };
  xhr.onerror = function() {
    window.location.assign(getLoginHref(src) + '&error=' + (xhr.status || 0));
  };
  xhr.send();
}

exchange();
