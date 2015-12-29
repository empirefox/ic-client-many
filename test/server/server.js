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
  ws.sf = name => ws.send(readFixture(name));

  ws.on('message', message => {
    console.log('Rec: ', message);
    let data = parseSeg(message);
    if (data.k !== 'many') {
      console.log('this message is invalid');
    }
    data = parseSeg(data.v);
    console.log('parseSeg2 result:', data);
    switch (data.k) {
      case 'Auth':
        onAuth(ws, data.v);
        break;
      case 'Command':
        onCommand(ws, JSON.parse(data.v));
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

function onCommand(ws, data) {
  console.log(data);
  switch (data.name) {
    case 'ManageDelRoom':
      ws.so({
        "type": "XRoom",
        "ID": data.room,
      });
      break;
    case 'ManageDelIpcam':
      ws.so({
        "type": "T2M",
        "ID": data.room,
        "name": "XIc",
        "part": data.content,
      });
      break;
    case 'ManageSetIpcam':
      data.content.UpdatedAt = 'z' + data.content.UpdatedAt;
      data.content.Online = !data.content.Online;
      ws.so({
        "type": "T2M",
        "ID": data.room,
        "name": "Ic",
        "part": data.content,
      });
      break;
    case 'ManageGetIpcam':
      let seq = parseInt(data.content.charAt(data.content.length - 1));
      console.log('ManageGetIpcam:', seq);
      if (seq === 1 || seq === 3) {
        let ic = JSON.parse(readFixture(`T2M/Ic${seq}`)).part;
        ic.Id = data.content;
        ic.Url = `rtsp://127.0.0.1/${ic.Id}`;
        ic.Rec = true;
        ic.AudioOff = true;
        ws.so({
          "type": "T2M",
          "ID": data.room,
          "name": "SecIc",
          "part": ic,
        });
      } else {
        ws.so({
          "type": "T2M",
          "ID": data.room,
          "name": "NoIc",
          "part": data.content,
        });
      }
      break;
    default:
      console.log('Wrong command:', data.name);
  }
}

// many:Auth:token
function onAuth(ws, data) {
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
  } else {
    console.log('Wrong auth:', data.name);
  }
}

function readFixture(name) {
  return fs.readFileSync(`${__dirname}/fixtures/${name}.json`, 'utf8');
}
