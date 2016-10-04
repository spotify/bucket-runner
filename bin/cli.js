#!/usr/bin/env node

var fs = require('fs');
var os = require('os');

var path = require('path');

var minimist = require('minimist');
var debug = require('debug');

var pkg = require('../package.json');
var dbg = debug(pkg.name + ':cli');

// https://github.com/nodejs/node/issues/6456
// Prevent truncated output on unhandledExeception(s).
var setBlocking = require('set-blocking');
setBlocking(true);

var defaults = require('../lib/default-options');
var BucketRunner = require('../index');

var argv = minimist(process.argv.slice(2), {
  default: defaults(),
  boolean: [
    'resolve-files',
    'continue-on-error'
  ],
  '--': true
});

// To be sure.
argv['partition-size'] = parseInt(argv['partition-size'], 10);

dbg('process.argv %o', process.argv);
dbg('argv %o', argv);

if (argv.help) {
  fs.createReadStream(path.join(__dirname, 'usage.txt'))
    .pipe(process.stdout)
    .on('end', process.exit.bind(null, 1));
  return;
}

BucketRunner(argv._, argv['--'].join(' '), argv, function (err) {
  if (err && typeof err === 'number') { process.exit(err); };
  if (err) throw err;
});
