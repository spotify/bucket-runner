#!/usr/bin/env node

// Copyright 2015-2016 Spotify AB. All rights reserved.
//
// The contents of this file are licensed under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with the
// License. You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

'use strict';

const fs = require('fs');
const path = require('path');

// https://github.com/nodejs/node/issues/6456
// Prevent truncated output on unhandledExeception(s).
const setBlocking = require('set-blocking');

const minimist = require('minimist');
const debug = require('debug');
const pkg = require('../package.json');

const dbg = debug(`${pkg.name}:cli`);

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
