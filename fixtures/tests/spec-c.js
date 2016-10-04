var covered = require('../lib');
var assert = require('assert');

describe('c', function () {
  it ('covers', function () {
    assert(covered(), 'covered');
  })
  it ('c something', function (done) {
    setTimeout(function () {
      done();
    }, 1000)
  })
})
