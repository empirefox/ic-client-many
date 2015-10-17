'use strict';

// http://olegh.ftp.sh/public-stun.txt
var stunTxt = `
23.21.150.121:3478
iphone-stun.strato-iphone.de:3478
numb.viagenie.ca:3478`;

var hostRegx = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])(:[0-9]{1,5})?$/;

module.exports = stunTxt.split(/\s+/).filter(s => hostRegx.test(s)).map(s => {
  return {
    host: s.split(':')[0],
    stun: s,
  };
});
