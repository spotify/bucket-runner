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

/* eslint-disable jest/expect-expect */
/* eslint-disable jest/no-test-callback */

const test = require('tape');
const run = require('../../lib/run');

function setup() {
  const write = process.stdout.write;

  return function teardown() {
    process.stdout.write = write;
  };
}

function captureOutput() {
  let output = '';

  process.stdout.write = function mockWrite(string) {
    output += string;
  };

  return function getOutput() {
    return output.trim();
  };
}

test('run: print output', (t) => {
  const teardown = setup();
  const getOutput = captureOutput();

  run('echo foo', {}, () => {
    teardown();
    t.equal(getOutput(), 'foo', 'print out after the process exit');
    t.end();
  });
});

test('run: stream output', (t) => {
  const teardown = setup();
  const getOutput = captureOutput();

  run('echo foo && sleep 0.2', { 'stream-output': true }, () => {
    t.end();
  });

  setTimeout(() => {
    teardown();
    t.equal(getOutput(), 'foo', 'print out when the process is running');
  }, 10);
});
