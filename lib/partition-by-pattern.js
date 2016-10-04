var debug = require('debug');
var pkg = require('../package.json');
var dbg = debug(pkg.name + ':partition-by-pattern');

module.exports = function partitionByPattern (pattern, files) {
  var partitions = {};

  files.forEach(function (filepath) {
    var re = new RegExp(pattern);
    var match = re.exec(filepath);
    dbg('partition regex %o on %s: %o', re, filepath, match);

    if (!match || !match[1]) {
      dbg('skipping non-matching file %s', filepath);
      return;
    }

    var partition = partitions[match[1]] || (partitions[match[1]] = []);
    partition.push(filepath);
  });

  return Object.keys(partitions).reduce(function (all, name) {
    all.names.push(name);
    all.groups.push(partitions[name]);
    return all;
  }, { groups: [], names: [] });
}
