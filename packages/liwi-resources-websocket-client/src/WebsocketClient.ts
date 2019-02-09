import Logger from 'nightingale-logger';
import { encode, decode } from 'extended-json';
import { BaseModel, QueryOptions } from 'liwi-types';
import { AbstractClient } from 'liwi-resources-client';

const logger = new Logger('liwi:resources-websocket-client');

export interface Websocket {
  emit: (event: string, ...args: any[]) => Promise<any>;
  isConnected: () => boolean;
  isDisconnected: () => boolean;
  on: <T extends Function>(event: string, handler: T) => T;
  off: (event: string, handler: Function) => void;
}

type UnsubscribeCallback = () => void;

export default class WebsocketClient<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractClient<Model, KeyPath> {
  readonly resourceName: string;

  private readonly websocket: Websocket;

  // eslint-disable-next-line typescript/member-ordering
  constructor(websocket: Websocket, resourceName: string, keyPath: KeyPath) {
    super(resourceName, keyPath);
    this.websocket = websocket;
    this.resourceName = resourceName;
  }

  emitSubscribe(type: string, args: any[]): Promise<UnsubscribeCallback> {
    const websocket = this.websocket;
    const emit = () => this.send(type, args);
    const registerOnConnect = () => {
      websocket.on('connect', emit);
      return () => {
        websocket.off('connect', emit);
      };
    };

    if (websocket.isConnected()) {
      return emit().then(registerOnConnect);
    }

    return Promise.resolve(registerOnConnect());
  }

  createCursor(options: QueryOptions<Model>): Promise<number> {
    return this.websocket.emit('createCursor', options);
  }

  send(type: string, value: any[]) {
    logger.debug('emit', { type, value });
    if (this.websocket.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    if (!this.resourceName) {
      throw new Error('Invalid resourceName');
    }

    return this.websocket
      .emit('resource', {
        type,
        resourceName: this.resourceName,
        json: encode(value),
      })
      .then((result: any) => result && decode(result));
  }

  on(event: string, handler: Function) {
    this.websocket.on(event, handler);
    return handler;
  }

  off(event: string, handler: Function) {
    this.websocket.off(event, handler);
  }
}
