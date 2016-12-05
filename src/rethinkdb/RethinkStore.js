import RethinkConnection from './RethinkConnection';
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';

export default class RethinkStore<ModelType> extends AbstractStore<RethinkConnection> {
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

  create(): Promise {
    return this.r.tableCreate(this._tableName);
  }

  insertOne(object: ModelType): Promise<ModelType> {
    if (!object.created) {
      object.created = new Date();
    }

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

  replaceOne(object: ModelType): Promise<ModelType> {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.table().get(object.id).replace(object)
      .then(() => object);
  }

  upsertOne(object: ModelType): Promise<ModelType> {
    if (!object.updated) {
      object.updated = new Date();
    }

    return this.table().insert(object, { conflict: 'replace' }).run()
      .then(() => object);
  }

  replaceSeveral(objects: Array<ModelType>): Promise<Array<ModelType>> {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  partialUpdateByKey(key: any, partialUpdate: Object): Promise {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object: ModelType, partialUpdate: Object): Promise<ModelType> {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true })
      .then(res => res.changes.new_val);
  }

  partialUpdateMany(criteria, partialUpdate: Object): Promise {
    return this.table().filter(criteria).update(partialUpdate).run();
  }

  deleteByKey(key: any): Promise {
    return this.table().get(key).delete().run();
  }

  cursor(criteria: ?Object, sort: ?Object) { // : Promise<RethinkCursor<ModelType>> {
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll(): Promise {
    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key: any) {
    return this.table().get(key).run();
  }

  findOne(query): Promise<?Object> {
    return query.run({ cursor: true }).then(cursor => cursor.next().catch(err => null));
  }
}
