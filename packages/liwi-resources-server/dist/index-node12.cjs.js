'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const liwiResources = require('liwi-resources');
const Logger = _interopDefault(require('nightingale-logger'));

// import ResourceServerCursor from './ResourceServerCursor';
// import { CursorResource } from './CursorResource';
class ResourcesServerService {
  // readonly cursorResources: Map<string, CursorResource<any, any, any>>;
  constructor({
    serviceResources = new Map()
  }) {
    this.serviceResources = serviceResources; // this.cursorResources = cursorResources;
  }

  addResource(key, resource) {
    this.serviceResources.set(key, resource);
  } // addCursorResource(
  //   key: string,
  //   cursorResource: CursorResource<any, any, any>,
  // ) {
  //   this.cursorResources.set(key, cursorResource);
  // }


  getServiceResource(key) {
    const resource = this.serviceResources.get(key);
    if (!resource) throw new Error(`Invalid service resource: "${key}"`);
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


}

/* eslint-disable complexity, max-lines */
const logger = new Logger('liwi:resources-websocket-client');

const logUnexpectedError = (error, message, payload) => {
  if (!(error instanceof liwiResources.ResourcesServerError)) {
    logger.error(message, {
      error,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      payload: 'redacted'
    });
  }
};

const createMessageHandler = (resourcesServerService, authenticatedUser, allowSubscriptions) => {
  const openedSubscriptions = allowSubscriptions ? new Map() : null;

  const getResource = payload => {
    logger.debug('resource', {
      resourceName: payload.resourceName
    });
    const resource = resourcesServerService.getServiceResource(payload.resourceName);
    return resource;
  };

  const createQuery = (payload, resource) => {
    if (!payload.key.startsWith('query')) {
      throw new Error('Invalid query key');
    } // eslint-disable-next-line @typescript-eslint/no-unsafe-return


    return resource.queries[payload.key](payload.params, authenticatedUser);
  };

  const createSubscription = (type, payload, resource, query, sendSubscriptionMessage) => {
    var _resource$subscribeHo;

    if (!openedSubscriptions) {
      throw new Error('Subscriptions not allowed');
    }

    const {
      subscriptionId
    } = payload;

    if (openedSubscriptions.has(subscriptionId)) {
      logger.warn("Already have a watcher for this id. Cannot add a new one", {
        subscriptionId,
        key: payload.key
      });
      throw new liwiResources.ResourcesServerError('ALREADY_HAVE_WATCHER', "Already have a watcher for this id. Cannot add a new one");
    }

    const subscription = query[type]((error, result) => {
      if (error) {
        logUnexpectedError(error, type);
      }

      sendSubscriptionMessage(subscriptionId, error, result);
    });
    const subscribeHook = (_resource$subscribeHo = resource.subscribeHooks) === null || _resource$subscribeHo === void 0 ? void 0 : _resource$subscribeHo[payload.key];
    openedSubscriptions.set(subscriptionId, {
      subscription,
      subscribeHook,
      params: subscribeHook ? payload.params : undefined
    });

    if (subscribeHook) {
      subscribeHook.subscribed(authenticatedUser, payload.params);
    }

    return subscription.then(() => null);
  };

  const unsubscribeSubscription = ({
    subscription,
    subscribeHook,
    params
  }) => {
    subscription.stop();

    if (subscribeHook) {
      subscribeHook.unsubscribed(authenticatedUser, params);
    }
  };

  return {
    close: () => {
      if (openedSubscriptions) {
        openedSubscriptions.forEach(unsubscribeSubscription);
      }
    },
    messageHandler: async (message, subscriptionCallback) => {
      switch (message.type) {
        case 'fetch':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource);
              return await query.fetch(result => result);
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
              throw err;
            }

            return;
          }

        case 'fetchAndSubscribe':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource);
              return await createSubscription('fetchAndSubscribe', message.payload, resource, query, subscriptionCallback);
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
              throw err;
            }

            return;
          }

        case 'subscribe':
          {
            try {
              const resource = getResource(message.payload);
              const query = createQuery(message.payload, resource);
              await createSubscription('subscribe', message.payload, resource, query, subscriptionCallback);
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
              throw err;
            }

            return;
          }
        // case 'subscribe:changePayload': {
        //   break;
        // }

        case 'subscribe:close':
          {
            if (!openedSubscriptions) {
              throw new Error('Subscriptions not allowed');
            }

            try {
              const {
                subscriptionId
              } = message.payload;
              const SubscriptionAndSubscribeHook = openedSubscriptions.get(subscriptionId);

              if (!SubscriptionAndSubscribeHook) {
                logger.warn('tried to unsubscribe non existing watcher', {
                  subscriptionId
                });
              } else {
                openedSubscriptions.delete(subscriptionId);
                unsubscribeSubscription(SubscriptionAndSubscribeHook);
              }
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
            }

            return;
          }

        case 'do':
          {
            try {
              const resource = getResource(message.payload);
              const {
                operationKey,
                params
              } = message.payload;
              const operation = resource.operations[operationKey];

              if (!operation) {
                throw new liwiResources.ResourcesServerError('OPERATION_NOT_FOUND', `Operation not found: ${operationKey}`);
              } // eslint-disable-next-line @typescript-eslint/no-unsafe-return


              return await operation(params, authenticatedUser);
            } catch (err) {
              logUnexpectedError(err, message.type, message.payload);
              throw err;
            }
          }
      }
    }
  };
};

exports.ResourcesServerError = liwiResources.ResourcesServerError;
exports.ResourcesServerService = ResourcesServerService;
exports.createMessageHandler = createMessageHandler;
//# sourceMappingURL=index-node12.cjs.js.map
