'use strict';

var argv = require('yargs').argv;

module.exports.getEnvName = function() {
  return argv.env || 'dev';
};
