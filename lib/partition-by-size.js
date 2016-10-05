'use strict';

const debug = require('debug');
const pkg = require('../package.json');

const dbg = debug(`${pkg.name}:partition-by-size`);

module.exports = function partitionBySize(size, files) {
  const groups = [[]];

  files.forEach((filepath) => {
    const curr = groups[groups.length - 1]
      ? groups[groups.length - 1]
      : (groups[groups.length - 1] = []);

    dbg('partition curr %o, length %d', curr, curr.length);

    if (curr.length < size) {
      curr.push(filepath);
    } else {
      groups.push([filepath]);
    }
  });

  return {
    groups,
    names: [],
  };
};
