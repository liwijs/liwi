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

export { createVoidTransportClient };
//# sourceMappingURL=index-browsermodern.es.js.map
