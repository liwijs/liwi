class AbstractConnection {}

class AbstractCursor {
  nextResult() {
    return this.next().then(() => this.result());
  }
  async forEachKeys(callback) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const key = await this.next();
      if (!key) return;
      await callback(key);
    }
  }
  forEach(callback) {
    return this.forEachKeys(() => this.result().then(result => callback(result)));
  }
  *keysIterator() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      yield this.next();
    }
  }
  *[Symbol.iterator]() {
    for (const keyPromise of this.keysIterator()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      yield keyPromise.then(key => key && this.result());
    }
  }

  // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
}

class AbstractStoreCursor extends AbstractCursor {
  constructor(store) {
    super();
    this._store = store;
  }
  get store() {
    return this._store;
  }
  overrideStore(store) {
    this._store = store;
  }
  result() {
    if (!this.key) throw new Error("Cannot call result() before next()");
    return this.store.findByKey(this.key);
  }
  delete() {
    return this.store.deleteByKey(this.key);
  }
}

export { AbstractConnection, AbstractCursor, AbstractStoreCursor };
//# sourceMappingURL=index-node22.mjs.map
