"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stringify;
/* eslint-disable max-len */

// const internalReplacer = (key, value) => {
//   if (value instanceof Date) {
//     return ['extended-json', 'date', value.getTime()];
//   }
//
//   return value;
// };

function stringify(text, replacer, space) {
  return JSON.stringify(text,
  // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
  replacer, space);
}
//# sourceMappingURL=stringify.js.map