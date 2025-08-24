class ResourcesServerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ResourcesServerError";
    this.code = code;
  }
}

export { ResourcesServerError };
//# sourceMappingURL=index-browser.es.js.map
