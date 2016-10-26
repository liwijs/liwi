var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';

var WebsocketCursor = function (_AbstractCursor) {
  _inherits(WebsocketCursor, _AbstractCursor);

  function WebsocketCursor(store, options) {
    _assert(store, WebsocketStore, 'store');

    _classCallCheck(this, WebsocketCursor);

    var _this = _possibleConstructorReturn(this, (WebsocketCursor.__proto__ || Object.getPrototypeOf(WebsocketCursor)).call(this, store));

    _this._options = options;
    return _this;
  }

  /* options */

  _createClass(WebsocketCursor, [{
    key: 'limit',
    value: function limit(newLimit) {
      _assert(newLimit, _t.Number, 'newLimit');

      return _assert(function () {
        if (this._idCursor) throw new Error('Cursor already created');
        this._options.limit = newLimit;
        return Promise.resolve(this);
      }.apply(this, arguments), _t.Promise, 'return value');
    }

    /* results */

  }, {
    key: '_create',
    value: function _create() {
      var _this2 = this;

      if (this._idCursor) throw new Error('Cursor already created');
      return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
        if (!idCursor) return;
        _this2._idCursor = idCursor;
      });
    }
  }, {
    key: 'emit',
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return _assert(function () {
        var _this3 = this;

        if (!this._idCursor) {
          return this._create().then(function () {
            return _this3.emit.apply(_this3, [type].concat(args));
          });
        }

        return this.store.emit('cursor', { type: type, id: this._idCursor }, args);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'advance',
    value: function advance(count) {
      _assert(count, _t.Number, 'count');

      this.emit('advance', count);
      return this;
    }
  }, {
    key: 'next',
    value: function next() {
      return _assert(function () {
        var _this4 = this;

        return this.emit('next').then(function (result) {
          _this4._result = result;
          _this4.key = result && result[_this4._store.keyPath];
          return _this4.key;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'result',
    value: function result() {
      return _assert(function () {
        return Promise.resolve(this._result);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      _assert(applyLimit, _t.Boolean, 'applyLimit');

      return this.emit('count', applyLimit);
    }
  }, {
    key: 'close',
    value: function close() {
      return _assert(function () {
        if (!this._store) return Promise.resolve();

        var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
        this._idCursor = this._options = null;
        this._store = this._result = undefined;
        return closedPromise;
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      return _assert(function () {
        var _this5 = this;

        return this.store.emit('cursor toArray', this._options).then(function (result) {
          _this5.close();
          return result;
        });
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }]);

  return WebsocketCursor;
}(AbstractCursor);

export default WebsocketCursor;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=WebsocketCursor.js.map