import { createMessageHandler } from 'liwi-resources-server';

const createDirectTransportClient = ({
  resourcesServerService,
  authenticatedUser
}) => {
  const {
    messageHandler,
    close
  } = createMessageHandler(resourcesServerService, authenticatedUser, false);
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

export { createDirectTransportClient };
//# sourceMappingURL=index-node12.es.js.map
