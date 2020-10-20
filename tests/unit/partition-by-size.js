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

const partitionBySize = require('../../lib/partition-by-size');

test('partitionBySize: 2', (t) => {
  const files = ['a', 'b', 'c', 'd', 'e'];

  const actual = partitionBySize(2, files);
  const expected = { groups: [['a', 'b'], ['c', 'd'], ['e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 2');
  t.end();
});


test('partitionBySize: 1', (t) => {
  const files = ['a', 'b', 'c', 'd', 'e'];

  const actual = partitionBySize(1, files);
  const expected = { groups: [['a'], ['b'], ['c'], ['d'], ['e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 1');
  t.end();
});

test('partitionBySize: 10', (t) => {
  const files = ['a', 'b', 'c', 'd', 'e'];

  const actual = partitionBySize(10, files);
  const expected = { groups: [['a', 'b', 'c', 'd', 'e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 10 with no extras');
  t.end();
});
