'use strict';

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
