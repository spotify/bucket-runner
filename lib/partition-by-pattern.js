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
