import { AbstractClient } from 'liwi-resources-client';

class VoidClient extends AbstractClient {
  emitSubscribe() {
    throw new Error('Void client: emitSubscribe should not be called');
  }

  createCursor() {
    throw new Error('Void client: createCursor should not be called');
  }

  send() {
    throw new Error('Void client: send should not be called');
  }

  on() {
    throw new Error('Void client: on should not be called');
  }

  off() {
    throw new Error('Void client: off should not be called');
  }

}

export { VoidClient };
//# sourceMappingURL=index-node10.es.js.map
