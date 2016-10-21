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

const dbg = debug(`${pkg.name}:generate-commands`);

module.exports = function generateCommands(partitions, command, hasPatternPartition) {
  return partitions.groups.map((group, i) => {
    dbg('group %o', group);

    // Copy the command
    let cmd = command;

    // Allow for user-controlled naming, such as naming individual code
    // coverage reports. Otherwise they get clobbered.
    if (hasPatternPartition && partitions.names.length) {
      cmd = cmd.replace(/\{partition\}/g, partitions.names[i]);
    }

    // Allow the user to control where the partitioned files are placed in
    // in the command. By default they are appended.
    if (cmd.indexOf('{files}') > -1) {
      dbg('injecting {files}');
      cmd = cmd.replace(/\{files\}/g, group.join(' '));
    } else {
      dbg('appending {files}');
      cmd = `${cmd} ${group.join(' ')}`;
    }

    return cmd;
  });
};
