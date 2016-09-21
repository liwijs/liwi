'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.encode = undefined;

var _msgpack = require('msgpack5');

var _msgpack2 = _interopRequireDefault(_msgpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const msgpack = new _msgpack2.default();

msgpack.register(0x42, Date, date => Buffer.from(date.getTime().toString()), timeBuffer => new Date(Number(timeBuffer.toString())));

const encode = exports.encode = msgpack.encode;
const decode = exports.decode = msgpack.decode;
//# sourceMappingURL=index.js.map