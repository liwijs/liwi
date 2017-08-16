var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
var ResultType = t.tdz(function () {
  return _ResultType;
});

var MongoCursor = function (_AbstractCursor) {
  function MongoCursor(store, cursor) {
    _classCallCheck(this, MongoCursor);

    var _storeType = t.ref(MongoStore);

    var _cursorType = t.ref(Cursor);

    t.param('store', _storeType).assert(store), t.param('cursor', _cursorType).assert(cursor);

    var _this = _possibleConstructorReturn(this, (MongoCursor.__proto__ || Object.getPrototypeOf(MongoCursor)).call(this, store));

    return _this._cursor = cursor, t.bindTypeParameters(_this, t.ref(MongoStore)), _this._cursor = cursor, _this;
  }

  return _inherits(MongoCursor, _AbstractCursor), _createClass(MongoCursor, [{
    key: 'advance',
    value: function advance(count) {
      var _countType = t.number();

      t.return(t.void());
      t.param('count', _countType).assert(count), this._cursor.skip(count);
    }
  }, {
    key: 'next',
    value: function next() {
      var _this2 = this;

      var _returnType2 = t.return(t.any());

      return this._cursor.next().then(function (value) {
        return _this2._result = value, _this2.key = value && value._id, _this2.key;
      }).then(function (_arg) {
        return _returnType2.assert(_arg);
      });
    }
  }, {
    key: 'limit',
    value: function limit(newLimit) {
      var _newLimitType = t.number();

      var _returnType3 = t.return(t.ref('Promise'));

      return t.param('newLimit', _newLimitType).assert(newLimit), this._cursor.limit(newLimit), _returnType3.assert(Promise.resolve(this));
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length > 0 && arguments[0] !== void 0 && arguments[0];

      var _applyLimitType = t.boolean();

      return t.param('applyLimit', _applyLimitType).assert(applyLimit), this._cursor.count(applyLimit);
    }
  }, {
    key: 'result',
    value: function result() {
      return Promise.resolve(this._result);
    }
  }, {
    key: 'close',
    value: function close() {

      return this._cursor && (this._cursor.close(), this._cursor = void 0, this._store = void 0, this._result = void 0), Promise.resolve();
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      var _returnType4 = t.return(t.array(t.ref(ResultType)));

      return this._cursor.toArray().then(function (_arg2) {
        return _returnType4.assert(_arg2);
      });
    }
  }]), MongoCursor;
}(AbstractCursor);

export { MongoCursor as default };
//# sourceMappingURL=MongoCursor.js.map