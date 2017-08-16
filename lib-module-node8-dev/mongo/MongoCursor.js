import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';
import { ResultType as _ResultType } from '../types';

import t from 'flow-runtime';
const ResultType = t.tdz(() => _ResultType);
let MongoCursor = class extends AbstractCursor {
  constructor(store, cursor) {
    let _storeType = t.ref(MongoStore);

    let _cursorType = t.ref(Cursor);

    t.param('store', _storeType).assert(store), t.param('cursor', _cursorType).assert(cursor), super(store), t.bindTypeParameters(this, t.ref(MongoStore)), this._cursor = cursor;
  }

  advance(count) {
    let _countType = t.number();

    t.return(t.void());
    t.param('count', _countType).assert(count), this._cursor.skip(count);
  }

  next() {
    const _returnType2 = t.return(t.any());

    return this._cursor.next().then(value => (this._result = value, this.key = value && value._id, this.key)).then(_arg => _returnType2.assert(_arg));
  }

  limit(newLimit) {
    let _newLimitType = t.number();

    const _returnType3 = t.return(t.ref('Promise'));

    return t.param('newLimit', _newLimitType).assert(newLimit), this._cursor.limit(newLimit), _returnType3.assert(Promise.resolve(this));
  }

  count(applyLimit = false) {
    let _applyLimitType = t.boolean();

    return t.param('applyLimit', _applyLimitType).assert(applyLimit), this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {

    return this._cursor && (this._cursor.close(), this._cursor = void 0, this._store = void 0, this._result = void 0), Promise.resolve();
  }

  toArray() {
    const _returnType4 = t.return(t.array(t.ref(ResultType)));

    return this._cursor.toArray().then(_arg2 => _returnType4.assert(_arg2));
  }
};
export { MongoCursor as default };
//# sourceMappingURL=MongoCursor.js.map