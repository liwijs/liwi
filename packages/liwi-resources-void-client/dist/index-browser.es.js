var createVoidTransportClient = function createVoidTransportClient() {
  return {
    connect: function connect() {},
    close: function close() {},
    listenStateChange: function listenStateChange() {
      return function () {};
    },
    send: function send() {
      throw new Error('Void client: send should not be called');
    },
    subscribe: function subscribe() {
      throw new Error('Void client: subscribe should not be called');
    }
  };
};

export { createVoidTransportClient };
//# sourceMappingURL=index-browser.es.js.map
