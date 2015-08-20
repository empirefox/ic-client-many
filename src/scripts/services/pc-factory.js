'use strict';

angular.module('app.service.pcfactory', ['app.service.streams', 'app.system', 'app.service.auth']).factory('PCFactory', [
  '$window', 'Streams', 'AppSystem', 'AuthToken',
  function($window, Streams, AppSystem, AuthToken) {
    function newPeerConn(camera, ws) {
      var pc = new RTCPeerConnection({
        constraints: {
          mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true,
          },
          optional: [],
        },

        onICE: function(candidate) {
          // console.log("onicecandidate:", candidate);
          candidate = {
            type: "candidate",
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate,
          };
          ws.send(JSON.stringify(candidate));
        },
        onRemoteStream: function(stream) {
          Streams.add(camera, stream);
        },
        onRemoteStreamEnded: function() {
          Streams.remove(camera);
        },

        onOfferSDP: function(offerSDP) {
          ws.send(JSON.stringify(offerSDP));
          // console.log("sent offer:", offerSDP);
        }
      });
      return pc;
    }

    var service = {};
    var wss = {};

    service.createPeerConn = function(room, camera) {
      if (camera.playing) {
        return;
      }
      camera.playing = true;
      var pc;
      var target = room.id + '/' + camera.id;
      var ws = new WebSocket(AppSystem.signalingUrl);

      ws.onopen = function() {
        AuthToken.send(ws);
      };
      ws.onclose = function() {
        Streams.remove(camera);
        delete wss[target];
        try {
          pc.close();
        } /*jshint unused:true */
        catch (e) {
          // ignore
        }
      };
      ws.onmessage = function(e) {
        // console.log('ws.onmessage:', e.data);
        var signal = JSON.parse(e.data);
        switch (signal.type) {
          case 'Login':
            if (signal.content) {
              ws.send(JSON.stringify({
                room: room.id,
                camera: camera.id,
                reciever: Math.random().toString(36).slice(2),
              }));
            } else {
              ws.close();
              console.log('Login failed');
            }
            break;
          case 'Accepted':
            wss[target] = ws;
            pc = newPeerConn(camera, ws);
            break;
          case 'answer':
            pc.addAnswerSDP(signal);
            break;
          case 'candidate':
            pc.addICE(signal);
            break;
        }
      };
    };

    service.closePeerConn = function(room, camera) {
      var target = room.id + '/' + camera.id;
      var ws = wss[target];
      if (ws) {
        delete wss[target];
        if (ws.readyState < 2) {
          ws.close();
        }
      }
    };

    service.clear = function() {
      angular.forEach(wss, function(ws) {
        if (ws && ws.readyState < 2) {
          ws.close();
        }
      });
      wss = {};
      Streams.clear();
    };

    return service;
  }
]);
