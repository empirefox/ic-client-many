'use strict';

angular.module('app.service.pcfactory', ['app.service.streams', 'app.system.const']).factory('PCFactory', ['Streams', 'SystemData',
function(Streams, SystemData) {
	function NewPeerConn(cid, ws) {
		var pc = new RTCPeerConnection({
			constraints : {
				mandatory : {
					OfferToReceiveAudio : true,
					OfferToReceiveVideo : true
				},
				optional : []
			},

			onICE : function(candidate) {
				console.log("onicecandidate:", candidate);
				candidate = {
					type : "candidate",
					sdpMLineIndex : candidate.sdpMLineIndex,
					candidate : candidate.candidate
				};
				ws.send(JSON.stringify(candidate));
			},
			onRemoteStream : function(stream) {
				Streams.add(cid, stream);
			},
			onRemoteStreamEnded : function() {
				Streams.remove(cid);
			},

			onOfferSDP : function(offerSDP) {
				ws.send(JSON.stringify(offerSDP));
				console.log("sent offer:", offerSDP);
			}
		});
		return pc;
	}

	var service = {};

	var urlPrefix = 'wss://' + SystemData.Host + '/many/signaling/';
	var wss = {};

	service.createPeerConn = function(room, camera) {
		var pc;
		var target = room + '/' + camera;
		var ws = new WebSocket(urlPrefix + target + '/' + Math.random().toString(36).slice(2));

		ws.onopen = function() {
			wss[target] = ws;
			pc = NewPeerConn(camera, ws);
		};
		ws.onclose = function() {
			pc.close();
			delete wss[target];
		};
		ws.onmessage = function(e) {
			console.log('ws.onmessage:', e.data);
			var signal = JSON.parse(e.data);
			switch(signal.type) {
				case 'answer':
					pc.addAnswerSDP(signal);
					break;
				case 'candidate':
					pc.addICE(signal);
			}
		};
	};

	service.closePeerConn = function(room, camera) {
		var target = room + '/' + camera;
		var ws = wss[target];
		if (ws) {
			if (ws.readyState < 2) {
				ws.close();
			}
			delete wss[target];
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
}]);
