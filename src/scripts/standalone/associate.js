'use strict';

function exchange() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/o/associate', true);
  xhr.setRequestHeader("Content-type", "text/plain; charset=utf-8");
  xhr.setRequestHeader("Authorization", 'Bearer ' + window.sessionStorage.getItem('api-token'));
  xhr.responseType = 'json';

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        window.location.assign('/account.html');
      } else {
        window.location.assign('/account.html' + '&error=' + (xhr.status || 0));
      }
    }
  };
  xhr.onerror = function() {
    window.location.assign('/account.html' + '&error=' + (xhr.status || 0));
  };
  xhr.send();
}

exchange();
