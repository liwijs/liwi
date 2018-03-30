'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var liwiStore = require('liwi-store');
var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var WebsocketCursor = function (_AbstractCursor) {
  inherits(WebsocketCursor, _AbstractCursor);

  function WebsocketCursor(store, options) {
    classCallCheck(this, WebsocketCursor);

    var _this = possibleConstructorReturn(this, (WebsocketCursor.__proto__ || Object.getPrototypeOf(WebsocketCursor)).call(this, store));

    _this._options = options;
    return _this;
  }

  /* options */

  createClass(WebsocketCursor, [{
    key: 'limit',
    value: function limit(newLimit) {
      if (this._idCursor) throw new Error('Cursor already created');
      this._options.limit = newLimit;
      return Promise.resolve(this);
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

      if (!this._idCursor) {
        return this._create().then(function () {
          return _this3.emit.apply(_this3, [type].concat(args));
        });
      }

      return this.store.emit('cursor', { type: type, id: this._idCursor }, args);
    }
  }, {
    key: 'advance',
    value: function advance(count) {
      this.emit('advance', count);
      return this;
    }
  }, {
    key: 'next',
    value: function next() {
      var _this4 = this;

      return this.emit('next').then(function (result) {
        _this4._result = result;
        _this4.key = result && result[_this4._store.keyPath];
        return _this4.key;
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
      var applyLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      return this.emit('count', applyLimit);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this._store) return Promise.resolve();

      var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
      this._idCursor = null;
      this._options = null;
      this._store = undefined;
      this._result = undefined;
      return closedPromise;
    }
  }, {
    key: 'toArray',
    value: function toArray$$1() {
      var _this5 = this;

      return this.store.emit('cursor toArray', this._options).then(function (result) {
        _this5.close();
        return result;
      });
    }
  }]);
  return WebsocketCursor;
}(liwiStore.AbstractCursor);

var logger = new Logger('liwi:websocket-client:query');

var Query = function (_AbstractQuery) {
  inherits(Query, _AbstractQuery);

  function Query(store, key) {
    classCallCheck(this, Query);

    var _this = possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    _this.key = key;
    return _this;
  }

  createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      return this.store.emit('fetch', this.key).then(callback);
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var args = arguments[2];

      var eventName = 'subscribe:' + this.store.restName + '.' + this.key;
      var listener = function listener(err, result) {
        var decodedResult = result && extendedJson.decode(result);

        callback(err, decodedResult);
      };
      this.store.connection.on(eventName, listener);

      var _stopEmitSubscribe = void 0;
      var promise = this.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
        _stopEmitSubscribe = stopEmitSubscribe;
        logger.info('subscribed');
      }).catch(function (err) {
        _this2.store.connection.off(eventName, listener);
        throw err;
      });

      var stop = function stop() {
        if (!promise) return;
        _stopEmitSubscribe();
        promise.then(function () {
          promise = null;
          _this2.store.connection.off(eventName, listener);
        });
      };

      return {
        cancel: stop,
        stop: stop,
        then: function then(cb) {
          return Promise.resolve(promise).then(cb);
        }
      };
    }
  }]);
  return Query;
}(liwiStore.AbstractQuery);

var logger$1 = new Logger('liwi:websocket-client');

var WebsocketStore = function (_AbstractStore) {
  inherits(WebsocketStore, _AbstractStore);

  function WebsocketStore(websocket, restName) {
    classCallCheck(this, WebsocketStore);

    var _this = possibleConstructorReturn(this, (WebsocketStore.__proto__ || Object.getPrototypeOf(WebsocketStore)).call(this, websocket));

    _this.keyPath = 'id';


    if (!restName) {
      throw new Error('Invalid restName: "' + restName + '"');
    }

    _this.restName = restName;
    return _this;
  }

  createClass(WebsocketStore, [{
    key: 'createQuery',
    value: function createQuery(key) {
      logger$1.debug('createQuery', { key: key });
      return new Query(this, key);
    }
  }, {
    key: 'emit',
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      logger$1.debug('emit', { type: type, args: args });
      if (this.connection.isDisconnected()) {
        throw new Error('Websocket is not connected');
      }

      return this.connection.emit('rest', {
        type: type,
        restName: this.restName,
        json: extendedJson.encode(args)
      }).then(function (result) {
        return result && extendedJson.decode(result);
      });
    }
  }, {
    key: 'emitSubscribe',
    value: function emitSubscribe(type) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var emit = function emit() {
        return _this2.emit.apply(_this2, [type].concat(args));
      };
      var registerOnConnect = function registerOnConnect() {
        _this2.connection.on('connect', emit);
        return function () {
          return _this2.connection.off('connect', emit);
        };
      };

      if (this.connection.isConnected()) {
        return emit().then(registerOnConnect);
      }

      return Promise.resolve(registerOnConnect());
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      return this.emit('insertOne', object);
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      return this.emit('updateOne', object);
    }
  }, {
    key: 'updateSeveral',
    value: function updateSeveral(objects) {
      return this.emit('updateSeveral', objects);
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      return this.emit('partialUpdateByKey', key, partialUpdate);
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      return this.emit('partialUpdateOne', object, partialUpdate);
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      return this.emit('partialUpdateMany', criteria, partialUpdate);
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      return this.emit('deleteByKey', key);
    }
  }, {
    key: 'deleteOne',
    value: function deleteOne(object) {
      return this.emit('deleteOne', object);
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      return Promise.resolve(new WebsocketCursor(this, { criteria: criteria, sort: sort }));
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      return this.findOne({ id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      return this.emit('findOne', criteria, sort);
    }
  }]);
  return WebsocketStore;
}(liwiStore.AbstractStore);

exports.WebsocketStore = WebsocketStore;
exports.WebsocketCursor = WebsocketCursor;
//# sourceMappingURL=index-browser.cjs.js.map
