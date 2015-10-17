'use strict';
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var ping = require('jjg-ping');

// TODO Also Validate ice form:
// http://olegh.ftp.sh/public-stun.txt
// Here we just use freeice.
var list = require('freeice/stun.json') || [];
var destDir = jetpack.cwd('./gulp/tasks/copy');

gulp.task('freeice', () => {
  list.map(s => {
    return {
      host: s.split(':')[0],
      stun: s,
    };
  }).forEach((target, index, stuns) => {
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
  destDir.write('stuns.json', stuns);
}
