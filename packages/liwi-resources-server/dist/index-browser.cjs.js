'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var liwiResources = require('liwi-resources');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/esm/asyncToGenerator'));
var Logger = _interopDefault(require('nightingale-logger'));

// import ResourceServerCursor from './ResourceServerCursor';
// import { CursorResource } from './CursorResource';
var ResourcesServerService = /*#__PURE__*/function () {
  // readonly cursorResources: Map<string, CursorResource<any, any, any>>;
  function ResourcesServerService(_ref) {
    var _ref$serviceResources = _ref.serviceResources,
        serviceResources = _ref$serviceResources === void 0 ? new Map() : _ref$serviceResources;
    this.serviceResources = serviceResources; // this.cursorResources = cursorResources;
  }

  var _proto = ResourcesServerService.prototype;

  _proto.addResource = function addResource(key, resource) {
    this.serviceResources.set(key, resource);
  } // addCursorResource(
  //   key: string,
  //   cursorResource: CursorResource<any, any, any>,
  // ) {
  //   this.cursorResources.set(key, cursorResource);
  // }
  ;

  _proto.getServiceResource = function getServiceResource(key) {
    var resource = this.serviceResources.get(key);
    if (!resource) throw new Error("Invalid service resource: \"" + key + "\"");
    return resource;
  } // getCursorResource(key: string) {
  //   const resource = this.cursorResources.get(key);
  //   if (!resource) throw new Error(`Invalid cursor resource: "${key}"`);
  //   return resource;
  // }
  // async createCursor<Model extends BaseModel, Transformed, ConnectedUser>(
  //   resource: CursorResource<Model, Transformed, ConnectedUser>,
  //   connectedUser: ConnectedUser,
  //   { criteria, sort, limit }: CreateCursorOptions<Model>,
  // ): Promise<ResourceServerCursor<Model, any, Transformed, ConnectedUser>> {
  //   // TODO: resource.query(connectedUser, criteria || {}, sort).cursor()
  //   criteria = resource.criteria(connectedUser, criteria || {});
  //   sort = resource.sort(connectedUser, sort);
  //   const cursor = await resource.store.cursor(criteria, sort);
  //   limit = resource.limit(limit);
  //   if (limit) cursor.limit(limit);
  //   return new ResourceServerCursor(resource, cursor, connectedUser);
  // }
  ;

  return ResourcesServerService;
}();

var logger = new Logger('liwi:resources-websocket-client');

var logUnexpectedError = function logUnexpectedError(error, message, payload) {
  if (!(error instanceof liwiResources.ResourcesServerError)) {
    logger.error(message, {
      error: error,
      payload: 'redacted'
    });
  }
};

var createMessageHandler = function createMessageHandler(resourcesServerService, authenticatedUser, allowSubscriptions) {
  var openSubscriptions = allowSubscriptions ? new Map() : null;

  var getResource = function getResource(payload) {
    logger.debug('resource', {
      resourceName: payload.resourceName
    });
    var resource = resourcesServerService.getServiceResource(payload.resourceName);
    return resource;
  };

  var createQuery = function createQuery(payload, resource) {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    }

    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  var createSubscription = function createSubscription(type, payload, resource, query, sendSubscriptionMessage) {
    if (!openSubscriptions) {
      throw new Error('Subscriptions not allowed');
    }

    var subscriptionId = payload.subscriptionId;

    if (openSubscriptions.has(subscriptionId)) {
      logger.warn("Already have a watcher for this id. Cannot add a new one", {
        subscriptionId: subscriptionId,
        key: payload.key
      });
      throw new liwiResources.ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
    }

    var subscription = query[type](function (error, result) {
      if (error) {
        logUnexpectedError(error, type);
      }

      sendSubscriptionMessage(subscriptionId, error, result);
    });
    var subscribeHook = resource.subscribeHooks && resource.subscribeHooks[payload.key];
    openSubscriptions.set(subscriptionId, {
      subscription: subscription,
      subscribeHook: subscribeHook,
      params: subscribeHook ? payload.params : undefined
    });

    if (subscribeHook) {
      subscribeHook.subscribed(authenticatedUser, payload.params);
    }

    return subscription.then(function () {
      return null;
    });
  };

  var unsubscribeSubscription = function unsubscribeSubscription(_ref) {
    var subscription = _ref.subscription,
        subscribeHook = _ref.subscribeHook,
        params = _ref.params;
    subscription.stop();

    if (subscribeHook) {
      subscribeHook.unsubscribed(authenticatedUser, params);
    }
  };

  return {
    close: function close() {
      if (openSubscriptions) {
        openSubscriptions.forEach(unsubscribeSubscription);
      }
    },
    messageHandler: function () {
      var _messageHandler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(message, subscriptionCallback) {
        var resource, query, _resource, _query, _resource2, _query2, _subscriptionId, _SubscriptionAndSubscribeHook, _resource3, _message$payload, operationKey, params, operation;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = message.type;
                _context.next = _context.t0 === 'fetch' ? 3 : _context.t0 === 'fetchAndSubscribe' ? 15 : _context.t0 === 'subscribe' ? 32 : _context.t0 === 'subscribe:close' ? 44 : _context.t0 === 'do' ? 48 : 63;
                break;

              case 3:
                _context.prev = 3;
                resource = getResource(message.payload);
                query = createQuery(message.payload, resource);
                _context.next = 8;
                return query.fetch(function (result) {
                  return result;
                });

              case 8:
                _context.next = 14;
                break;

              case 10:
                _context.prev = 10;
                _context.t1 = _context["catch"](3);
                logUnexpectedError(_context.t1, message.type, message.payload);
                throw _context.t1;

              case 14:
                return _context.abrupt("break", 63);

              case 15:
                _context.prev = 15;
                _resource = getResource(message.payload);
                _query = createQuery(message.payload, _resource);

                if (openSubscriptions) {
                  _context.next = 23;
                  break;
                }

                _context.next = 21;
                return _query.fetch(function (result) {
                  return result;
                });

              case 21:
                _context.next = 25;
                break;

              case 23:
                _context.next = 25;
                return createSubscription('fetchAndSubscribe', message.payload, _resource, _query, subscriptionCallback);

              case 25:
                _context.next = 31;
                break;

              case 27:
                _context.prev = 27;
                _context.t2 = _context["catch"](15);
                logUnexpectedError(_context.t2, message.type, message.payload);
                throw _context.t2;

              case 31:
                return _context.abrupt("break", 63);

              case 32:
                _context.prev = 32;
                _resource2 = getResource(message.payload);
                _query2 = createQuery(message.payload, _resource2);
                _context.next = 37;
                return createSubscription('subscribe', message.payload, _resource2, _query2, subscriptionCallback);

              case 37:
                _context.next = 43;
                break;

              case 39:
                _context.prev = 39;
                _context.t3 = _context["catch"](32);
                logUnexpectedError(_context.t3, message.type, message.payload);
                throw _context.t3;

              case 43:
                return _context.abrupt("break", 63);

              case 44:
                if (openSubscriptions) {
                  _context.next = 46;
                  break;
                }

                throw new Error('Subscriptions not allowed');

              case 46:
                try {
                  _subscriptionId = message.payload.subscriptionId;
                  _SubscriptionAndSubscribeHook = openSubscriptions.get(_subscriptionId);

                  if (!_SubscriptionAndSubscribeHook) {
                    logger.warn('tried to unsubscribe non existing watcher', {
                      subscriptionId: _subscriptionId
                    });
                  } else {
                    openSubscriptions.delete(_subscriptionId);
                    unsubscribeSubscription(_SubscriptionAndSubscribeHook);
                  }
                } catch (err) {
                  logUnexpectedError(err, message.type, message.payload);
                }

                return _context.abrupt("break", 63);

              case 48:
                _context.prev = 48;
                _resource3 = getResource(message.payload);
                _message$payload = message.payload, operationKey = _message$payload.operationKey, params = _message$payload.params;
                operation = _resource3.operations[operationKey];

                if (operation) {
                  _context.next = 54;
                  break;
                }

                throw new liwiResources.ResourcesServerError('OPERATION_NOT_FOUND', "Operation not found: " + operationKey);

              case 54:
                _context.next = 56;
                return operation(params, authenticatedUser);

              case 56:
                return _context.abrupt("return", _context.sent);

              case 59:
                _context.prev = 59;
                _context.t4 = _context["catch"](48);
                logUnexpectedError(_context.t4, message.type, message.payload);
                throw _context.t4;

              case 63:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 10], [15, 27], [32, 39], [48, 59]]);
      }));

      return function messageHandler() {
        return _messageHandler.apply(this, arguments);
      };
    }()
  };
};

Object.defineProperty(exports, 'ResourcesServerError', {
  enumerable: true,
  get: function () {
    return liwiResources.ResourcesServerError;
  }
});
exports.ResourcesServerService = ResourcesServerService;
exports.createMessageHandler = createMessageHandler;
//# sourceMappingURL=index-browser.cjs.js.map
