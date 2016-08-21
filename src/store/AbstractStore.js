import assert from 'assert';

export default class AbstractStore<Connection> {
    /**
     * @param {AbstractConnection} connection
     */
  constructor(connection: Connection) {
    assert(connection);
    this._connection = connection;
  }

  get connection(): Connection {
    return this._connection;
  }
}
