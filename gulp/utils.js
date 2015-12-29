'use strict';

var argv = require('yargs').argv;

module.exports.getEnvName = function() {
  return argv.env || 'dev';
};

module.exports.readFile = function(name) {
  try {
    return fs.readFileSync(name, 'utf8');
  } catch (e) {
    return '';
  }
};
