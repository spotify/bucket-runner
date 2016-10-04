const path = require('path');
const glob = require('glob');
const debug = require('debug');
const pkg = require('../package.json');
const isLikelyGlob = require('./is-likely-glob');

const dbg = debug(`${pkg.name}:discern-files`);


module.exports = function discernFiles(fs, args, resolveFiles) {
  const files = [];

  args.forEach((p) => {
    if (isLikelyGlob(p)) {
      dbg('globbing %s', p);
      glob.sync(p, { nodir: true }).forEach((filepath) => {
        const resolved = path.resolve(filepath);
        dbg('found %s', resolved);
        files.push(resolved);
      });
    } else {
      dbg('likely a file %s', p);

      if (!resolveFiles) {
        files.push(p);
        return;
      }

      const found = path.resolve(p);
      dbg('resolved %s to %s', p, found);
      try {
        const stat = fs.statSync(found);
        if (stat.isDirectory()) {
          dbg('skipping non-file input %s', found);
        } else {
          dbg('found %s', found);
          files.push(found);
        }
      } catch (e) {
        // ignore
      }
    }
  });

  return files;
};
