var _class, _temp;

// eslint-disable-next-line no-unused-vars
import AbstractStore from './AbstractStore';

import t from 'flow-runtime';

const _AbstractQueryTypeParametersSymbol = Symbol('AbstractQueryTypeParameters');

let AbstractQuery = (_temp = _class = class {

  constructor(store, queryCallback) {
    this[_AbstractQueryTypeParametersSymbol] = {
      Store: t.typeParameter('Store', t.ref(AbstractStore))
    };

    this.store = store;
    this.queryCallback = queryCallback;
  }

  fetchAndSubscribe(callback, ...args) {
    let _callbackType = t.function();

    t.param('callback', _callbackType).assert(callback);

    return this._subscribe(callback, true, args);
  }

  subscribe(callback, ...args) {
    let _callbackType2 = t.function();

    t.param('callback', _callbackType2).assert(callback);

    return this._subscribe(callback, false, args);
  }
}, _class[t.TypeParametersSymbol] = _AbstractQueryTypeParametersSymbol, _temp);
export { AbstractQuery as default };
//# sourceMappingURL=AbstractQuery.js.map