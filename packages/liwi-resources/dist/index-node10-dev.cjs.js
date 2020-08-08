'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class ResourcesServerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ResourcesServerError';
    this.code = code;
  }

}

exports.ResourcesServerError = ResourcesServerError;
//# sourceMappingURL=index-node10-dev.cjs.js.map
