'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MongoConnection = undefined;

var _MongoConnection = require('./MongoConnection');

Object.defineProperty(exports, 'MongoConnection', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MongoConnection).default;
  }
});

var _MongoStore = require('./MongoStore');

var _MongoStore2 = _interopRequireDefault(_MongoStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _MongoStore2.default;
//# sourceMappingURL=index.js.map