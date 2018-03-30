import { AbstractCursor, ResultType, AbstractQuery, AbstractStore } from 'liwi-store';
import t from 'flow-runtime';
import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';

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

var ResultType$1 = t.tdz(function () {
  return ResultType;
});

var WebsocketCursor = function (_AbstractCursor) {
  inherits(WebsocketCursor, _AbstractCursor);

  function WebsocketCursor(store, options) {
    classCallCheck(this, WebsocketCursor);

    var _storeType = t.ref(WebsocketStore);

    t.param('store', _storeType).assert(store);

    var _this = possibleConstructorReturn(this, (WebsocketCursor.__proto__ || Object.getPrototypeOf(WebsocketCursor)).call(this, store));

    t.bindTypeParameters(_this, t.ref(WebsocketStore));

    _this._options = options;
    return _this;
  }

  /* options */

  createClass(WebsocketCursor, [{
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
      var _returnType4 = t.return(t.nullable(t.ref(ResultType$1)));

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
    value: function toArray$$1() {
      var _this5 = this;

      var _returnType6 = t.return(t.array(t.array(t.ref(ResultType$1))));

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

var SubscribeReturnType = t.type('SubscribeReturnType', t.object(t.property('cancel', t.function()), t.property('stop', t.function())));


var logger = new Logger('liwi:websocket-client:query');

var Query = function (_AbstractQuery) {
  inherits(Query, _AbstractQuery);

  function Query(store, key) {
    classCallCheck(this, Query);

    var _storeType = t.ref(WebsocketStore);

    var _keyType = t.string();

    t.param('store', _storeType).assert(store);
    t.param('key', _keyType).assert(key);

    var _this = possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, store));

    t.bindTypeParameters(_this, t.ref(WebsocketStore));

    _this.key = key;
    return _this;
  }

  createClass(Query, [{
    key: 'fetch',
    value: function fetch(callback) {
      var _callbackType = t.nullable(t.function());

      var _returnType = t.return(t.any());

      t.param('callback', _callbackType).assert(callback);

      return this.store.emit('fetch', this.key).then(callback).then(function (_arg) {
        return _returnType.assert(_arg);
      });
    }
  }, {
    key: '_subscribe',
    value: function _subscribe(callback) {
      var _this2 = this;

      var _includeInitial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var args = arguments[2];

      var _callbackType2 = t.function();

      var _argsType = t.array(t.any());

      var _returnType2 = t.return(SubscribeReturnType);

      t.param('callback', _callbackType2).assert(callback);
      t.param('args', _argsType).assert(args);

      var eventName = 'subscribe:' + this.store.restName + '.' + this.key;
      var listener = function listener(err, result) {
        var decodedResult = result && decode(result);
        logger.debug(eventName, { result: result, decodedResult: decodedResult });
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

      return _returnType2.assert({
        cancel: stop,
        stop: stop,
        then: function then(cb) {
          return Promise.resolve(promise).then(cb);
        }
      });
    }
  }]);
  return Query;
}(AbstractQuery);

var _class, _temp;
var logger$1 = new Logger('liwi:websocket-client');

var WebsocketConnectionType = t.type('WebsocketConnectionType', t.object(t.property('emit', t.function()), t.property('isConnected', t.function())));

var _WebsocketStoreTypeParametersSymbol = Symbol('WebsocketStoreTypeParameters');

var WebsocketStore = (_temp = _class = function (_AbstractStore) {
  inherits(WebsocketStore, _AbstractStore);

  function WebsocketStore(websocket, restName) {
    classCallCheck(this, WebsocketStore);
    var _typeParameters = {
      ModelType: t.typeParameter('ModelType')
    };

    var _restNameType = t.string();

    t.param('websocket', WebsocketConnectionType).assert(websocket);
    t.param('restName', _restNameType).assert(restName);

    var _this = possibleConstructorReturn(this, (WebsocketStore.__proto__ || Object.getPrototypeOf(WebsocketStore)).call(this, websocket));

    _this.keyPath = 'id';
    _this[_WebsocketStoreTypeParametersSymbol] = _typeParameters;
    t.bindTypeParameters(_this, WebsocketConnectionType);


    if (!restName) {
      throw new Error('Invalid restName: "' + restName + '"');
    }

    _this.restName = restName;
    return _this;
  }

  createClass(WebsocketStore, [{
    key: 'createQuery',
    value: function createQuery(key) {
      var _keyType = t.string();

      t.param('key', _keyType).assert(key);

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
        json: encode(args)
      }).then(function (result) {
        return result && decode(result);
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
      var _objectType = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      t.param('object', _objectType).assert(object);

      return this.emit('insertOne', object).then(function (_arg) {
        return _returnType.assert(_arg);
      });
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      var _objectType2 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType2 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      t.param('object', _objectType2).assert(object);

      return this.emit('updateOne', object).then(function (_arg2) {
        return _returnType2.assert(_arg2);
      });
    }
  }, {
    key: 'updateSeveral',
    value: function updateSeveral(objects) {
      var _objectsType = t.array(t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType));

      var _returnType3 = t.return(t.array(this[_WebsocketStoreTypeParametersSymbol].ModelType));

      t.param('objects', _objectsType).assert(objects);

      return this.emit('updateSeveral', objects).then(function (_arg3) {
        return _returnType3.assert(_arg3);
      });
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      var _keyType2 = t.any();

      var _partialUpdateType = t.object();

      var _returnType4 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      t.param('key', _keyType2).assert(key);
      t.param('partialUpdate', _partialUpdateType).assert(partialUpdate);

      return this.emit('partialUpdateByKey', key, partialUpdate).then(function (_arg4) {
        return _returnType4.assert(_arg4);
      });
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      var _objectType3 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _partialUpdateType2 = t.object();

      var _returnType5 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      t.param('object', _objectType3).assert(object);
      t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate);

      return this.emit('partialUpdateOne', object, partialUpdate).then(function (_arg5) {
        return _returnType5.assert(_arg5);
      });
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      var _partialUpdateType3 = t.object();

      var _returnType6 = t.return(t.void());

      t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate);

      return this.emit('partialUpdateMany', criteria, partialUpdate).then(function (_arg6) {
        return _returnType6.assert(_arg6);
      });
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      var _keyType3 = t.any();

      var _returnType7 = t.return(t.void());

      t.param('key', _keyType3).assert(key);

      return this.emit('deleteByKey', key).then(function (_arg7) {
        return _returnType7.assert(_arg7);
      });
    }
  }, {
    key: 'deleteOne',
    value: function deleteOne(object) {
      var _objectType4 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType8 = t.return(t.void());

      t.param('object', _objectType4).assert(object);

      return this.emit('deleteOne', object).then(function (_arg8) {
        return _returnType8.assert(_arg8);
      });
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      var _returnType9 = t.return(t.ref(WebsocketCursor, this[_WebsocketStoreTypeParametersSymbol].ModelType));

      t.param('criteria', _criteriaType).assert(criteria);
      t.param('sort', _sortType).assert(sort);

      return Promise.resolve(new WebsocketCursor(this, { criteria: criteria, sort: sort })).then(function (_arg9) {
        return _returnType9.assert(_arg9);
      });
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      var _keyType4 = t.any();

      t.param('key', _keyType4).assert(key);

      return this.findOne({ id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      var _criteriaType2 = t.object();

      var _sortType2 = t.nullable(t.object());

      var _returnType10 = t.return(t.object());

      t.param('criteria', _criteriaType2).assert(criteria);
      t.param('sort', _sortType2).assert(sort);

      return this.emit('findOne', criteria, sort).then(function (_arg10) {
        return _returnType10.assert(_arg10);
      });
    }
  }]);
  return WebsocketStore;
}(AbstractStore), _class[t.TypeParametersSymbol] = _WebsocketStoreTypeParametersSymbol, _temp);

export { WebsocketStore, WebsocketCursor };
//# sourceMappingURL=index-browser-dev.es.js.map
