import Logger from 'nightingale-logger/src';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../extended-json';
import Query from './Query';

const logger = new Logger('liwi:websocket-client');

type WebsocketConnectionType = {
    emit: Function,
    isConnected: Function,
};

export default class WebsocketStore<ModelType> extends AbstractStore<WebsocketConnectionType> {
  keyPath = 'id';

  constructor(websocket: WebsocketConnectionType, restName: string) {
    super(websocket);

    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key: string) {
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
      json: encode(args),
    }).then(result => result && decode(result));
  }

  emitSubscribe(type, ...args) {
    const emit = () => this.emit(type, ...args);
    return emit().then(result => {
      this.connection.on('reconnect', emit);
      return () => this.connection.off('reconnect', emit);
    });
  }

  insertOne(object: ModelType): Promise<ModelType> {
    return this.emit('insertOne', object);
  }

  updateOne(object: ModelType): Promise<ModelType> {
    return this.emit('updateOne', object);
  }

  updateSeveral(objects: Array<ModelType>): Promise<Array<ModelType>> {
    return this.emit('updateSeveral', objects);
  }

  partialUpdateByKey(key: any, partialUpdate: Object): Promise<ModelType> {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object: ModelType, partialUpdate: Object): Promise<ModelType> {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate: Object): Promise<void> {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key: any): Promise<void> {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object: ModelType): Promise<void> {
    return this.emit('deleteOne', object);
  }

  cursor(criteria: ?Object, sort: ?Object): Promise<WebsocketCursor<ModelType>> {
    return Promise.resolve(new WebsocketCursor(this, { criteria, sort }));
  }

  findByKey(key: any) {
    return this.findOne({ id: key });
  }

  findOne(criteria: Object, sort: ?Object): Promise<Object> {
    return this.emit('findOne', criteria, sort);
  }
}
