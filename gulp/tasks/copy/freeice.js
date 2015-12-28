'use strict';
let gulp = require('gulp');
let fs = require('fs');
let ping = require('jjg-ping');

// TODO Also Validate ice form:
// http://olegh.ftp.sh/public-stun.txt
// Here we just use freeice.
let list = require('freeice/stun.json') || [];
gulp.task('freeice', () => {
  list.map(s => ({
    host: s.split(':')[0],
    stun: s,
  })).forEach((target, index, stuns) => {
    ping.system.ping(target.host, (latency, status) => {
      if (status) {
        target.ms = latency;
      } else {
        console.log(target.host + ' is dead.');
      }
      if (index === stuns.length - 1) {
        pingCallback(stuns);
      }
    });
  });
});

function pingCallback(stuns) {
  stuns = stuns.filter(s => !!s.ms).sort((a, b) => a.ms - b.ms).map(s => s.stun);
  // process.stdout.write(JSON.stringify(stuns) + '\n');
  fs.writeFileSync(`${__dirname}/stuns.json`, JSON.stringify(stuns, null, '  '));
}
