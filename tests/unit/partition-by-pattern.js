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

const partitionByPattern = require('../../lib/partition-by-pattern');

test('partitionByPattern: (.)', (t) => {
  const files = ['f/a', 'f/b', 'g/c', 'g/d', 'h/e'];

  const actual = partitionByPattern('(.)', files);
  const expected = {
    groups: [['f/a', 'f/b'], ['g/c', 'g/d'], ['h/e']],
    names: ['f', 'g', 'h'],
  };
  t.deepEqual(actual, expected, 'Groups by 2');
  t.end();
});

test('partitionByPattern: non-matching are excluded', (t) => {
  const files = ['a', 'b', 'c', 'd', 'e'];

  const actual = partitionByPattern('([a-d])', files);
  const expected = {
    groups: [['a'], ['b'], ['c'], ['d']],
    names: ['a', 'b', 'c', 'd'],
  };
  t.deepEqual(actual, expected, '4 groups');
  t.end();
});

test('partitionByPattern: non-matching', (t) => {
  const files = ['a', 'b', 'c', 'd', 'e'];

  const actual = partitionByPattern('(non-matching)', files);
  const expected = { groups: [], names: [] };
  t.deepEqual(actual, expected, 'no groups');
  t.end();
});
