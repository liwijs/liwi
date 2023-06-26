import { ResourcesServerError } from 'liwi-resources';
export { ResourcesServerError } from 'liwi-resources';
import _regeneratorRuntime from '@babel/runtime/helpers/esm/regeneratorRuntime';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import { Logger } from 'nightingale-logger';

// import ResourceServerCursor from './ResourceServerCursor';

// import { CursorResource } from './CursorResource';

var ResourcesServerService = /*#__PURE__*/function () {
  // readonly cursorResources: Map<string, CursorResource<any, any, any>>;

  function ResourcesServerService(_ref) {
    var _ref$serviceResources = _ref.serviceResources,
      serviceResources = _ref$serviceResources === void 0 ? new Map() : _ref$serviceResources;
    this.serviceResources = serviceResources;
    // this.cursorResources = cursorResources;
  }
  var _proto = ResourcesServerService.prototype;
  _proto.addResource = function addResource(key, resource) {
    this.serviceResources.set(key, resource);
  }

  // addCursorResource(
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
  }

  // getCursorResource(key: string) {
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
  if (!(error instanceof ResourcesServerError)) {
    logger.error(message, {
      error: error,
      payload: !(process.env.NODE_ENV !== "production") ? 'redacted' : payload
    });
  } else if (process.env.NODE_ENV !== "production") {
    logger.info("ResourcesServerError in " + message, {
      code: error.code,
      message: error.message,
      payload: payload
    });
  }
};
var createMessageHandler = function createMessageHandler(resourcesServerService, authenticatedUser, allowSubscriptions) {
  var openedSubscriptions = allowSubscriptions ? new Map() : null;
  var getResource = function getResource(payload) {
    logger.debug('resource', {
      resourceName: payload.resourceName
    });
    var resource = resourcesServerService.getServiceResource(payload.resourceName);
    return resource;
  };
  var createQuery = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(payload, resource) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (payload.key.startsWith('query')) {
              _context.next = 2;
              break;
            }
            throw new Error('Invalid query key');
          case 2:
            return _context.abrupt("return", resource.queries[payload.key](payload.params, authenticatedUser));
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function createQuery() {
      return _ref.apply(this, arguments);
    };
  }();
  var createSubscription = function createSubscription(type, payload, resource, query, sendSubscriptionMessage) {
    var _resource$subscribeHo;
    if (!openedSubscriptions) {
      throw new Error('Subscriptions not allowed');
    }
    var subscriptionId = payload.subscriptionId;
    if (openedSubscriptions.has(subscriptionId)) {
      logger.warn("Already have a watcher for this id. Cannot add a new one", {
        subscriptionId: subscriptionId,
        key: payload.key
      });
      throw new ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
    }
    var subscription = query[type](function (error, result) {
      if (error) {
        logUnexpectedError(error, type, payload);
      }
      sendSubscriptionMessage(subscriptionId, error, result);
    });
    var subscribeHook = (_resource$subscribeHo = resource.subscribeHooks) == null ? void 0 : _resource$subscribeHo[payload.key];
    openedSubscriptions.set(subscriptionId, {
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
  var unsubscribeSubscription = function unsubscribeSubscription(_ref2) {
    var subscription = _ref2.subscription,
      subscribeHook = _ref2.subscribeHook,
      params = _ref2.params;
    subscription.stop();
    if (subscribeHook) {
      subscribeHook.unsubscribed(authenticatedUser, params);
    }
  };
  return {
    close: function close() {
      if (openedSubscriptions) {
        openedSubscriptions.forEach(unsubscribeSubscription);
      }
    },
    messageHandler: function () {
      var _messageHandler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(message, subscriptionCallback) {
        var resource, query, _resource, _query, _resource2, _query2, _subscriptionId, _SubscriptionAndSubscribeHook, _resource3, _message$payload, operationKey, params, operation;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.t0 = message.type;
              _context2.next = _context2.t0 === 'fetch' ? 3 : _context2.t0 === 'fetchAndSubscribe' ? 18 : _context2.t0 === 'subscribe' ? 33 : _context2.t0 === 'subscribe:close' ? 47 : _context2.t0 === 'do' ? 51 : 64;
              break;
            case 3:
              _context2.prev = 3;
              resource = getResource(message.payload);
              _context2.next = 7;
              return createQuery(message.payload, resource);
            case 7:
              query = _context2.sent;
              _context2.next = 10;
              return query.fetch(function (result) {
                return result;
              });
            case 10:
              return _context2.abrupt("return", _context2.sent);
            case 13:
              _context2.prev = 13;
              _context2.t1 = _context2["catch"](3);
              logUnexpectedError(_context2.t1, message.type, message.payload);
              throw _context2.t1;
            case 17:
              return _context2.abrupt("return");
            case 18:
              _context2.prev = 18;
              _resource = getResource(message.payload);
              _context2.next = 22;
              return createQuery(message.payload, _resource);
            case 22:
              _query = _context2.sent;
              _context2.next = 25;
              return createSubscription('fetchAndSubscribe', message.payload, _resource, _query, subscriptionCallback);
            case 25:
              return _context2.abrupt("return", _context2.sent);
            case 28:
              _context2.prev = 28;
              _context2.t2 = _context2["catch"](18);
              logUnexpectedError(_context2.t2, message.type, message.payload);
              throw _context2.t2;
            case 32:
              return _context2.abrupt("return");
            case 33:
              _context2.prev = 33;
              _resource2 = getResource(message.payload);
              _context2.next = 37;
              return createQuery(message.payload, _resource2);
            case 37:
              _query2 = _context2.sent;
              _context2.next = 40;
              return createSubscription('subscribe', message.payload, _resource2, _query2, subscriptionCallback);
            case 40:
              _context2.next = 46;
              break;
            case 42:
              _context2.prev = 42;
              _context2.t3 = _context2["catch"](33);
              logUnexpectedError(_context2.t3, message.type, message.payload);
              throw _context2.t3;
            case 46:
              return _context2.abrupt("return");
            case 47:
              if (openedSubscriptions) {
                _context2.next = 49;
                break;
              }
              throw new Error('Subscriptions not allowed');
            case 49:
              try {
                _subscriptionId = message.payload.subscriptionId;
                _SubscriptionAndSubscribeHook = openedSubscriptions.get(_subscriptionId);
                if (!_SubscriptionAndSubscribeHook) {
                  logger.warn('tried to unsubscribe non existing watcher', {
                    subscriptionId: _subscriptionId
                  });
                } else {
                  openedSubscriptions.delete(_subscriptionId);
                  unsubscribeSubscription(_SubscriptionAndSubscribeHook);
                }
              } catch (err) {
                logUnexpectedError(err, message.type, message.payload);
              }
              return _context2.abrupt("return");
            case 51:
              _context2.prev = 51;
              _resource3 = getResource(message.payload);
              _message$payload = message.payload, operationKey = _message$payload.operationKey, params = _message$payload.params;
              operation = _resource3.operations[operationKey];
              if (operation) {
                _context2.next = 57;
                break;
              }
              throw new ResourcesServerError('OPERATION_NOT_FOUND', "Operation not found: " + operationKey);
            case 57:
              return _context2.abrupt("return", operation(params, authenticatedUser));
            case 60:
              _context2.prev = 60;
              _context2.t4 = _context2["catch"](51);
              logUnexpectedError(_context2.t4, message.type, message.payload);
              throw _context2.t4;
            case 64:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 13], [18, 28], [33, 42], [51, 60]]);
      }));
      return function messageHandler() {
        return _messageHandler.apply(this, arguments);
      };
    }()
  };
};

export { ResourcesServerService, createMessageHandler };
//# sourceMappingURL=index-browser.es.js.map
