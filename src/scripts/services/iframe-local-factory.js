'use strict';

angular.module('app.service.local', []).factory('IframeLocalService', [
  '$rootScope', '$log',
  function($rootScope, $log) {

    function Messenger(ops) {
      var target = document.getElementById(ops.target);
      if (target) {
        $log.error('target id already exist');
        return null;
      }

      this.scope = ops.scope || $rootScope;
      var this_ = this;

      var frame = angular.element('<iframe id="' + ops.target + '" src="' + ops.src + '" width="0" height="0"></iframe>');
      angular.element(document.getElementsByTagName("body").item(0)).append(frame);
      target = document.getElementById(ops.target);

      this.messenger = new window.Messenger(ops.name, ops.projectName);

      this.messenger.listen(function(msg) {
        // Messenger will wrap origin content
        var data = JSON.parse(msg);
        switch (data.type) {
          case 'open':
            if (ops.onOpen) {
              ops.onOpen();
            }
            break;
          case 'close':
            if (ops.onClose) {
              ops.onClose();
            }
            break;
          case 'error':
            if (ops.onError) {
              ops.onError(data.content);
            }
            break;
          case 'msg':
            if (ops.onClose) {
              ops.onMessage(data.content);
            }
            break;
          default:
            return;
        }
        if (!this_.scope.$$phase) {
          this_.scope.$digest();
        }
      });

      this.messenger.addTarget(target.contentWindow, ops.target);

      this.send = function(msg) {
        this_.messenger.send(msg);
      };
    }

    return {
      create: function(ops) {
        return new Messenger(ops);
      },
    };
  }
]);
