var test = require('tape');

var generateCommands = require('../../lib/generate-commands');

test('generateCommands: {partition} is replaced', function (t) {
  var partitions = { groups: [['a'], ['b']], names: ['name-a', 'name-b'] };
  var actual = generateCommands(partitions, '{partition} COM {partition}', true);
  var expected = ['name-a COM name-a a', 'name-b COM name-b b'];
  t.deepEqual(actual, expected);
  t.end();
});

test('generateCommands: {files} is replaced', function (t) {
  var partitions = { groups: [['a'], ['b']], names: ['name-a', 'name-b'] };
  var actual = generateCommands(partitions, '{files} COM {files}', false);
  var expected = ['a COM a', 'b COM b'];
  t.deepEqual(actual, expected);
  t.end();
});
