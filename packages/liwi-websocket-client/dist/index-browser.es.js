import Logger from 'nightingale-logger';
import { decode, encode } from 'extended-json';
import { AbstractCursor, AbstractQuery, AbstractStore } from 'liwi-store';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var WebsocketCursor =
/*#__PURE__*/
function (_AbstractCursor) {
  _inheritsLoose(WebsocketCursor, _AbstractCursor);

  function WebsocketCursor(store, options) {
    var _this = _AbstractCursor.call(this, store) || this;

    _this.options = options;
    return _this;
  }
  /* options */


  var _proto = WebsocketCursor.prototype;

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
    return this.store.connection.emit('createCursor', this.options).then(function (idCursor) {
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

    return this.store.emit('cursor', {
      type: type,
      id: this._idCursor
    }, args);
  };

  _proto.advance = function advance(count) {
    this.emit('advance', count);
    return this;
  };

  _proto.next = function next() {
    var _this4 = this;

    return this.emit('next').then(function (result) {
      _this4._result = result;
      _this4.key = result && result[_this4._store.keyPath];
      return _this4.key;
    });
  };

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
    if (!this._store) return Promise.resolve();
    var closedPromise = this._idCursor ? this.emit('close') : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  };

  _proto.toArray = function toArray() {
    var _this5 = this;

    return this.store.emit('cursor toArray', this.options).then(function (result) {
      _this5.close();

      return result;
    });
  };

  return WebsocketCursor;
}(AbstractCursor);

var logger = new Logger('liwi:websocket-client:query');

var Query =
/*#__PURE__*/
function (_AbstractQuery) {
  _inheritsLoose(Query, _AbstractQuery);

  function Query(store, key) {
    var _this = _AbstractQuery.call(this, store) || this;

    _this.key = key;
    return _this;
  }

  var _proto = Query.prototype;

  _proto.fetch = function fetch(onFulfilled) {
    return _AbstractQuery.prototype.store.emit('fetch', this.key).then(onFulfilled);
  };

  _proto._subscribe = function _subscribe(callback, _includeInitial, args) {
    if (_includeInitial === void 0) {
      _includeInitial = false;
    }

    var eventName = "subscribe:" + _AbstractQuery.prototype.store.restName + "." + this.key;

    var listener = function listener(err, result) {
      var decodedResult = result && decode(result);
      callback(err, decodedResult);
    };

    var connection = _AbstractQuery.prototype.store.connection;
    connection.on(eventName, listener);

    var _stopEmitSubscribe;

    var promise = _AbstractQuery.prototype.store.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', this.key, eventName, args).then(function (stopEmitSubscribe) {
      _stopEmitSubscribe = stopEmitSubscribe;
      logger.info('subscribed');
    }).catch(function (err) {
      connection.off(eventName, listener);
      throw err;
    });

    var stop = function stop() {
      if (!promise) return;

      _stopEmitSubscribe();

      promise.then(function () {
        promise = undefined;
        connection.off(eventName, listener);
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
}(AbstractQuery);

var logger$1 = new Logger('liwi:websocket-client');

var WebsocketStore =
/*#__PURE__*/
function (_AbstractStore) {
  _inheritsLoose(WebsocketStore, _AbstractStore);

  function WebsocketStore(websocket, restName, keyPath) {
    var _this = _AbstractStore.call(this, websocket, keyPath) || this;

    if (!restName) {
      throw new Error("Invalid restName: \"" + restName + "\"");
    }

    _this.restName = restName;
    return _this;
  }

  var _proto = WebsocketStore.prototype;

  _proto.createQuery = function createQuery(key) {
    logger$1.debug('createQuery', {
      key: key
    });
    return new Query(this, key);
  };

  _proto.emitSubscribe = function emitSubscribe(type) {
    var _this2 = this,
        _len,
        args,
        _key;

    for (_len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var connection = _AbstractStore.prototype.connection;

    var emit = function emit() {
      return _this2.emit.apply(_this2, [type].concat(args));
    };

    var registerOnConnect = function registerOnConnect() {
      connection.on('connect', emit);
      return function () {
        connection.off('connect', emit);
      };
    };

    if (connection.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  };

  _proto.insertOne = function insertOne(object) {
    return this.emit('insertOne', object);
  };

  _proto.replaceOne = function replaceOne(object) {
    return this.emit('replaceOne', object);
  };

  _proto.replaceSeveral = function replaceSeveral(objects) {
    return this.emit('replaceSeveral', objects);
  };

  _proto.upsertOneWithInfo = function upsertOneWithInfo(object) {
    return this.emit('upsertOneWithInfo', object);
  };

  _proto.partialUpdateByKey = function partialUpdateByKey(key, partialUpdate) {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  };

  _proto.partialUpdateOne = function partialUpdateOne(object, partialUpdate) {
    return this.emit('partialUpdateOne', object, partialUpdate);
  };

  _proto.partialUpdateMany = function partialUpdateMany(criteria, partialUpdate) {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  };

  _proto.cursor = function cursor(criteria, sort) {
    return Promise.resolve(new WebsocketCursor(this, {
      criteria: criteria,
      sort: sort
    }));
  };

  _proto.findByKey = function findByKey(key) {
    var _this$findOne;

    return this.findOne((_this$findOne = {}, _this$findOne[_AbstractStore.prototype.keyPath] = key, _this$findOne));
  };

  _proto.findOne = function findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  };

  _proto.deleteByKey = function deleteByKey(key) {
    return this.emit('deleteByKey', key);
  };

  _proto.deleteMany = function deleteMany(criteria) {
    return this.emit('deleteMany', criteria);
  };

  _proto.emit = function emit(type) {
    var _len2, args, _key2;

    for (_len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    logger$1.debug('emit', {
      type: type,
      args: args
    });

    if (_AbstractStore.prototype.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return _AbstractStore.prototype.connection.emit('rest', {
      type: type,
      restName: this.restName,
      json: encode(args)
    }).then(function (result) {
      return result && decode(result);
    });
  };

  return WebsocketStore;
}(AbstractStore);

export { WebsocketStore, WebsocketCursor };
//# sourceMappingURL=index-browser.es.js.map
