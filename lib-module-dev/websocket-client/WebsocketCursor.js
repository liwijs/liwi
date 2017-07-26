var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import WebsocketStore from './WebsocketStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
var ResultType = t.tdz(function () {
  return _ResultType;
});

var WebsocketCursor = function (_AbstractCursor) {
  _inherits(WebsocketCursor, _AbstractCursor);

  function WebsocketCursor(store, options) {
    _classCallCheck(this, WebsocketCursor);

    var _storeType = t.ref(WebsocketStore);

    t.param('store', _storeType).assert(store);

    var _this = _possibleConstructorReturn(this, (WebsocketCursor.__proto__ || Object.getPrototypeOf(WebsocketCursor)).call(this, store));

    t.bindTypeParameters(_this, t.ref(WebsocketStore));

    _this._options = options;
    return _this;
  }

  /* options */

  _createClass(WebsocketCursor, [{
    key: 'limit',
    value: function limit(newLimit) {
      var _newLimitType = t.number();

      var _returnType = t.return(t.this(this));

      t.param('newLimit', _newLimitType).assert(newLimit);

      if (this._idCursor) throw new Error('Cursor already created');
      this._options.limit = newLimit;
      return Promise.resolve(this).then(function (_arg) {
        return _returnType.assert(_arg);
      });
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
      var _this3 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _returnType2 = t.return(t.any());

      if (!this._idCursor) {
        return this._create().then(function () {
          return _this3.emit.apply(_this3, [type].concat(args));
        }).then(function (_arg2) {
          return _returnType2.assert(_arg2);
        });
      }

      return this.store.emit('cursor', { type: type, id: this._idCursor }, args).then(function (_arg3) {
        return _returnType2.assert(_arg3);
      });
    }
  }, {
    key: 'advance',
    value: function advance(count) {
      var _countType = t.number();

      t.param('count', _countType).assert(count);

      this.emit('advance', count);
      return this;
    }
  }, {
    key: 'next',
    value: function next() {
      var _this4 = this;

      var _returnType3 = t.return(t.nullable(t.any()));

      return this.emit('next').then(function (result) {
        _this4._result = result;
        _this4.key = result && result[_this4._store.keyPath];
        return _this4.key;
      }).then(function (_arg4) {
        return _returnType3.assert(_arg4);
      });
    }
  }, {
    key: 'result',
    value: function result() {
      var _returnType4 = t.return(t.nullable(t.ref(ResultType)));

      return Promise.resolve(this._result).then(function (_arg5) {
        return _returnType4.assert(_arg5);
      });
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var _applyLimitType = t.boolean();

      t.param('applyLimit', _applyLimitType).assert(applyLimit);

      return this.emit('count', applyLimit);
    }
  }, {
    key: 'close',
    value: function close() {
      var _returnType5 = t.return(t.void());

      if (!this._store) return Promise.resolve().then(function (_arg6) {
        return _returnType5.assert(_arg6);
      });

      var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
      this._idCursor = null;
      this._options = null;
      this._store = undefined;
      this._result = undefined;
      return closedPromise.then(function (_arg7) {
        return _returnType5.assert(_arg7);
      });
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      var _this5 = this;

      var _returnType6 = t.return(t.array(t.array(t.ref(ResultType))));

      return this.store.emit('cursor toArray', this._options).then(function (result) {
        _this5.close();
        return result;
      }).then(function (_arg8) {
        return _returnType6.assert(_arg8);
      });
    }
  }]);

  return WebsocketCursor;
}(AbstractCursor);

export { WebsocketCursor as default };
//# sourceMappingURL=WebsocketCursor.js.map