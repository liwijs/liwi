'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = /**
                    * @function
                   */ function () { /**
                                     * @function
                                     * @param target
                                     * @param props
                                    */ function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return (/**
                                                                                                                                                                                                                                                                                                                                                                            * @function
                                                                                                                                                                                                                                                                                                                                                                            * @param Constructor
                                                                                                                                                                                                                                                                                                                                                                            * @param protoProps
                                                                                                                                                                                                                                                                                                                                                                            * @param staticProps
                                                                                                                                                                                                                                                                                                                                                                           */ function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; } ); }();

var _AbstractCursor2 = require('../store/AbstractCursor');

var _AbstractCursor3 = _interopRequireDefault(_AbstractCursor2);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param instance
 * @param Constructor
*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @function
 * @param self
 * @param call
*/
function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

/**
 * @function
 * @param subClass
 * @param superClass
*/
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MongoCursor = /**
                   * @function
                   * @param _AbstractCursor
                  */function (_AbstractCursor) {
    _inherits(MongoCursor, _AbstractCursor);

    /**
     * @function
     * @param {MongoStore} store
     * @param {Cursor} cursor
     * @param {Object} criteria
    */
    function MongoCursor(store, cursor, criteria) {
        _classCallCheck(this, MongoCursor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoCursor).call(this, store));

        _this._cursor = cursor;
        _this._criteria = criteria;
        return _this;
    }

    _createClass(MongoCursor, [{
        key: 'advance',
        value: /**
                * @function
                * @param {number} count
               */function advance(count) {
            this._cursor.skip(count);
        }
    }, {
        key: 'next',
        value: /**
                * @function
               */function next() {
            var _this2 = this;

            return this._cursor.next().then(function (value) {
                _this2._result = value;
                _this2.key = value && value._id;
                return _this2.key;
            });
        }
    }, {
        key: 'limit',
        value: /**
                * @function
                * @param {number} newLimit
               */function limit(newLimit) {
            this._cursor.limit(newLimit);
            return Promise.resolve();
        }
    }, {
        key: 'count',
        value: /**
                * @function
                * @param {boolean} [applyLimit]
               */function count() {
            var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            return this._cursor.count(applyLimit);
        }
    }, {
        key: 'result',
        value: /**
                * @function
               */function result() {
            return Promise.resolve(this._result);
        }
    }, {
        key: 'close',
        value: /**
                * @function
               */function close() {
            if (this._cursor) {
                this._cursor.close();
                this._cursor = this._store = this._result = undefined;
            }

            return Promise.resolve();
        }
    }, {
        key: 'toArray',
        value: /**
                * @function
               */function toArray() {
            return this._cursor.toArray();
        }
    }]);

    return MongoCursor;
}(_AbstractCursor3.default);

exports.default = MongoCursor;
//# sourceMappingURL=MongoCursor.js.map