var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

import t from 'flow-runtime';

var _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

var AbstractQuery = (_temp = _class = function () {
  function AbstractQuery(store, queryCallback) {
    _classCallCheck(this, AbstractQuery), this[_AbstractQueryTypeParametersSymbol] = {
      Store: t.typeParameter('Store', t.ref(AbstractStore))
    }, this.store = store, this.queryCallback = queryCallback;
  }

  return _createClass(AbstractQuery, [{
    key: 'fetchAndSubscribe',
    value: function fetchAndSubscribe(callback) {
      var _callbackType = t.function();

      t.param('callback', _callbackType).assert(callback);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];

      return this._subscribe(callback, true, args);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(callback) {
      var _callbackType2 = t.function();

      t.param('callback', _callbackType2).assert(callback);

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];

      return this._subscribe(callback, false, args);
    }
  }]), AbstractQuery;
}(), _class[t.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp);
export { AbstractQuery as default };
//# sourceMappingURL=AbstractQuery.js.map