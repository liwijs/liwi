'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Logger = _interopDefault(require('nightingale-logger'));
var extendedJson = require('extended-json');
var liwiStore = require('liwi-store');

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var logger = new Logger('liwi:resources:query');

var ClientQuery =
/*#__PURE__*/
function (_AbstractQuery) {
  _inheritsLoose(ClientQuery, _AbstractQuery);

  function ClientQuery(client, key, params) {
    var _this = _AbstractQuery.call(this) || this;

    _this.client = client;
    _this.key = key;
    _this.params = params;
    return _this;
  }

  var _proto = ClientQuery.prototype;

  _proto.fetch = function fetch(onFulfilled) {
    return this.client.send('fetch', [this.key, this.params, undefined]).then(onFulfilled);
  };

  _proto._subscribe = function _subscribe(callback, _includeInitial) {
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

    var _stopEmitSubscribeOnConnect;

    var promise = this.client.emitSubscribe(_includeInitial ? 'fetchAndSubscribe' : 'subscribe', [this.key, this.params, eventName]).then(function (stopEmitSubscribe) {
      _stopEmitSubscribeOnConnect = stopEmitSubscribe;
      logger.info('subscribed');
    }, function (err) {
      _this2.client.off(eventName, listener);

      throw err;
    });

    var stop = function stop() {
      if (!promise) return;
      promise.then(function () {
        _stopEmitSubscribeOnConnect();

        _this2.client.send('unsubscribe', [_this2.key]);

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

  return ClientQuery;
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

  _proto.createQuery = function createQuery(key, params) {
    return new ClientQuery(this, key, params);
  };

  // cursor(
  //   criteria?: Criteria<Model>,
  //   sort?: Sort<Model>,
  // ): Promise<ClientCursor<Model, KeyPath>> {
  //   return Promise.resolve(new ClientCursor(this, { criteria, sort }));
  // }
  _proto.findByKey = function findByKey() {
    throw new Error('Use operations instead');
  };

  _proto.replaceOne = function replaceOne() {
    throw new Error('Use operations instead');
  };

  _proto.partialUpdateByKey = function partialUpdateByKey() {
    throw new Error('Use operations instead');
  };

  _proto.deleteByKey = function deleteByKey() {
    throw new Error('Use operations instead');
  };

  return AbstractClient;
}();

var createResourceClientService = function createResourceClientService(client, options) {
  var queries = {};
  var operations = {};
  options.queries.forEach(function (queryKey) {
    queries[queryKey] = function (params) {
      return client.createQuery(queryKey, params);
    };
  });
  options.operations.forEach(function (operationKey) {
    operations[operationKey] = function (params) {
      return client.send('do', [operationKey, params]);
    };
  });
  return {
    queries: queries,
    operations: operations
  };
};
/** @deprecated use createResourceClientService instead */

var createResourceClient = createResourceClientService;

exports.createResourceClientService = createResourceClientService;
exports.createResourceClient = createResourceClient;
exports.AbstractClient = AbstractClient;
//# sourceMappingURL=index-browser-dev.cjs.js.map
