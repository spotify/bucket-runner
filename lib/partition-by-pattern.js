const debug = require('debug');
const pkg = require('../package.json');

const dbg = debug(`${pkg.name}:partition-by-pattern`);

module.exports = function partitionByPattern(pattern, files) {
  const partitions = {};

  files.forEach((filepath) => {
    const re = new RegExp(pattern);
    const match = re.exec(filepath);
    dbg('partition regex %o on %s: %o', re, filepath, match);

    if (!match || !match[1]) {
      dbg('skipping non-matching file %s', filepath);
      return;
    }

    const partition = partitions[match[1]] || (partitions[match[1]] = []);
    partition.push(filepath);
  });

  return Object.keys(partitions).reduce((all, name) => {
    all.names.push(name);
    all.groups.push(partitions[name]);
    return all;
  }, { groups: [], names: [] });
};
