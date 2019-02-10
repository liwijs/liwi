'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var liwiResourcesClient = require('liwi-resources-client');

class VoidClient extends liwiResourcesClient.AbstractClient {
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

exports.VoidClient = VoidClient;
//# sourceMappingURL=index-node8-dev.cjs.js.map
