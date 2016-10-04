var test = require('tape');

var partitionByPattern = require('../../lib/partition-by-pattern');

test('partitionByPattern: (.)', function (t) {
  var files = ['f/a', 'f/b', 'g/c', 'g/d', 'h/e'];

  var actual = partitionByPattern('(.)', files);
  var expected = {
    groups: [['f/a', 'f/b'], ['g/c', 'g/d'], ['h/e']],
    names: ['f', 'g', 'h']
  };
  t.deepEqual(actual, expected, 'Groups by 2');
  t.end();
});

test('partitionByPattern: non-matching are excluded', function (t) {
  var files = ['a', 'b', 'c', 'd', 'e'];

  var actual = partitionByPattern('([a-d])', files);
  var expected = {
    groups: [['a'], ['b'], ['c'], ['d']],
    names: ['a', 'b', 'c', 'd']
  };
  t.deepEqual(actual, expected, '4 groups');
  t.end();
});

test('partitionByPattern: non-matching', function (t) {
  var files = ['a', 'b', 'c', 'd', 'e'];

  var actual = partitionByPattern('(non-matching)', files);
  var expected = { groups: [], names: [] };
  t.deepEqual(actual, expected, 'no groups');
  t.end();
});
