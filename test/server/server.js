'use strict';

let fs = require('fs');
let server = require('http').createServer();
let url = require('url');
let S = require('string');
let WebSocketServer = require('ws').Server;
let ctrls = new WebSocketServer({
  server: server,
  path: '/mws/ctrl',
});
let express = require('express');
let app = express();
let port = 9998;

app.use(express.static(`${__dirname}/../../dist`));

ctrls.on('connection', ws => {
  ws.so = msg => ws.send(JSON.stringify(msg));
  ws.sf = name => ws.send(fs.readFileSync(`${__dirname}/fixtures/${name}.json`, 'utf8'));

  ws.on('message', message => {
    console.log('Rec: ', message);
    let data = parseSeg(message);
    if (data.k !== 'many') {
      console.log('this message is invalid');
    }
    data = parseSeg(data.v);
    console.log('parseSeg2 result:',data);
    switch (data.k) {
      case 'Auth':
        onAuth(ws, data.v);
        break;
      default:

    }
  });
});

server.on('request', app);
server.listen(port, () => console.log('Listening on ' + server.address().port));

function parseSeg(message) {
  let r = S(message).splitLeft(':', 1);
  return {
    k: r[0],
    v: r[1],
  };
}

// many:Auth:token
function onAuth(ws, data) {
  console.log(data);
  if (data === 'token') {
    console.log('start...');
    ws.so({
      type: 'LoginOk',
    });
    ws.sf('Rooms');
    ws.sf('RoomViews');
    ws.sf('T2M/One');
    ws.sf('T2M/IcIds');
    ws.sf('T2M/Ic1');
    ws.sf('T2M/Ic2');
    ws.sf('T2M/Ic3');
    ws.sf('T2M/Ic4');
    ws.sf('T2M/Ic5');
    ws.sf('T2M/IcIdCh');
    ws.sf('T2M/XIc1');
    ws.sf('T2M/XIc5');
  }
}
