var covered = require('../../../lib');
var assert = require('assert');

describe('d', function () {
  it ('covers', function () {
    assert(covered(), 'covered');
  })
  it ('a something', function (done) {
    setTimeout(function () {
      done();
    }, 1000)
  })
})
