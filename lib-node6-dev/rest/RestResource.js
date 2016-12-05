"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require("tcomb-forked");

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RestResourceService {
  constructor(store) {
    this.store = store;
  }

  limit(connectedUser, limit) {
    _assert(connectedUser, _tcombForked2.default.maybe(_tcombForked2.default.Object), "connectedUser");

    return limit;
  }

  criteria() {
    return {};
  }

  sort() {
    return null;
  }

  transform(result) {
    _assert(result, _tcombForked2.default.Object, "result");

    return result;
  }
}
exports.default = RestResourceService;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=RestResource.js.map