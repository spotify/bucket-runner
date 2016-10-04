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
