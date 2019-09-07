/* eslint-disable max-classes-per-file */
import { BaseModel, QueryOptions } from 'liwi-types';
import { AbstractClient } from 'liwi-resources-client';

type UnsubscribeEmitOnConnectCallback = () => void;

export class VoidClient<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractClient<Model, KeyPath> {
  emitSubscribe(
    type: string,
    args: any[],
  ): Promise<UnsubscribeEmitOnConnectCallback> {
    throw new Error('Void client: emitSubscribe should not be called');
  }

  createCursor(options: QueryOptions<Model>): Promise<number> {
    throw new Error('Void client: createCursor should not be called');
  }

  send(type: string, value: any[]): Promise<any> {
    throw new Error('Void client: send should not be called');
  }

  on(event: string, handler: Function) {
    throw new Error('Void client: on should not be called');
  }

  off(event: string, handler: Function) {
    throw new Error('Void client: off should not be called');
  }
}

export function createMongoResourcesVoidClient() {
  return class WebsocketResourcesClient<
    Model extends BaseModel
  > extends VoidClient<Model, '_id'> {
    constructor(resourceName: string) {
      super(resourceName, '_id');
    }
  };
}
