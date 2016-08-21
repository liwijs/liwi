'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _WebsocketCursor = require('./WebsocketCursor');

var _WebsocketCursor2 = _interopRequireDefault(_WebsocketCursor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WebsocketConnection = function () {
  function WebsocketConnection(input) {
    return input != null && typeof input.emit === 'function' && typeof input.isConnected === 'function';
  }

  ;
  Object.defineProperty(WebsocketConnection, Symbol.hasInstance, {
    value: function value(input) {
      return WebsocketConnection(input);
    }
  });
  return WebsocketConnection;
}();

class WebsocketStore extends _AbstractStore2.default {

  constructor(websocket, restName) {
    if (!WebsocketConnection(websocket)) {
      throw new TypeError('Value of argument "websocket" violates contract.\n\nExpected:\nWebsocketConnection\n\nGot:\n' + _inspect(websocket));
    }

    if (!(typeof restName === 'string')) {
      throw new TypeError('Value of argument "restName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(restName));
    }

    super(websocket);

    this.keyPath = '_id';
    if (!restName) {
      throw new Error(`Invalid restName: "${ restName }"`);
    }

    this.restName = restName;
  }

  emit(type) {
    if (!this.connection.isConnected()) {
      throw new Error('Websocket is not connected');
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.connection.emit('rest', { type, restName: this.restName }, args);
  }

  insertOne(object) {
    function _ref(_id) {
      if (!(_id instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id));
      }

      return _id;
    }

    return _ref(this.emit('insertOne', object));
  }

  updateOne(object) {
    function _ref2(_id2) {
      if (!(_id2 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id2));
      }

      return _id2;
    }

    return _ref2(this.emit('updateOne', object));
  }

  updateSeveral(objects) {
    function _ref3(_id3) {
      if (!(_id3 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Array<ModelType>>\n\nGot:\n' + _inspect(_id3));
      }

      return _id3;
    }

    if (!Array.isArray(objects)) {
      throw new TypeError('Value of argument "objects" violates contract.\n\nExpected:\nArray<ModelType>\n\nGot:\n' + _inspect(objects));
    }

    return _ref3(this.emit('updateSeveral', objects));
  }

  partialUpdateByKey(key, partialUpdate) {
    function _ref4(_id4) {
      if (!(_id4 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id4));
      }

      return _id4;
    }

    if (!(partialUpdate instanceof Object)) {
      throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
    }

    return _ref4(this.emit('partialUpdateByKey', key, partialUpdate));
  }

  partialUpdateOne(object, partialUpdate) {
    function _ref5(_id5) {
      if (!(_id5 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id5));
      }

      return _id5;
    }

    if (!(partialUpdate instanceof Object)) {
      throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
    }

    return _ref5(this.emit('partialUpdateOne', object, partialUpdate));
  }

  partialUpdateMany(criteria, partialUpdate) {
    function _ref6(_id6) {
      if (!(_id6 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id6));
      }

      return _id6;
    }

    if (!(partialUpdate instanceof Object)) {
      throw new TypeError('Value of argument "partialUpdate" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(partialUpdate));
    }

    return _ref6(this.emit('partialUpdateMany', criteria, partialUpdate));
  }

  deleteByKey(key) {
    function _ref7(_id7) {
      if (!(_id7 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id7));
      }

      return _id7;
    }

    return _ref7(this.emit('deleteByKey', key));
  }

  deleteOne(object) {
    function _ref8(_id8) {
      if (!(_id8 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
      }

      return _id8;
    }

    return _ref8(this.emit('deleteOne', object));
  }

  cursor(criteria, sort) {
    function _ref9(_id9) {
      if (!(_id9 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<WebsocketCursor<ModelType>>\n\nGot:\n' + _inspect(_id9));
      }

      return _id9;
    }

    if (!(criteria == null || criteria instanceof Object)) {
      throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(criteria));
    }

    if (!(sort == null || sort instanceof Object)) {
      throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
    }

    return _ref9(Promise.resolve(new _WebsocketCursor2.default(this, { criteria, sort })));
  }

  findByKey(key) {
    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    function _ref10(_id10) {
      if (!(_id10 instanceof Promise)) {
        throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<Object>\n\nGot:\n' + _inspect(_id10));
      }

      return _id10;
    }

    if (!(criteria instanceof Object)) {
      throw new TypeError('Value of argument "criteria" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(criteria));
    }

    if (!(sort == null || sort instanceof Object)) {
      throw new TypeError('Value of argument "sort" violates contract.\n\nExpected:\n?Object\n\nGot:\n' + _inspect(sort));
    }

    return _ref10(this.emit('findOne', criteria, sort));
  }
}
exports.default = WebsocketStore;

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

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
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
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
//# sourceMappingURL=WebsocketStore.js.map