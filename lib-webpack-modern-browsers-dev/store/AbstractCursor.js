import _t from 'tcomb-forked';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

export default class AbstractCursor {

  constructor(store) {
    _assert(store, _t.Any, 'store');

    this._store = store;
  }

  get store() {
    return _assert(function () {
      return this._store;
    }.apply(this, arguments), _t.Any, 'return value');
  }

  close() {
    throw new Error('close() missing implementation');
  }

  next() {
    return _assert(function () {
      throw new Error('next() missing implementation');
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  nextResult() {
    return _assert(function () {
      var _this = this;

      return this.next().then(function () {
        return _this.result();
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  limit() {
    return _assert(function () {
      throw new Error('limit() missing implementation');
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  count(applyLimit = false) {
    _assert(applyLimit, _t.Boolean, 'applyLimit');

    throw new Error('count() missing implementation');
  }

  result() {
    return _assert(function () {
      return this.store.findByKey(this.key);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  delete() {
    return _assert(function () {
      return this.store.deleteByKey(this.key);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  forEachKeys(callback) {
    _assert(callback, _t.Function, 'callback');

    return _assert(_asyncToGenerator(function* () {
      while (true) {
        var key = yield this.next();
        if (!key) return;

        yield callback(key);
      }
    }).apply(this, arguments), _t.Promise, 'return value');
  }

  forEach(callback) {
    return _assert(function () {
      var _this2 = this;

      return this.forEachKeys(function () {
        return _this2.result().then(function (result) {
          return callback(result);
        });
      });
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  *keysIterator() {
    while (true) {
      yield this.next();
    }
  }

  *[Symbol.iterator]() {
    var _this3 = this;

    // eslint-disable-next-line no-restricted-syntax
    for (var keyPromise of this.keysIterator()) {
      yield keyPromise.then(function (key) {
        return key && _this3.result();
      });
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

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AbstractCursor.js.map