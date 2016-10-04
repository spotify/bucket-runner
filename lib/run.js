var exec = require('child_process').exec;
var path = require('path');
var objectAssign = require('object-assign');
var debug = require('debug');

var pkg = require('../package.json');
var dbg = debug(pkg.name + ':run');

module.exports = function runExec(cmd, opts, cb) {
  var binPath = path.join(process.cwd(), 'node_modules/.bin/');

  var env = objectAssign(
    {},
    process.env,
    { PATH: binPath + ':' + process.env.PATH }
  );

  dbg('exec %s', cmd);

  // We buffer stdout/stderr manually to both prevent configuring maxBuffer
  // and to have unified event handling on the process.
  var stdout = '';
  var stderr = '';

  var child = exec(cmd, {
    env: env,
    encoding: 'utf-8'
  });

  if (opts['stream-output']) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } else {
    child.stdout.on('data', function (chunk) { stdout += chunk; });
    child.stderr.on('data', function (chunk) { stderr += chunk; });
  }

  // `close` is used because `exit` can fire before the final `data` event
  // is emitted from stdout/stderr streams, in the case of buffering.
  child.on('close', function (code, signal) {
    dbg('exec close, code %s, signal %s, stdout.length %d, stderr.length %d',
      code, signal, stdout.length, stderr.length);

    // These will be empty strings if stream-output === true
    // Note: previous versions used console.log for both of these streams.
    // Unified stdout was likely in error, and the use of console.log also
    // likely introduced extraneous new lines.
    stdout.length && process.stdout.write(stdout);
    stderr.length && process.stderr.write(stderr);

    // Either code or signal is guaranteed to be non-null.
    if (code === 0) cb(null);
    else cb(signal || code);
  });

  // This is not if the child process exits in error, but more if the process
  // cannot be spawned for some reason. In this situation, the `close` event
  // shouldn't fire because a process was never spawned.
  child.on('error', cb);
}
