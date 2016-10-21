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

const test = require('tape');

const generateCommands = require('../../lib/generate-commands');

test('generateCommands: {partition} is replaced', (t) => {
  const partitions = { groups: [['a'], ['b']], names: ['name-a', 'name-b'] };
  const actual = generateCommands(partitions, '{partition} COM {partition}', true);
  const expected = ['name-a COM name-a a', 'name-b COM name-b b'];
  t.deepEqual(actual, expected);
  t.end();
});

test('generateCommands: {files} is replaced', (t) => {
  const partitions = { groups: [['a'], ['b']], names: ['name-a', 'name-b'] };
  const actual = generateCommands(partitions, '{files} COM {files}', false);
  const expected = ['a COM a', 'b COM b'];
  t.deepEqual(actual, expected);
  t.end();
});
