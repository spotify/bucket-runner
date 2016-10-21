// Copyright 2015-2016 Spotify AB. All rights reserved.
//
// The contents of this file are licensed under the Apache License, Version 2.0
// (the "License"); you may not use this file except in compliance with the
// License. You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

'use strict';

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
