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

const exec = require('child_process').exec;
const path = require('path');
const objectAssign = require('object-assign');
const debug = require('debug');
const pkg = require('../package.json');

const dbg = debug(`${pkg.name}:run`);

module.exports = function runExec(cmd, opts, cb) {
  const binPath = path.join(process.cwd(), 'node_modules/.bin/');

  const env = objectAssign(
    {},
    process.env,
    { PATH: `${binPath}:${process.env.PATH}` }
  );

  dbg('exec %s', cmd);

  // We buffer stdout/stderr manually to both prevent configuring maxBuffer
  // and to have unified event handling on the process.
  let stdout = '';
  let stderr = '';

  const child = exec(cmd, {
    env,
    encoding: 'utf-8',
  });

  if (opts['stream-output']) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } else {
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
  }

  // `close` is used because `exit` can fire before the final `data` event
  // is emitted from stdout/stderr streams, in the case of buffering.
  child.on('close', (code, signal) => {
    dbg('exec close, code %s, signal %s, stdout.length %d, stderr.length %d',
      code, signal, stdout.length, stderr.length);

    // These will be empty strings if stream-output === true
    // Note: previous versions used console.log for both of these streams.
    // Unified stdout was likely in error, and the use of console.log also
    // likely introduced extraneous new lines.
    if (stdout.length) process.stdout.write(stdout);
    if (stderr.length) process.stderr.write(stderr);

    // Either code or signal is guaranteed to be non-null.
    if (code === 0) cb(null);
    else cb(signal || code);
  });

  // This is not if the child process exits in error, but more if the process
  // cannot be spawned for some reason. In this situation, the `close` event
  // shouldn't fire because a process was never spawned.
  child.on('error', cb);
};
