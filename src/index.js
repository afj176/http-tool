#! /usr/bin/env node

'use strict';

const fs = require('fs');
const _ = require('lodash');
const request = require('request');
const chalk = require('chalk');
const colorizeJson = require('json-colorizer');
const debug = require('debug')('index');
const readlineSync = require('readline-sync');

const pkg = require('../package.json');
const outputFormatter = require('./output-formatter');
const args = require('./cli-args');
const headers = require('./headers');
const cookies = require('./cookies');

function validateUrl() {
  let url = args._[0]; 
  if (!url) {
    console.error('You didn\'t specify a URL');
    process.exit(1);
  } else if (!url.match(/^https?:\/\//)) {
    url = `http://${url}`;
  }

  return url;
}

function handleError(error) {
  if (error.syscall === 'getaddrinfo' && error.errno === 'ENOTFOUND') {
    console.error(`Unable to resolve host ${error.hostname}`);
  } else if (error.syscall === 'connect' && error.errno === 'ECONNREFUSED') {
    console.error(`Unable to connect to ${options.url}: Connection refused`);
  } else {
    console.error('An unexpected error has occurred.');
    console.error(error);
  }

  process.exit(1);
}


const startTime = Date.now();

const options = {
  method: args.method,
  url: validateUrl(),
  headers: {
    'User-Agent': `http-tool/${pkg.version}`
  },
  followRedirect: false
};

if (args.data) {
  options.body = args.data;
}

headers.processHeaders(args.header, options);
cookies.processCookies(args.cookie, options);

debug('Using options:', options);

if (args.auth) {
  let password;
  const arr = args.auth.split(':');
  if (arr.length === 1) {
    password = readlineSync.question('Password: ', {
      hideEchoBack: true
    });
  } else {
    password = arr[1];
  }

  const user = arr[0];
  options.auth = {
    user,
    pass: password
  };
}

request(options, (error, response, body) => {
  if (error) {
    handleError(error);
  }

  let output = '';

  if (!args['body-only']) {
    output += outputFormatter.formatStatusLine(response);
    output += '\n\n';
    output += outputFormatter.formatHeaders(response.rawHeaders);
    output += '\n\n';
  }

  if (!args['headers-only']) {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      output += colorizeJson(body);
    } else {
      output += body;
    }
  }

  if (args.output) {
    try {
      fs.writeFileSync(args.output, chalk.stripColor(output));
    } catch (error) {
      console.error(`Failed to save output to ${args.output}: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log(output);
  }

  const endTime = Date.now();
  console.log(`Completed in ${(endTime - startTime) / 1000} sec.`);

  //console.log(response);
});
