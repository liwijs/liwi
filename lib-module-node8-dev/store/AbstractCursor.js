var _class, _temp;

/* eslint-disable no-await-in-loop */
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(() => _ResultType);

const _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

let AbstractCursor = (_temp = _class = class {

  constructor(store) {
    this[_AbstractCursorTypeParametersSymbol] = {
      Store: t.typeParameter('Store')
    };

    let _storeType = t.flowInto(this[_AbstractCursorTypeParametersSymbol].Store);

    t.param('store', _storeType).assert(store), this._store = store;
  }

  get store() {
    const _returnType2 = t.return(this[_AbstractCursorTypeParametersSymbol].Store);

    return _returnType2.assert(this._store);
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    t.return(t.any());

    throw new Error('next() missing implementation');
  }

  nextResult() {
    const _returnType4 = t.return(t.any());

    return this.next().then(() => this.result()).then(_arg => _returnType4.assert(_arg));
  }

  limit(newLimit) {
    let _newLimitType = t.number();

    t.return(t.void());

    throw t.param('newLimit', _newLimitType).assert(newLimit), new Error('limit() missing implementation');
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    throw t.param('applyLimit', _applyLimitType).assert(applyLimit), new Error('count() missing implementation');
  }

  result() {
    const _returnType6 = t.return(t.ref(ResultType));

    return this.store.findByKey(this.key).then(_arg2 => _returnType6.assert(_arg2));
  }

  delete() {
    const _returnType7 = t.return(t.void());

    return this.store.deleteByKey(this.key).then(_arg3 => _returnType7.assert(_arg3));
  }

  async forEachKeys(callback) {
    let _callbackType = t.function();

    const _returnType = t.return(t.union(t.void(), t.ref('Promise', t.void())));

    for (t.param('callback', _callbackType).assert(callback);;) {
      const key = await this.next();
      if (!key) return _returnType.assert();

      await callback(key);
    }
  }

  forEach(callback) {
    const _returnType8 = t.return(t.void());

    return this.forEachKeys(() => this.result().then(result => callback(result))).then(_arg4 => _returnType8.assert(_arg4));
  }

  *keysIterator() {
    for (;;) yield this.next();
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (let keyPromise of this.keysIterator()) yield keyPromise.then(key => key && this.result());
  }

  // TODO Symbol.asyncIterator, https://phabricator.babeljs.io/T7356
  /*
    async *keysAsyncIterator() {
        while (true) {
             const key = await this.next();
             if (!key) return;
              yield key;
        }
     }
      async *[Symbol.asyncIterator] {
        for await (let key of this.keysAsyncIterator()) {
            yield await this.result();
        }
     }
     */
}, _class[t.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp);
export { AbstractCursor as default };
//# sourceMappingURL=AbstractCursor.js.map