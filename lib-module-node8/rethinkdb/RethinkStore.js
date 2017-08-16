
import AbstractStore from '../store/AbstractStore';
import Query from './Query';
// import RethinkCursor from './RethinkCursor';
let RethinkStore = class extends AbstractStore {

  constructor(connection, tableName) {
    super(connection), this.keyPath = 'id', this._tableName = tableName, this.r = this.connection._connection;
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

  _query(criteria, sort) {
    const query = this.table();

    return criteria && query.filter(criteria), sort && Object.keys(sort).forEach(key => {
      sort[key] === -1 ? query.orderBy(this.r.desc(key)) : query.orderBy(key);
    }), query;
  }

  create() {
    return this.r.tableCreate(this._tableName).then(() => null);
  }

  insertOne(object) {

    return object.created || (object.created = new Date()), this.table().insert(object).then(({ inserted, generated_keys: generatedKeys }) => {
      if (inserted !== 1) throw new Error('Could not insert');
      object.id == null && (object.id = generatedKeys[0]);
    }).then(() => object);
  }

  updateOne(object) {
    return this.replaceOne(object);
  }

  replaceOne(object) {

    return object.created || (object.created = new Date()), object.updated || (object.updated = new Date()), this.table().get(object.id).replace(object).then(() => object);
  }

  upsertOne(object) {

    return object.updated || (object.updated = new Date()), this.table().insert(object, { conflict: 'replace' }).run().then(() => object);
  }

  replaceSeveral(objects) {
    return Promise.all(objects.map(object => this.replaceOne(object)));
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.table().get(key).update(partialUpdate).run();
  }

  partialUpdateOne(object, partialUpdate) {
    return this.table().get(object.id).update(partialUpdate, { returnChanges: true }).then(res => res.changes.new_val);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.table().filter(criteria).update(partialUpdate).run();
  }

  deleteByKey(key) {
    return this.table().get(key).delete().run();
  }

  cursor(query, sort) {
    // : Promise<RethinkCursor<ModelType>> {
    if (sort) throw new Error('sort is not supported');
    throw new Error('Not Supported yet, please use query().run({ cursor: true })');
  }

  findAll() {
    throw new Error('Not supported, please use query().run()');
  }

  findByKey(key) {
    return this.table().get(key).run();
  }

  findOne(query) {
    return query.run({ cursor: true }).then(cursor => cursor.next().catch(() => null));
  }

  findValue(field, query) {
    return query.getField(field).run({ cursor: true }).then(cursor => cursor.next().catch(() => null));
  }
};
export { RethinkStore as default };
//# sourceMappingURL=RethinkStore.js.map