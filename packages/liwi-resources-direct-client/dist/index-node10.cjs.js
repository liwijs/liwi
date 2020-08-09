'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const liwiResourcesServer = require('liwi-resources-server');

const createDirectTransportClient = ({
  resourcesServerService,
  authenticatedUser
}) => {
  const {
    messageHandler,
    close
  } = liwiResourcesServer.createMessageHandler(resourcesServerService, authenticatedUser, false);
  return {
    connect: () => {},
    close,
    listenStateChange: () => {
      return () => {};
    },
    send: (type, message) => {
      return messageHandler({
        type,
        id: 0,
        payload: message
      }, () => {
        throw new Error('Unsupported');
      });
    },
    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      const message = { ...messageWithoutSubscriptionId,
        subscriptionId: 0
      };
      const p = messageHandler({
        type,
        id: 0,
        payload: message
      }, () => {}).then(result => {
        callback(null, result);
      }, err => {
        callback(err);
      });
      p.then();

      p.stop = () => {};

      p.cancel = () => {};

      return p;
    }
  };
};

exports.createDirectTransportClient = createDirectTransportClient;
//# sourceMappingURL=index-node10.cjs.js.map
