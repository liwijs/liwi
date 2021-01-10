'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
// export type ToServerSubscribeQueryChangePayload = ToServerQueryPayload;
class ResourcesServerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ResourcesServerError';
    this.code = code;
  }

}

exports.ResourcesServerError = ResourcesServerError;
//# sourceMappingURL=index-node12-dev.cjs.js.map
