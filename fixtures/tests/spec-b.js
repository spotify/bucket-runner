var covered = require('../lib');
var assert = require('assert');

describe('b', function () {
  it ('covers', function () {
    assert(covered(), 'covered');
  })
  it ('b something', function (done) {
    setTimeout(function () {
      done();
    }, 1000)
  })
})
