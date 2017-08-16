var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import AbstractCursor from '../store/AbstractCursor';

var WebsocketCursor = function (_AbstractCursor) {
  function WebsocketCursor(store, options) {
    _classCallCheck(this, WebsocketCursor);

    var _this = _possibleConstructorReturn(this, (WebsocketCursor.__proto__ || Object.getPrototypeOf(WebsocketCursor)).call(this, store));

    return _this._options = options, _this._options = options, _this;
  }

  /* options */

  return _inherits(WebsocketCursor, _AbstractCursor), _createClass(WebsocketCursor, [{
    key: 'limit',
    value: function limit(newLimit) {
      if (this._idCursor) throw new Error('Cursor already created');

      return this._options.limit = newLimit, Promise.resolve(this);
    }

    /* results */

  }, {
    key: '_create',
    value: function _create() {
      var _this2 = this;

      if (this._idCursor) throw new Error('Cursor already created');
      return this.store.connection.emit('createCursor', this._options).then(function (idCursor) {
        idCursor && (_this2._idCursor = idCursor);
      });
    }
  }, {
    key: 'emit',
    value: function emit(type) {
      var _this3 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];

      return this._idCursor ? this.store.emit('cursor', { type: type, id: this._idCursor }, args) : this._create().then(function () {
        return _this3.emit.apply(_this3, [type].concat(args));
      });
    }
  }, {
    key: 'advance',
    value: function advance(count) {
      return this.emit('advance', count), this;
    }
  }, {
    key: 'next',
    value: function next() {
      var _this4 = this;

      return this.emit('next').then(function (result) {
        return _this4._result = result, _this4.key = result && result[_this4._store.keyPath], _this4.key;
      });
    }
  }, {
    key: 'result',
    value: function result() {
      return Promise.resolve(this._result);
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];

      return this.emit('count', applyLimit);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this._store) return Promise.resolve();

      var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();

      return this._idCursor = null, this._options = null, this._store = void 0, this._result = void 0, closedPromise;
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      var _this5 = this;

      return this.store.emit('cursor toArray', this._options).then(function (result) {
        return _this5.close(), result;
      });
    }
  }]), WebsocketCursor;
}(AbstractCursor);

export { WebsocketCursor as default };
//# sourceMappingURL=WebsocketCursor.js.map