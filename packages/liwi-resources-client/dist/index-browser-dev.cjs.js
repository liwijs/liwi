'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var liwiStore = require('liwi-store');
var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var ClientCursor =
/*#__PURE__*/
function (_AbstractCursor) {
  _inheritsLoose(ClientCursor, _AbstractCursor);

  function ClientCursor(client, options) {
    var _this = _AbstractCursor.call(this, client) || this;

    _this.options = options;
    return _this;
  }
  /* options */


  var _proto = ClientCursor.prototype;

  _proto.limit = function limit(newLimit) {
    if (this._idCursor) throw new Error('Cursor already created');
    this.options.limit = newLimit;
    return Promise.resolve(this);
  }
  /* results */
  ;

  _proto._create = function _create() {
    var _this2 = this;

    if (this._idCursor) throw new Error('Cursor already created');
    return _AbstractCursor.prototype.store.createCursor(this.options).then(function (idCursor) {
      if (!idCursor) return;
      _this2._idCursor = idCursor;
    });
  };

  _proto.emit = function emit(type) {
    var _this3 = this,
        _len,
        args,
        _key;

    for (_len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (!this._idCursor) {
      return this._create().then(function () {
        return _this3.emit.apply(_this3, [type].concat(args));
      });
    }

    return _AbstractCursor.prototype.store.send('cursor', {
      type: type,
      id: this._idCursor
    }, args);
  };

  _proto.advance = function advance(count) {
    this.emit('advance', count);
    return this;
  };

  _proto.next =
  /*#__PURE__*/
  function () {
    var _next = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      var result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.emit('next');

            case 2:
              result = _context.sent;
              this._result = result;
              this.key = result && result[_AbstractCursor.prototype.store.keyPath];
              return _context.abrupt("return", _AbstractCursor.prototype.key);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function next() {
      return _next.apply(this, arguments);
    };
  }();

  _proto.result = function result() {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  };

  _proto.count = function count(applyLimit) {
    if (applyLimit === void 0) {
      applyLimit = false;
    }

    return this.emit('count', applyLimit);
  };

  _proto.close = function close() {
    if (!_AbstractCursor.prototype.store) return Promise.resolve();
    var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  };

  _proto.toArray = function toArray() {
    if (this._idCursor) throw new Error('Cursor created, cannot call toArray');
    return _AbstractCursor.prototype.store.send('cursor toArray', this.options);
  };

  return ClientCursor;
}(liwiStore.AbstractCursor);

var logger = new Logger('liwi:resources:query');

var Query =
/*#__PURE__*/
function (_AbstractQuery) {
  _inheritsLoose(Query, _AbstractQuery);

  function Query(client, key) {
    var _this = _AbstractQuery.call(this) || this;

    _this.client = client;
    _this.key = key;
    return _this;
  }

  var _proto = Query.prototype;

  _proto.fetch = function fetch(onFulfilled) {
    return this.client.send('fetch', this.key).then(onFulfilled);
  };

  _proto._subscribe = function _subscribe(callback, _includeInitial, args) {
    var _this2 = this;

    if (_includeInitial === void 0) {
      _includeInitial = false;
    }

    var eventName = "subscribe:" + this.client.resourceName + "." + this.key;

    var listener = function listener(err, result) {
      var decodedResult = result && extendedJson.decode(result);
      logger.debug(eventName, {
        result: result,
        decodedResult: decodedResult
      });
      callback(err, decodedResult);
    };

    this.client.on(eventName, listener);

    var _stopEmitSubscribe;

    var promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      _this2.client.off(eventName, listener);

      throw err;
    });

    var stop = function stop() {
      if (!promise) return;

      _stopEmitSubscribe();

      promise.then(function () {
        promise = undefined;

        _this2.client.off(eventName, listener);
      });
    };

    return {
      cancel: stop,
      stop: stop,
      then: function then(cb) {
        return Promise.resolve(promise).then(cb);
      }
    };
  };

  return Query;
}(liwiStore.AbstractQuery);

var AbstractClient =
/*#__PURE__*/
function () {
  function AbstractClient(resourceName, keyPath) {
    this.resourceName = resourceName;

    if (!resourceName) {
      throw new Error("Invalid resourceName: \"" + resourceName + "\"");
    }

    this.keyPath = keyPath;
  }

  var _proto = AbstractClient.prototype;

  _proto.createQuery = function createQuery(key) {
    return new Query(this, key);
  };

  _proto.cursor = function cursor(criteria, sort) {
    return Promise.resolve(new ClientCursor(this, {
      criteria: criteria,
      sort: sort
    }));
  };

  _proto.findAll = function findAll(criteria, sort) {
    return this.send('cursor toArray', {
      criteria: criteria,
      sort: sort
    });
  };

  _proto.findByKey = function findByKey(key) {
    return this.send('findByKey', key);
  };

  _proto.findOne = function findOne(criteria, sort) {
    return this.send('findOne', criteria, sort);
  };

  _proto.upsertOne = function upsertOne(object) {
    return this.send('upsertOne', object);
  };

  _proto.insertOne = function insertOne(object) {
    return this.send('insertOne', object);
  };

  _proto.replaceOne = function replaceOne(object) {
    return this.send('replaceOne', object);
  };

  _proto.replaceSeveral = function replaceSeveral(objects) {
    return this.send('replaceSeveral', objects);
  };

  _proto.upsertOneWithInfo = function upsertOneWithInfo(object) {
    return this.send('upsertOneWithInfo', object);
  };

  _proto.partialUpdateByKey = function partialUpdateByKey(key, partialUpdate) {
    return this.send('partialUpdateByKey', key, partialUpdate);
  };

  _proto.partialUpdateOne = function partialUpdateOne(object, partialUpdate) {
    return this.partialUpdateByKey(object[this.keyPath], partialUpdate);
  };

  _proto.partialUpdateMany = function partialUpdateMany(criteria, partialUpdate) {
    return this.send('partialUpdateMany', criteria, partialUpdate);
  };

  _proto.deleteByKey = function deleteByKey(key) {
    return this.send('deleteByKey', key);
  };

  _proto.deleteOne = function deleteOne(object) {
    return this.send('deleteByKey', object[this.keyPath]);
  };

  _proto.deleteMany = function deleteMany(criteria) {
    return this.send('deleteMany', criteria);
  };

  return AbstractClient;
}();

exports.AbstractClient = AbstractClient;
//# sourceMappingURL=index-browser-dev.cjs.js.map
