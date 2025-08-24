class ResourcesServerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ResourcesServerError";
    this.code = code;
  }
}

export { ResourcesServerError };
//# sourceMappingURL=index-node.mjs.map
