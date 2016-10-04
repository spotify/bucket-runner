var test = require('tape');

var partitionBySize = require('../../lib/partition-by-size');

test('partitionBySize: 2', function (t) {
  var files = ['a', 'b', 'c', 'd', 'e'];

  var actual = partitionBySize(2, files);
  var expected = { groups: [['a', 'b'], ['c', 'd'], ['e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 2');
  t.end();
});


test('partitionBySize: 1', function (t) {
  var files = ['a', 'b', 'c', 'd', 'e'];

  var actual = partitionBySize(1, files);
  var expected = { groups: [['a'], ['b'], ['c'], ['d'], ['e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 1');
  t.end();
});

test('partitionBySize: 10', function (t) {
  var files = ['a', 'b', 'c', 'd', 'e'];

  var actual = partitionBySize(10, files);
  var expected = { groups: [['a', 'b', 'c', 'd', 'e']], names: [] };
  t.deepEqual(actual, expected, 'Groups by 10 with no extras');
  t.end();
});
