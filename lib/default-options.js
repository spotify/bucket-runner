const os = require('os');

module.exports = function defaults() {
  return {
    concurrency: os.cpus().length * 4,
    'partition-size': 2,
    'partition-regex': null,
    'resolve-files': true,
    'continue-on-error': false,
    'stream-output': false,
  };
};
