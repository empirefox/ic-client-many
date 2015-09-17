'use strict';

(function() {
  var ipc = require('ipc');

  // TODO modify ic-one
  /*jshint unused:false*/
  function exchange() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/o/token?target=one', true);
    xhr.setRequestHeader("Content-type", "text/plain; charset=utf-8");
    xhr.responseType = 'text';

    xhr.onload = function(e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          ipc.sendToHost('reg-token', xhr.response);
          xhr.abort();
        } else {
          ipc.sendToHost('reg-token-error', xhr.statusText);
        }
      }
    };
    xhr.onerror = function(e) {
      ipc.sendToHost('reg-token-error', xhr.statusText);
    };

    xhr.send();
  }

  exchange();

})();
