import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { AbstractStore, AbstractConnection } from 'liwi-store';
import { BaseModel, Update, Criteria, Sort } from 'liwi-types';
import WebsocketCursor from './WebsocketCursor';
import Query from './Query';

const logger = new Logger('liwi:websocket-client');

export interface WebsocketConnection extends AbstractConnection {
  emit: (event: string, ...args: any[]) => Promise<any>;
  isConnected: () => boolean;
  isDisconnected: () => boolean;
  on: (event: string, listener: Function) => this;
  off: (event: string, listener: Function) => this;
}

export default class WebsocketStore<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractStore<
  Model,
  KeyPath,
  WebsocketConnection,
  WebsocketCursor<Model, KeyPath>
> {
  restName: string;

  constructor(
    websocket: WebsocketConnection,
    restName: string,
    keyPath: KeyPath,
  ) {
    super(websocket, keyPath);

    if (!restName) {
      throw new Error(`Invalid restName: "${restName}"`);
    }

    this.restName = restName;
  }

  createQuery(key: string): Query<Model, KeyPath> {
    logger.debug('createQuery', { key });
    return new Query(this, key);
  }

  emitSubscribe(type: string, ...args: Array<any>) {
    const emit = () => this.emit(type, ...args);
    const registerOnConnect = () => {
      this.connection.on('connect', emit);
      return () => this.connection.off('connect', emit);
    };

    if (this.connection.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  }

  insertOne(object: Model): Promise<Model> {
    return this.emit('insertOne', object);
  }

  replaceOne(object: Model): Promise<Model> {
    return this.emit('replaceOne', object);
  }

  upsertOne(object: Model): Promise<Model> {
    return this.emit('upsertOne', object);
  }

  partialUpdateByKey(key: any, partialUpdate: Update<Model>): Promise<Model> {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(
    object: Model,
    partialUpdate: Update<Model>,
  ): Promise<Model> {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(
    criteria: Criteria<Model>,
    partialUpdate: Update<Model>,
  ): Promise<void> {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key: any): Promise<void> {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object: Model): Promise<void> {
    return this.emit('deleteOne', object);
  }

  cursor(
    criteria?: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<WebsocketCursor<Model, KeyPath>> {
    return Promise.resolve(new WebsocketCursor(this, { criteria, sort }));
  }

  findByKey(key: any): Promise<Model | undefined> {
    return this.findOne({ [this.keyPath]: key });
  }

  findOne(
    criteria: Criteria<Model>,
    sort?: Sort<Model>,
  ): Promise<Model | undefined> {
    return this.emit('findOne', criteria, sort);
  }

  emit(type: string, ...args: Array<any>) {
    logger.debug('emit', { type, args });
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    return this.connection
      .emit('rest', {
        type,
        restName: this.restName,
        json: encode(args),
      })
      .then((result) => result && decode(result));
  }
}
