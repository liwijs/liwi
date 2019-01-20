import { AbstractCursor } from 'liwi-store';
import { BaseModel, QueryOptions } from 'liwi-types';
import AbstractClient from './AbstractClient';

export default class ClientCursor<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractCursor<Model, KeyPath, AbstractClient<Model, KeyPath>> {
  _idCursor?: number;

  private options: QueryOptions<Model>;

  private _result?: Model;

  constructor(
    client: AbstractClient<Model, KeyPath>,
    options: QueryOptions<Model>,
  ) {
    super(client);
    this.options = options;
  }

  /* options */

  limit(newLimit: number): Promise<this> {
    if (this._idCursor) throw new Error('Cursor already created');
    this.options.limit = newLimit;
    return Promise.resolve(this);
  }

  /* results */

  _create() {
    if (this._idCursor) throw new Error('Cursor already created');
    return super.store.createCursor(this.options).then((idCursor: number) => {
      if (!idCursor) return;
      this._idCursor = idCursor;
    });
  }

  emit(type: string, ...args: Array<any>): Promise<any> {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return super.store.send('cursor', { type, id: this._idCursor }, args);
  }

  advance(count: number) {
    this.emit('advance', count);
    return this;
  }

  async next(): Promise<any> {
    const result = await this.emit('next');
    this._result = result;
    super.key = result && result[super.store.keyPath];
    return super.key;
  }

  result(): Promise<Model> {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  count(applyLimit: boolean = false) {
    return this.emit('count', applyLimit);
  }

  close(): Promise<void> {
    if (!super.store) return Promise.resolve();

    const closedPromise = this._idCursor
      ? this.emit('close')
      : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray(): Promise<Array<Model>> {
    if (this._idCursor) throw new Error('Cursor created, cannot call toArray');
    return super.store.send('cursor toArray', this.options);
  }
}
