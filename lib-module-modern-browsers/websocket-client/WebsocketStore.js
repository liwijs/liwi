import Logger from 'nightingale-logger';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../extended-json';
import Query from './Query';

const logger = new Logger('liwi:websocket-client');

let WebsocketStore = class extends AbstractStore {

  constructor(websocket, restName) {
    super(websocket);

    this.keyPath = 'id';
    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    logger.debug('createQuery', { key });
    return new Query(this, key);
  }

  emit(type, ...args) {
    logger.debug('emit', { type, args });
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      json: encode(args)
    }).then(function (result) {
      return result && decode(result);
    });
  }

  emitSubscribe(type, ...args) {
    var _this = this;

    const emit = function emit() {
      return _this.emit(type, ...args);
    };
    return emit().then(function () {
      _this.connection.on('reconnect', emit);
      return function () {
        return _this.connection.off('reconnect', emit);
      };
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
};
export { WebsocketStore as default };
//# sourceMappingURL=WebsocketStore.js.map