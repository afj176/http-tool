'use strict';
const pkg = require('../package.json');

const yargs = require('yargs');

module.exports = yargs
  .option('auth', {
    alias: 'a',
    describe: 'Specify <username:password> or just <username> for HTTP authentication',
    type: 'string'
  })
  .option('no-color', {
    describe: 'Do not use color in the output',
    type: 'boolean'
  })
  .option('output', {
    alias: 'o',
    describe: 'Write output to a file instead of stdout',
    type: 'string'
  })
  .option('cookie', {
    alias: 'c',
    describe: 'Set a cookie in the request',
    type: 'string'
  })
  .option('data', {
    alias: 'd',
    describe: 'Set the request body data',
    type: 'string'
  })
  .option('method', {
    alias: 'm',
    describe: 'Set the HTTP method to use',
    type: 'string',
    default: 'GET'
  })
  .option('header', {
    alias: 'H',
    describe: 'Pass a custom header to the request',
    type: 'string'
  })
  .option('headers-only', {
    alias: 'r',
    describe: 'Only include the response headers in the output',
    type: 'boolean'
  })
  .option('body-only', {
    alias: 'b',
    describe: 'Only include the response body in the output',
    type: 'boolean'
  })
  .usage('Usage: $0 [options] <URL>')
  .version(pkg.version)
  .help()
  .argv;
