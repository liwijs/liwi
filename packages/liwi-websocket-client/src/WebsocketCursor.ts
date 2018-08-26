import { AbstractCursor } from 'liwi-store';
import { BaseModel, Criteria, Sort } from 'liwi-types';
import WebsocketStore from './WebsocketStore';

export interface Options<Model extends BaseModel> {
  criteria?: Criteria<Model>;
  sort?: Sort<Model>;
  limit?: number;
}

export default class WebsocketCursor<
  Model extends BaseModel,
  KeyPath extends string
> extends AbstractCursor<Model, KeyPath, WebsocketStore<Model, any>> {
  _idCursor?: number;

  private options: Options<Model>;

  private _result?: Model;

  constructor(store: WebsocketStore<Model, any>, options: Options<Model>) {
    super(store);
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
    return this.store.connection
      .emit('createCursor', this.options)
      .then((idCursor: number) => {
        if (!idCursor) return;
        this._idCursor = idCursor;
      });
  }

  emit(type: string, ...args: Array<any>): Promise<any> {
    if (!this._idCursor) {
      return this._create().then(() => this.emit(type, ...args));
    }

    return this.store.emit('cursor', { type, id: this._idCursor }, args);
  }

  advance(count: number) {
    this.emit('advance', count);
    return this;
  }

  next(): Promise<any> {
    return this.emit('next').then((result) => {
      this._result = result;
      this.key = result && result[this._store.keyPath];
      return this.key;
    });
  }

  result(): Promise<Model> {
    if (!this._result) throw new Error('Cannot call result() before next()');
    return Promise.resolve(this._result);
  }

  count(applyLimit: boolean = false) {
    return this.emit('count', applyLimit);
  }

  close(): Promise<void> {
    if (!this._store) return Promise.resolve();

    const closedPromise = this._idCursor
      ? this.emit('close')
      : Promise.resolve();
    this._idCursor = undefined;
    this._result = undefined;
    return closedPromise;
  }

  toArray(): Promise<Array<Model>> {
    return this.store.emit('cursor toArray', this.options).then((result) => {
      this.close();
      return result;
    });
  }
}
