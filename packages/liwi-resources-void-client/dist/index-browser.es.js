const createVoidTransportClient = () => {
  const transportClient = {
    connect: () => {
    },
    close: () => {
    },
    listenStateChange: () => {
      return () => {
      };
    },
    send: (type, message) => {
      throw new Error("Void client: send should not be called");
    },
    subscribe: (type, messageWithoutSubscriptionId, callback) => {
      throw new Error("Void client: subscribe should not be called");
    }
  };
  return transportClient;
};

export { createVoidTransportClient };
//# sourceMappingURL=index-browser.es.js.map
