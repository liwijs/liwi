import assert from 'assert';

export default class AbstractStore {
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
}
//# sourceMappingURL=AbstractStore.js.map