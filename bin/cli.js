#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const minimist = require('minimist');
const debug = require('debug');
const pkg = require('../package.json');

const dbg = debug(`${pkg.name}:cli`);

// https://github.com/nodejs/node/issues/6456
// Prevent truncated output on unhandledExeception(s).
const setBlocking = require('set-blocking');

setBlocking(true);

const defaults = require('../lib/default-options');
const bucketRunner = require('../index');

const argv = minimist(process.argv.slice(2), {
  default: defaults(),
  boolean: [
    'resolve-files',
    'continue-on-error',
  ],
  '--': true,
});

// To be sure.
argv['partition-size'] = parseInt(argv['partition-size'], 10);

dbg('process.argv %o', process.argv);
dbg('argv %o', argv);

if (argv.help) {
  fs.createReadStream(path.join(__dirname, 'usage.txt'))
    .pipe(process.stdout)
    .on('end', process.exit.bind(null, 1));
} else {
  bucketRunner(argv._, argv['--'].join(' '), argv, (err) => {
    if (err && typeof err === 'number') { process.exit(err); }
    if (err) throw err;
  });
}
