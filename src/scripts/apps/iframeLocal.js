'use strict';

(function() {
  var target = 'regParent';
  var messenger = new window.Messenger('regFrame', 'RegProject');
  messenger.listen(function(msg) {
    sendToServer(msg);
  });
  messenger.addTarget(window.parent, target);

  function sendToTarget(obj) {
    messenger.targets[target].send(JSON.stringify(obj));
  }

  var connection = new window.WebSocket('ws://127.0.0.1:12301/register');
  connection.binaryType = 'arraybuffer';

  connection.onopen = function() {
    sendToTarget({
      type: 'open',
    });
  };
  connection.onclose = function() {
    sendToTarget({
      type: 'close',
    });
  };

  // Log errors
  connection.onerror = function(error) {
    sendToTarget({
      type: 'error',
      content: error,
    });
  };

  // Log messages from the server
  connection.onmessage = function(e) {
    sendToTarget({
      type: 'msg',
      content: JSON.parse(e.data),
    });
  };

  function sendToServer(msg) {
    if (connection) {
      connection.send(msg);
    }
  }

})();
