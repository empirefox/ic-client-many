'use strict';

var ipc = require('ipc');

/*jshint unused:false*/
function RegRoom(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/many/reg-room', true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.responseType = 'json';

  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        ipc.sendToHost('reg-addr', xhr.response.addr);
      } else {
        ipc.sendToHost('reg-error', xhr.statusText);
      }
    }
  };
  xhr.onerror = function(e) {
    ipc.sendToHost('reg-error', xhr.statusText);
  };

  xhr.send(JSON.stringify({
    name: name,
  }));
}

window.onclose = function() {
  ipc.sendToHost('reg-page-not-ready');
};

ipc.sendToHost('reg-page-ready');
