'use strict';

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
