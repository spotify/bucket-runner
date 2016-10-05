'use strict';

module.exports = function isLikelyGlob(str) {
  return /[!}{)(+*]/.exec(str);
};
