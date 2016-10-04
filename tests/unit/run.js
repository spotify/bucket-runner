var test = require('tape');
var run = require('../../lib/run');

var setup = function() {
  var write = process.stdout.write;

  return function teardown() {
    process.stdout.write = write;
  };
};

var captureOutput = function() {
  var output = '';

  process.stdout.write = function(string) {
    output += string;
  };

  return function getOutput() {
    return output.trim();
  };
};

test('run: print output', function(t) {
  var teardown = setup();
  var getOutput = captureOutput();

  run('echo foo', {}, function() {
    teardown();
    t.equal(getOutput(), 'foo', 'print out after the process exit');
    t.end();
  });
});

test('run: stream output', function(t) {
  var teardown = setup();
  var getOutput = captureOutput();

  run('echo foo && sleep 0.2', { 'stream-output': true }, function() {
    t.end();
  });

  setTimeout(function() {
    teardown();
    t.equal(getOutput(), 'foo', 'print out when the process is running');
  }, 10);
});
