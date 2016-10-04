var debug = require('debug');
var pkg = require('../package.json');
var dbg = debug(pkg.name + ':partition-by-size');

module.exports = function partitionBySize (size, files) {
  var groups = [[]];

  files.forEach(function (filepath) {

    var curr = groups[groups.length - 1]
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
    groups: groups,
    names: []
  };
}
