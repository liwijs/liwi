'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _class, _temp; /* eslint-disable no-await-in-loop */


var _types = require('../types');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

const ResultType = _flowRuntime2.default.tdz(() => _types.ResultType);

const _AbstractCursorTypeParametersSymbol = Symbol('AbstractCursorTypeParameters');

let AbstractCursor = (_temp = _class = class {

  constructor(store) {
    this[_AbstractCursorTypeParametersSymbol] = {
      Store: _flowRuntime2.default.typeParameter('Store')
    };

    let _storeType = _flowRuntime2.default.flowInto(this[_AbstractCursorTypeParametersSymbol].Store);

    _flowRuntime2.default.param('store', _storeType).assert(store), this._store = store;
  }

  get store() {
    const _returnType2 = _flowRuntime2.default.return(this[_AbstractCursorTypeParametersSymbol].Store);

    return _returnType2.assert(this._store);
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    _flowRuntime2.default.return(_flowRuntime2.default.any());

    throw new Error('next() missing implementation');
  }

  nextResult() {
    const _returnType4 = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return this.next().then(() => this.result()).then(_arg => _returnType4.assert(_arg));
  }

  limit(newLimit) {
    let _newLimitType = _flowRuntime2.default.number();

    _flowRuntime2.default.return(_flowRuntime2.default.void());

    throw _flowRuntime2.default.param('newLimit', _newLimitType).assert(newLimit), new Error('limit() missing implementation');
  }

  count(applyLimit = false) {
    let _applyLimitType = _flowRuntime2.default.boolean();

    throw _flowRuntime2.default.param('applyLimit', _applyLimitType).assert(applyLimit), new Error('count() missing implementation');
  }

  result() {
    const _returnType6 = _flowRuntime2.default.return(_flowRuntime2.default.ref(ResultType));

    return this.store.findByKey(this.key).then(_arg2 => _returnType6.assert(_arg2));
  }

  delete() {
    const _returnType7 = _flowRuntime2.default.return(_flowRuntime2.default.void());

    return this.store.deleteByKey(this.key).then(_arg3 => _returnType7.assert(_arg3));
  }

  forEachKeys(callback) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let _callbackType = _flowRuntime2.default.function();

      const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.union(_flowRuntime2.default.void(), _flowRuntime2.default.ref('Promise', _flowRuntime2.default.void())));

      for (_flowRuntime2.default.param('callback', _callbackType).assert(callback);;) {
        const key = yield _this.next();
        if (!key) return _returnType.assert();

        yield callback(key);
      }
    })();
  }

  forEach(callback) {
    const _returnType8 = _flowRuntime2.default.return(_flowRuntime2.default.void());

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
}, _class[_flowRuntime2.default.TypeParametersSymbol] = _AbstractCursorTypeParametersSymbol, _temp);
exports.default = AbstractCursor;
//# sourceMappingURL=AbstractCursor.js.map