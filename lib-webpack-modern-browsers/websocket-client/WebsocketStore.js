import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../msgpack';
import Query from './Query';

export default class WebsocketStore extends AbstractStore {

  constructor(websocket, restName) {
    super(websocket);

    this.keyPath = 'id';
    if (!restName) {
      throw new Error(`Invalid restName: "${ restName }"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    return new Query(this, key);
  }

  emit(type) {
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      buffer: args && encode(args)
    }).then(result => result && decode(result));
  }

  emitSubscribe(type) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var emit = () => this.emit(type, ...args);
    return emit().then(result => {
      this.connection.on('reconnect', emit);
      return () => this.connection.off('reconnect', emit);
    });
  }

  insertOne(object) {
    return this.emit('insertOne', object);
  }

  updateOne(object) {
    return this.emit('updateOne', object);
  }

  updateSeveral(objects) {
    return this.emit('updateSeveral', objects);
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object, partialUpdate) {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key) {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object) {
    return this.emit('deleteOne', object);
  }

  cursor(criteria, sort) {
    return Promise.resolve(new WebsocketCursor(this, { criteria, sort }));
  }

  findByKey(key) {
    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }
}
//# sourceMappingURL=WebsocketStore.js.map