var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';

var WebsocketConnection = function () {
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

var WebsocketStore = function (_AbstractStore) {
  _inherits(WebsocketStore, _AbstractStore);

  function WebsocketStore(websocket, restName) {
    _classCallCheck(this, WebsocketStore);

    if (!WebsocketConnection(websocket)) {
      throw new TypeError('Value of argument "websocket" violates contract.\n\nExpected:\nWebsocketConnection\n\nGot:\n' + _inspect(websocket));
    }

    if (!(typeof restName === 'string')) {
      throw new TypeError('Value of argument "restName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(restName));
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebsocketStore).call(this, websocket));

    _this.keyPath = '_id';


    if (!restName) {
      throw new Error('Invalid restName: "' + restName + '"');
    }

    _this.restName = restName;
    return _this;
  }

  _createClass(WebsocketStore, [{
    key: 'emit',
    value: function emit(type) {
      if (!this.connection.isConnected()) {
        throw new Error('Websocket is not connected');
      }

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return this.connection.emit('rest', { type: type, restName: this.restName }, args);
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      function _ref(_id) {
        if (!(_id instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id));
        }

        return _id;
      }

      return _ref(this.emit('insertOne', object));
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      function _ref2(_id2) {
        if (!(_id2 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise<ModelType>\n\nGot:\n' + _inspect(_id2));
        }

        return _id2;
      }

      return _ref2(this.emit('updateOne', object));
    }
  }, {
    key: 'updateSeveral',
    value: function updateSeveral(objects) {
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
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
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
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
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
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
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
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      function _ref7(_id7) {
        if (!(_id7 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id7));
        }

        return _id7;
      }

      return _ref7(this.emit('deleteByKey', key));
    }
  }, {
    key: 'deleteOne',
    value: function deleteOne(object) {
      function _ref8(_id8) {
        if (!(_id8 instanceof Promise)) {
          throw new TypeError('Function return value violates contract.\n\nExpected:\nPromise\n\nGot:\n' + _inspect(_id8));
        }

        return _id8;
      }

      return _ref8(this.emit('deleteOne', object));
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
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

      return _ref9(Promise.resolve(new WebsocketCursor(this, { criteria: criteria, sort: sort })));
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      return this.findOne({ _id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
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
  }]);

  return WebsocketStore;
}(AbstractStore);

export default WebsocketStore;

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
    return typeof input === 'undefined' ? 'undefined' : _typeof(input);
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      var _ret = function () {
        if (depth > maxDepth) return {
            v: '[...]'
          };

        var first = _inspect(input[0], depth);

        if (input.every(function (item) {
          return _inspect(item, depth) === first;
        })) {
          return {
            v: first.trim() + '[]'
          };
        } else {
          return {
            v: '[' + input.slice(0, maxKeys).map(function (item) {
              return _inspect(item, depth);
            }).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
          };
        }
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
    var entries = keys.slice(0, maxKeys).map(function (key) {
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