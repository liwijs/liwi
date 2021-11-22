'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var liwiResources = require('liwi-resources');
var _asyncToGenerator = require('@babel/runtime/helpers/esm/asyncToGenerator');
var _regeneratorRuntime = require('@babel/runtime/regenerator');
var Logger = require('nightingale-logger');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

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

var logger = new Logger__default('liwi:resources-websocket-client');

var logUnexpectedError = function logUnexpectedError(error, message, payload) {
  if (!(error instanceof liwiResources.ResourcesServerError)) {
    logger.error(message, {
      error: error,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: 'redacted'
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

  var createQuery = function createQuery(payload, resource) {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    } // eslint-disable-next-line @typescript-eslint/no-unsafe-return


    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

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
      throw new liwiResources.ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
    }

    var subscription = query[type](function (error, result) {
      if (error) {
        logUnexpectedError(error, type);
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
      if (openedSubscriptions) {
        openedSubscriptions.forEach(unsubscribeSubscription);
      }
    },
    messageHandler: function () {
      var _messageHandler = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(message, subscriptionCallback) {
        var resource, query, _resource, _query, _resource2, _query2, _subscriptionId, _SubscriptionAndSubscribeHook, _resource3, _message$payload, operationKey, params, operation;

        return _regeneratorRuntime__default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = message.type;
                _context.next = _context.t0 === 'fetch' ? 3 : _context.t0 === 'fetchAndSubscribe' ? 16 : _context.t0 === 'subscribe' ? 29 : _context.t0 === 'subscribe:close' ? 41 : _context.t0 === 'do' ? 45 : 60;
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
                return _context.abrupt("return", _context.sent);

              case 11:
                _context.prev = 11;
                _context.t1 = _context["catch"](3);
                logUnexpectedError(_context.t1, message.type, message.payload);
                throw _context.t1;

              case 15:
                return _context.abrupt("return");

              case 16:
                _context.prev = 16;
                _resource = getResource(message.payload);
                _query = createQuery(message.payload, _resource);
                _context.next = 21;
                return createSubscription('fetchAndSubscribe', message.payload, _resource, _query, subscriptionCallback);

              case 21:
                return _context.abrupt("return", _context.sent);

              case 24:
                _context.prev = 24;
                _context.t2 = _context["catch"](16);
                logUnexpectedError(_context.t2, message.type, message.payload);
                throw _context.t2;

              case 28:
                return _context.abrupt("return");

              case 29:
                _context.prev = 29;
                _resource2 = getResource(message.payload);
                _query2 = createQuery(message.payload, _resource2);
                _context.next = 34;
                return createSubscription('subscribe', message.payload, _resource2, _query2, subscriptionCallback);

              case 34:
                _context.next = 40;
                break;

              case 36:
                _context.prev = 36;
                _context.t3 = _context["catch"](29);
                logUnexpectedError(_context.t3, message.type, message.payload);
                throw _context.t3;

              case 40:
                return _context.abrupt("return");

              case 41:
                if (openedSubscriptions) {
                  _context.next = 43;
                  break;
                }

                throw new Error('Subscriptions not allowed');

              case 43:
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

                return _context.abrupt("return");

              case 45:
                _context.prev = 45;
                _resource3 = getResource(message.payload);
                _message$payload = message.payload, operationKey = _message$payload.operationKey, params = _message$payload.params;
                operation = _resource3.operations[operationKey];

                if (operation) {
                  _context.next = 51;
                  break;
                }

                throw new liwiResources.ResourcesServerError('OPERATION_NOT_FOUND', "Operation not found: " + operationKey);

              case 51:
                _context.next = 53;
                return operation(params, authenticatedUser);

              case 53:
                return _context.abrupt("return", _context.sent);

              case 56:
                _context.prev = 56;
                _context.t4 = _context["catch"](45);
                logUnexpectedError(_context.t4, message.type, message.payload);
                throw _context.t4;

              case 60:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 11], [16, 24], [29, 36], [45, 56]]);
      }));

      return function messageHandler() {
        return _messageHandler.apply(this, arguments);
      };
    }()
  };
};

exports.ResourcesServerError = liwiResources.ResourcesServerError;
exports.ResourcesServerService = ResourcesServerService;
exports.createMessageHandler = createMessageHandler;
//# sourceMappingURL=index-browser.cjs.js.map
