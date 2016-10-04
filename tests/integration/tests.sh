#!/bin/bash -x

# Bail on any error
set -e

function checkExists () {
  path="$1";

  if [[ ! -a "$path" ]]; then
    echo "Error: expected command to generate $path. Does not exist."
    exit 1
  fi
}

function passings () {
  actual=$(eval $1 | grep passing | wc -l | tr -d '[[:space:]]')
  expected="$2"

  if [[ ! "$actual" -eq "$expected" ]]; then
    echo "Error: expected $expected passes, got $actual"
    exit 1
  fi
}

function oks () {
  actual=$(eval $1 | grep -e '^ok ' | wc -l | tr -d '[[:space:]]')
  expected="$2"

  if [[ ! "$actual" -eq "$expected" ]]; then
    echo "Error: expected $expected oks, got $actual"
    exit 1
  fi
}

echo Partitioning by regex

passings "./bin/cli.js --partition-regex 'spec-(.)' ./fixtures/tests/* -- _mocha" "3"
passings './bin/cli.js --partition-regex '\''spec-(.)'\'' '\''./fixtures/tests/*'\'' -- _mocha' "3"
passings "./bin/cli.js --partition-regex 'spec-(.)' fixtures/tests/nested/nested/spec-d.js -- _mocha" "1"

echo Manual placement of files

passings "./bin/cli.js --partition-size 1 ./fixtures/tests/* -- _mocha {files}" "3"
passings './bin/cli.js --partition-size 1 '\''./fixtures/tests/*'\'' -- _mocha {files}' "3"
passings "./bin/cli.js --partition-size 1 fixtures/tests/nested/nested/spec-d.js -- _mocha {files}" "1"

echo Various files / globs are processed properly

passings "./bin/cli.js --partition-size 1 ./fixtures/tests/* -- _mocha" "3"
passings './bin/cli.js --partition-size 1 '\''./fixtures/tests/*.js'\'' -- _mocha' "3"
passings "./bin/cli.js --partition-size 1 fixtures/tests/nested/nested/spec-d.js -- _mocha" "1"

oks "./bin/cli.js --partition-size 1 ./fixtures/tests/* -- _mocha --reporter tap" "6"

echo Custom coverage commands are properly spliced

rm -rf coverage;

./bin/cli.js --partition-size 1 ./fixtures/tests/* -- istanbul cover _mocha --dir coverage/shell-glob -i 'fixtures/lib/**/*.js' -- --reporter dot
checkExists coverage/shell-glob/coverage.raw.json

./bin/cli.js --partition-size 1 './fixtures/tests/*' -- istanbul cover _mocha --dir coverage/node-glob -i 'fixtures/lib/**/*.js' -- --reporter dot
checkExists coverage/node-glob/coverage.raw.json

echo Command is still executed once if no files found

oks "./bin/cli.js ./non-existent -- echo ok hey" "1"
oks "./bin/cli.js ./non-existent --partition-regex 'js' -- echo ok hey" "1"

echo Command executes if files are not resolved

oks "./bin/cli.js file1.js file2.js --no-resolve-files --partition-size 1 -- echo ok hey" "2"
oks "./bin/cli.js file1.js file2.js --no-resolve-files --partition-regex '(.+?)js' -- echo ok hey" "2"

echo Commands continue if --continue-on-error is true

oks "./bin/cli.js --partition-size 1 --continue-on-error fixtures/tests/* -- 'echo ok hey {files} && exit 1'" "3"

echo Command passes exit code through on error

set +e;
./bin/cli.js file1.js file2.js --no-resolve-files --partition-size 1 -- 'blah ok hey'
LAST_EXIT="$?";
if [[ $LAST_EXIT != 127 ]]; then
  echo "Expected exit code of 127 but got $LAST_EXIT"; exit 1;
fi;
set -e;
