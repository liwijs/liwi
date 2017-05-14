import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';
import type { InsertType, UpdateType, ResultType } from '../types';

export default class RethinkStore extends AbstractStore<RethinkConnection> {
  tableName: string;
  keyPath = 'id';

  constructor(connection: RethinkConnection, tableName: string) {
    super(connection);
    this._tableName = tableName;
    this.r = this.connection._connection;
  }

  table() {
    return this.r.table(this._tableName);
  }

  createQuery(query) {
    return new Query(this, query);
  }

  query() {
    return this.table();
  }

  _query(criteria: ?Object, sort: ?Object) {
    const query = this.table();

    if (criteria) {
      query.filter(criteria);
    }

    if (sort) {
      Object.keys(sort).forEach((key) => {
        if (sort[key] === -1) {
          query.orderBy(this.r.desc(key));
        } else {
          query.orderBy(key);
        }
      });
    }

    return query;
  }

  create(): Promise<void> {
    return this.r.tableCreate(this._tableName).then(() => null);
  }

  insertOne(object: InsertType): Promise<ResultType> {
    if (!object.created) object.created = new Date();

    return this.table().insert(object)
      .then(({ inserted, generated_keys: generatedKeys }) => {
        if (inserted !== 1) throw new Error('Could not insert');
        if (object.id == null) {
          object.id = generatedKeys[0];
        }
      })
      .then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object: InsertType): Promise<ResultType> {
    if (!object.created) object.created = new Date();
    if (!object.updated) object.updated = new Date();

    return this.table().get(object.id).replace(object)
      .then(() => object);
  }

  upsertOne(object: UpdateType): Promise<ResultType> {
    if (!object.updated) object.updated = new Date();

    return this.table().insert(object, { conflict: 'replace' }).run()
      .then(() => object);
  }

  replaceSeveral(objects: Array<InsertType>): Promise<Array<ResultType>> {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  partialUpdateByKey(key: any, partialUpdate: Object): Promise<void> {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object: ResultType, partialUpdate: UpdateType): Promise<ResultType> {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true })
      .then(res => res.changes.new_val);
  }

  partialUpdateMany(criteria, partialUpdate: Object): Promise<void> {
    return this.table().filter(criteria).update(partialUpdate).run();
  }

  deleteByKey(key: any): Promise<void> {
    return this.table().get(key).delete().run();
  }

  cursor(query, sort: ?Object) { // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll(): Promise<void> {
    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key: any): Promise<?ResultType> {
    return this.table().get(key).run();
  }

  findOne(query): Promise<?ResultType> {
    return query.run({ cursor: true }).then(cursor => cursor.next().catch(err => null));
  }

  findValue(field: string, query): Promise<any> {
    return query
      .getField(field)
      .run({ cursor: true })
      .then(cursor => cursor.next().catch(err => null));
  }
}
