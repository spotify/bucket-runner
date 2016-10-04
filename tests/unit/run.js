'use strict';

const test = require('tape');
const run = require('../../lib/run');

function setup() {
  const write = process.stdout.write;

  return function teardown() {
    process.stdout.write = write;
  };
}

function captureOutput() {
  let output = '';

  process.stdout.write = function mockWrite(string) {
    output += string;
  };

  return function getOutput() {
    return output.trim();
  };
}

test('run: print output', (t) => {
  const teardown = setup();
  const getOutput = captureOutput();

  run('echo foo', {}, () => {
    teardown();
    t.equal(getOutput(), 'foo', 'print out after the process exit');
    t.end();
  });
});

test('run: stream output', (t) => {
  const teardown = setup();
  const getOutput = captureOutput();

  run('echo foo && sleep 0.2', { 'stream-output': true }, () => {
    t.end();
  });

  setTimeout(() => {
    teardown();
    t.equal(getOutput(), 'foo', 'print out when the process is running');
  }, 10);
});
