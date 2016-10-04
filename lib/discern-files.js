var path = require('path');
var glob = require('glob');
var debug = require('debug');
var pkg = require('../package.json');
var dbg = debug(pkg.name + ':discern-files');
var isLikelyGlob = require('./is-likely-glob');

module.exports = function (fs, args, resolveFiles) {

  var files = [];

  args.forEach(function (p) {

    if (isLikelyGlob(p)) {
      dbg('globbing %s', p);
      glob.sync(p, { nodir: true }).forEach(function (filepath) {
        var resolved = path.resolve(filepath);
        dbg('found %s', resolved);
        files.push(resolved);
      });
    } else {
      dbg('likely a file %s', p);

      if (!resolveFiles) {
        files.push(p);
        return
      }

      var found = path.resolve(p);
      dbg('resolved %s to %s', p, found);
      try {
        var stat = fs.statSync(found);
        if (stat.isDirectory()) {
          dbg('skipping non-file input %s', found);
        } else {
          dbg('found %s', found);
          files.push(found);
        }
      } catch (e) {}
    }

  });

  return files;
}
