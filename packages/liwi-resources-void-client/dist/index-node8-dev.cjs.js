'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const liwiResourcesClient = require('liwi-resources-client');

/* eslint-disable max-classes-per-file */
class VoidClient extends liwiResourcesClient.AbstractClient {
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

exports.VoidClient = VoidClient;
//# sourceMappingURL=index-node8-dev.cjs.js.map
