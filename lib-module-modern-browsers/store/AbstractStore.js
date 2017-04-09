import assert from 'assert';

let AbstractStore = class {
  /**
   * @param {AbstractConnection} connection
   */
  constructor(connection) {
    assert(connection);
    this._connection = connection;
  }

  get connection() {
    return this._connection;
  }

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(function (cursor) {
      return cursor.toArray();
    });
  }
};
export { AbstractStore as default };
//# sourceMappingURL=AbstractStore.js.map