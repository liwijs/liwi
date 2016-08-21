import Cursor from 'mongodb/lib/cursor';
import MongoStore from './MongoStore';
import AbstractCursor from '../store/AbstractCursor';

export default class MongoCursor extends AbstractCursor {
  constructor(store, cursor) {
    if (!(store instanceof MongoStore)) {
      throw new TypeError('Value of argument "store" violates contract.\n\nExpected:\nMongoStore\n\nGot:\n' + _inspect(store));
    }

    if (!(cursor instanceof Cursor)) {
      throw new TypeError('Value of argument "cursor" violates contract.\n\nExpected:\nCursor\n\nGot:\n' + _inspect(cursor));
    }

    super(store);
    this._cursor = cursor;
  }

  advance(count) {
    if (!(typeof count === 'number')) {
      throw new TypeError('Value of argument "count" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(count));
    }

    this._cursor.skip(count);
  }

  next() {
    function _ref2(_id2) {
      if (!(_id2 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<any>\n\nGot:\n' + _inspect(_id2));
      }

      return _id2;
    }

    return _ref2(this._cursor.next().then(value => {
      this._result = value;
      this.key = value && value._id;
      return this.key;
    }));
  }

  limit(newLimit) {
    function _ref3(_id3) {
      if (!(_id3 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id3));
      }

      return _id3;
    }

    if (!(typeof newLimit === 'number')) {
      throw new TypeError('Value of argument "newLimit" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(newLimit));
    }

    this._cursor.limit(newLimit);
    return _ref3(Promise.resolve(this));
  }

  count() {
    var applyLimit = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    if (!(typeof applyLimit === 'boolean')) {
      throw new TypeError('Value of argument "applyLimit" violates contract.\n\nExpected:\nbool\n\nGot:\n' + _inspect(applyLimit));
    }

    return this._cursor.count(applyLimit);
  }

  result() {
    return Promise.resolve(this._result);
  }

  close() {
    if (this._cursor) {
      this._cursor.close();
      this._cursor = this._store = this._result = undefined;
    }

    return Promise.resolve();
  }

  toArray() {
    function _ref4(_id4) {
      if (!(_id4 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array>\n\nGot:\n' + _inspect(_id4));
      }

      return _id4;
    }

    return _ref4(this._cursor.toArray());
  }
}

function _inspect(input, depth) {
  var maxDepth = 4;
  var maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(item => _inspect(item, depth) === first)) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if (typeof _ret === "object") return _ret.v;
    } else {
      return 'Array';
    }
  } else {
    var keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    var indent = '  '.repeat(depth - 1);
    var entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}
//# sourceMappingURL=MongoCursor.js.map