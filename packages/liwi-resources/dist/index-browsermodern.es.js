// eslint-disable-next-line @typescript-eslint/consistent-type-definitions

// export type ToServerSubscribeQueryChangePayload = ToServerQueryPayload;

class ResourcesServerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ResourcesServerError';
    this.code = code;
  }
}

export { ResourcesServerError };
//# sourceMappingURL=index-browsermodern.es.js.map
