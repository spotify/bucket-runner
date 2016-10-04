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
