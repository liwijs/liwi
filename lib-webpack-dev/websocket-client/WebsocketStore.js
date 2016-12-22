var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _t from 'tcomb-forked';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Logger from 'nightingale-logger';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../msgpack';
import Query from './Query';

var logger = new Logger('liwi:websocket-client');

var WebsocketConnection = _t.interface({
  emit: _t.Function,
  isConnected: _t.Function
}, 'WebsocketConnection');

var WebsocketStore = function (_AbstractStore) {
  _inherits(WebsocketStore, _AbstractStore);

  function WebsocketStore(websocket, restName) {
    _assert(websocket, WebsocketConnection, 'websocket');

    _assert(restName, _t.String, 'restName');

    _classCallCheck(this, WebsocketStore);

    var _this = _possibleConstructorReturn(this, (WebsocketStore.__proto__ || Object.getPrototypeOf(WebsocketStore)).call(this, websocket));

    _this.keyPath = 'id';


    if (!restName) {
      throw new Error('Invalid restName: "' + restName + '"');
    }

    _this.restName = restName;
    return _this;
  }

  _createClass(WebsocketStore, [{
    key: 'createQuery',
    value: function createQuery(key) {
      _assert(key, _t.String, 'key');

      logger.debug('createQuery', { key: key });
      return new Query(this, key);
    }
  }, {
    key: 'emit',
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      logger.debug('emit', { type: type, args: args });
      if (this.connection.isDisconnected()) {
        throw new Error('Websocket is not connected');
      }

      return this.connection.emit('rest', {
        type: type,
        restName: this.restName,
        buffer: args && encode(args.map(function (arg) {
          return arg === undefined ? null : arg;
        })).toString()
      }).then(function (result) {
        return result && decode(result);
      });
    }
  }, {
    key: 'emitSubscribe',
    value: function emitSubscribe(type) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var emit = function emit() {
        return _this2.emit.apply(_this2, [type].concat(args));
      };
      return emit().then(function () {
        _this2.connection.on('reconnect', emit);
        return function () {
          return _this2.connection.off('reconnect', emit);
        };
      });
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      _assert(object, _t.Any, 'object');

      return _assert(function () {
        return this.emit('insertOne', object);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      _assert(object, _t.Any, 'object');

      return _assert(function () {
        return this.emit('updateOne', object);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'updateSeveral',
    value: function updateSeveral(objects) {
      _assert(objects, _t.list(_t.Any), 'objects');

      return _assert(function () {
        return this.emit('updateSeveral', objects);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      _assert(key, _t.Any, 'key');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.emit('partialUpdateByKey', key, partialUpdate);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      _assert(object, _t.Any, 'object');

      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.emit('partialUpdateOne', object, partialUpdate);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      _assert(partialUpdate, _t.Object, 'partialUpdate');

      return _assert(function () {
        return this.emit('partialUpdateMany', criteria, partialUpdate);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      _assert(key, _t.Any, 'key');

      return _assert(function () {
        return this.emit('deleteByKey', key);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'deleteOne',
    value: function deleteOne(object) {
      _assert(object, _t.Any, 'object');

      return _assert(function () {
        return this.emit('deleteOne', object);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      _assert(criteria, _t.maybe(_t.Object), 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      return _assert(function () {
        return Promise.resolve(new WebsocketCursor(this, { criteria: criteria, sort: sort }));
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      _assert(key, _t.Any, 'key');

      return this.findOne({ id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      _assert(criteria, _t.Object, 'criteria');

      _assert(sort, _t.maybe(_t.Object), 'sort');

      return _assert(function () {
        return this.emit('findOne', criteria, sort);
      }.apply(this, arguments), _t.Promise, 'return value');
    }
  }]);

  return WebsocketStore;
}(AbstractStore);

export default WebsocketStore;

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
//# sourceMappingURL=WebsocketStore.js.map