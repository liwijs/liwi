'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createVoidTransportClient = () => {
  return {
    connect: () => {},
    close: () => {},
    listenStateChange: () => {
      return () => {};
    },
    send: () => {
      throw new Error('Void client: send should not be called');
    },
    subscribe: () => {
      throw new Error('Void client: subscribe should not be called');
    }
  };
};

exports.createVoidTransportClient = createVoidTransportClient;
//# sourceMappingURL=index-node14.cjs.map
