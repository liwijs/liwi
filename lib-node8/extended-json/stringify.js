"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (text, replacer, space) {
  return JSON.stringify(text,
  // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
  replacer, space);
};
//# sourceMappingURL=stringify.js.map