import { AbstractClient } from 'liwi-resources-client';

/* eslint-disable max-classes-per-file */
class VoidClient extends AbstractClient {
  emitSubscribe(type, args) {
    throw new Error('Void client: emitSubscribe should not be called');
  }

  createCursor(options) {
    throw new Error('Void client: createCursor should not be called');
  }

  send(type, value) {
    throw new Error('Void client: send should not be called');
  }

  on(event, handler) {
    throw new Error('Void client: on should not be called');
  }

  off(event, handler) {
    throw new Error('Void client: off should not be called');
  }

}

export { VoidClient };
//# sourceMappingURL=index-browsermodern.es.js.map
