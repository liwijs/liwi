'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint-disable no-await-in-loop */

class AbstractCursor {

  constructor(store) {
    _assert(store, _tcombForked2.default.Any, 'store');

    this._store = store;
  }

  get store() {
    return _assert(function () {
      return this._store;
    }.apply(this, arguments), _tcombForked2.default.Any, 'return value');
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    return _assert(function () {
      throw new Error('next() missing implementation');
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  nextResult() {
    return _assert(function () {
      return this.next().then(() => this.result());
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  limit() {
    return _assert(function () {
      throw new Error('limit() missing implementation');
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  count(applyLimit = false) {
    _assert(applyLimit, _tcombForked2.default.Boolean, 'applyLimit');

    throw new Error('count() missing implementation');
  }

  result() {
    return _assert(function () {
      return this.store.findByKey(this.key);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  delete() {
    return _assert(function () {
      return this.store.deleteByKey(this.key);
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  forEachKeys(callback) {
    _assert(callback, _tcombForked2.default.Function, 'callback');

    return _assert(_asyncToGenerator(function* () {
      while (true) {
        const key = yield this.next();
        if (!key) return;

        yield callback(key);
      }
    }).apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  forEach(callback) {
    return _assert(function () {
      return this.forEachKeys(() => this.result().then(result => callback(result)));
    }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    // eslint-disable-next-line no-restricted-syntax
    for (let keyPromise of this.keysIterator()) {
      yield keyPromise.then(key => key && this.result());
    }
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
}
exports.default = AbstractCursor;

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractCursor.js.map