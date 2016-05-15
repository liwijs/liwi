'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

/**
 * @function
 * @param fn
*/
function _asyncToGenerator(fn) { return (/**
                                         * @function
                                        */ function () { var gen = fn.apply(this, arguments); return new Promise( /**
                                                                                                                   * @function
                                                                                                                   * @param resolve
                                                                                                                   * @param reject
                                                                                                                  */ function (resolve, reject) { /**
                                                                                                                                                   * @function
                                                                                                                                                   * @param key
                                                                                                                                                   * @param arg
                                                                                                                                                  */ function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then( /**
                                                                                                                                                                                                                                                                                                                                                                 * @function
                                                                                                                                                                                                                                                                                                                                                                 * @param value
                                                                                                                                                                                                                                                                                                                                                                */ function (value) { return step("next", value); }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                      * @function
                                                                                                                                                                                                                                                                                                                                                                                                                      * @param err
                                                                                                                                                                                                                                                                                                                                                                                                                     */ function (err) { return step("throw", err); }); } } return step("next"); }); } ); }

/**
 * @function
 * @param instance
 * @param Constructor
*/
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractCursor = /**
                      * @function
                     */function () {
    /**
     * @function
     * @param {Store} store
    */
    function AbstractCursor(store) {
        _classCallCheck(this, AbstractCursor);

        this._store = store;
    }

    _createClass(AbstractCursor, [{
        key: 'close',
        value: /**
                * @function
               */function close() {
            throw new Error('close() missing implementation');
        }
    }, {
        key: 'next',
        value: /**
                * @function
               */function next() {
            throw new Error('next() missing implementation');
        }
    }, {
        key: 'limit',
        value: /**
                * @function
                * @param {number} newLimit
               */function limit(newLimit) {
            throw new Error('limit() missing implementation');
        }
    }, {
        key: 'count',
        value: /**
                * @function
                * @param {boolean} [applyLimit]
               */function count() {
            var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            throw new Error('count() missing implementation');
        }
    }, {
        key: 'result',
        value: /**
                * @function
               */function result() {
            return this.store.findByKey(this.key);
        }
    }, {
        key: 'delete',
        value: /**
                * @function
               */function _delete() {
            return this.store.deleteByKey(this.key);
        }
    }, {
        key: 'forEachKeys',
        value: /**
                * @function
                * @param {Function} callback
               */function () {
            var ref = _asyncToGenerator( /**
                                          * @function
                                          * @param {Function} callback
                                         */regeneratorRuntime.mark( /**
                                                                     * @function
                                                                     * @param callback
                                                                    */function _callee(callback) {
                var key;
                return regeneratorRuntime.wrap( /**
                                                 * @function
                                                 * @param _context
                                                */function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!true) {
                                    _context.next = 10;
                                    break;
                                }

                                _context.next = 3;
                                return this.next();

                            case 3:
                                key = _context.sent;

                                if (key) {
                                    _context.next = 6;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 6:
                                _context.next = 8;
                                return callback(key);

                            case 8:
                                _context.next = 0;
                                break;

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            /**
             * @function
             * @param _x2
            */
            function forEachKeys(_x2) {
                return ref.apply(this, arguments);
            }

            return forEachKeys;
        }()
    }, {
        key: 'forEach',
        value: /**
                * @function
                * @param callback
               */function forEach(callback) {
            var _this = this;

            return this.forEachKeys(function () {
                return _this.result().then(function (result) {
                    return callback(result);
                });
            });
        }
    }, {
        key: 'keysIterator',
        value: /**
                * @function
               */regeneratorRuntime.mark( /**
                                           * @function
                                          */function keysIterator() {
            return regeneratorRuntime.wrap( /**
                                             * @function
                                             * @param _context2
                                            */function keysIterator$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!true) {
                                _context2.next = 5;
                                break;
                            }

                            _context2.next = 3;
                            return this.next();

                        case 3:
                            _context2.next = 0;
                            break;

                        case 5:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, keysIterator, this);
        })
    }, {
        key: Symbol.iterator,
        value: /**
                * @function
               */regeneratorRuntime.mark( /**
                                           * @function
                                          */function value() {
            var _this2 = this;

            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, keyPromise;

            return regeneratorRuntime.wrap( /**
                                             * @function
                                             * @param _context3
                                            */function value$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context3.prev = 3;
                            _iterator = this.keysIterator()[Symbol.iterator]();

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context3.next = 12;
                                break;
                            }

                            keyPromise = _step.value;
                            _context3.next = 9;
                            return keyPromise.then( /**
                                                     * @function
                                                     * @param key
                                                    */function (key) {
                                return key && _this2.result();
                            });

                        case 9:
                            _iteratorNormalCompletion = true;
                            _context3.next = 5;
                            break;

                        case 12:
                            _context3.next = 18;
                            break;

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context3.t0;

                        case 18:
                            _context3.prev = 18;
                            _context3.prev = 19;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 21:
                            _context3.prev = 21;

                            if (!_didIteratorError) {
                                _context3.next = 24;
                                break;
                            }

                            throw _iteratorError;

                        case 24:
                            return _context3.finish(21);

                        case 25:
                            return _context3.finish(18);

                        case 26:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })

        // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
        /*
        async *keysAsyncIterator() {
            while (true) {
                 const key = await this.next();
                 if (!key) return;
                  yield key;
            }
         }
          async *[Symbol.asyncIterator] {
            for await (let key of this.keysAsyncIterator()) {
                yield await this.result();
            }
         }
         */

    }, {
        key: 'store',
        get: /**
              * @function
             */function get() {
            return this._store;
        }
    }]);

    return AbstractCursor;
}();

exports.default = AbstractCursor;
//# sourceMappingURL=AbstractCursor.js.map