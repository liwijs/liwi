var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractCursor from '../store/AbstractCursor';

var MongoCursor = function (_AbstractCursor) {
  _inherits(MongoCursor, _AbstractCursor);

  function MongoCursor(store, cursor) {
    _classCallCheck(this, MongoCursor);

    var _this = _possibleConstructorReturn(this, (MongoCursor.__proto__ || Object.getPrototypeOf(MongoCursor)).call(this, store));

    _this._cursor = cursor;
    return _this;
  }

  _createClass(MongoCursor, [{
    key: 'advance',
    value: function advance(count) {
      this._cursor.skip(count);
    }
  }, {
    key: 'next',
    value: function next() {
      var _this2 = this;

      return this._cursor.next().then(function (value) {
        _this2._result = value;
        _this2.key = value && value._id;
        return _this2.key;
      });
    }
  }, {
    key: 'limit',
    value: function limit(newLimit) {
      this._cursor.limit(newLimit);
      return Promise.resolve(this);
    }
  }, {
    key: 'count',
    value: function count() {
      var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      return this._cursor.count(applyLimit);
    }
  }, {
    key: 'result',
    value: function result() {
      return Promise.resolve(this._result);
    }
  }, {
    key: 'close',
    value: function close() {
      if (this._cursor) {
        this._cursor.close();
        this._cursor = this._store = this._result = undefined;
      }

      return Promise.resolve();
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      return this._cursor.toArray();
    }
  }]);

  return MongoCursor;
}(AbstractCursor);

export default MongoCursor;
//# sourceMappingURL=MongoCursor.js.map