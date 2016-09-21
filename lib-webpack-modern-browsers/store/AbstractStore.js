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

  findAll(criteria, sort) {
    return this.cursor(criteria, sort).then(cursor => cursor.toArray());
  }
}
//# sourceMappingURL=AbstractStore.js.map