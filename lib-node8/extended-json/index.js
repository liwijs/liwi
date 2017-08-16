'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.encode = exports.parse = exports.stringify = void 0;

var _stringify2 = require('./stringify');

var _stringify3 = _interopRequireDefault(_stringify2);

var _parse2 = require('./parse');

var _parse3 = _interopRequireDefault(_parse2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.stringify = _stringify3.default;
exports.parse = _parse3.default;
exports.encode = _stringify3.default;
exports.decode = _parse3.default;
//# sourceMappingURL=index.js.map