var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

var AbstractQuery = function () {
  function AbstractQuery(store, queryCallback) {
    _classCallCheck(this, AbstractQuery);

    this.store = store;
    this.queryCallback = queryCallback;
  }

  _createClass(AbstractQuery, [{
    key: 'fetchAndSubscribe',
    value: function fetchAndSubscribe(callback) {
      _assert(callback, _t.Function, 'callback');

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this._subscribe(callback, true, args);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      _assert(callback, _t.Function, 'callback');

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return this._subscribe(callback, false, args);
    }
  }]);

  return AbstractQuery;
}();

export default AbstractQuery;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractQuery.js.map