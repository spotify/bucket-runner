var fs = require('fs');
var os = require('os');

var path = require('path');

var objectAssign = require('object-assign');
var async = require('async');
var minimist = require('minimist');
var debug = require('debug');

var defaults = require('./lib/default-options');
var discernFiles = require('./lib/discern-files');
var partitionByPattern = require('./lib/partition-by-pattern');
var partitionBySize = require('./lib/partition-by-size');
var generateCommands = require('./lib/generate-commands');
var run = require('./lib/run');

var pkg = require('./package.json');
var dbg = debug(pkg.name + ':index');

module.exports = function (filesAndGlobs, command, opts, cb) {

  var options = objectAssign({}, defaults(), opts);

  dbg('command %s', command);
  dbg('opts %o', options);

  var files = discernFiles(fs, filesAndGlobs, options['resolve-files']);

  var partitions = options['partition-regex']
    ? partitionByPattern(options['partition-regex'], files)
    : partitionBySize(options['partition-size'], files);

  // Lots of commands do their own recursing into directories. bucket-runner
  // can't help here, but perhaps it's better to at least not fail completely?
  if (!partitions.groups.length && !partitions.names.length) {
    dbg('no partitions found, falling back to raw inputs as last resort');
    filesAndGlobs.forEach(function (input) {
      partitions.groups.push([input]);
    });
  }

  dbg('partitioned %o', partitions);

  var commands = generateCommands(partitions, command, !!options['partition-regex']);
  var tasks = commands.map(function (cmd) {
    return function (done) {
      run(cmd, options, function(err) {
        if (err && options['continue-on-error']) {
          console.error(err);
          return done();
        }
        done(err);
      });
    }
  });

  async.parallelLimit(tasks, options.concurrency, cb);
}
