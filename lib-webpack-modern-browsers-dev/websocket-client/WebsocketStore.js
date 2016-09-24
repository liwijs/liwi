import _t from 'tcomb-forked';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../msgpack';
import Query from './Query';

var WebsocketConnection = _t.interface({
  emit: _t.Function,
  isConnected: _t.Function
}, 'WebsocketConnection');

export default class WebsocketStore extends AbstractStore {

  constructor(websocket, restName) {
    _assert(websocket, WebsocketConnection, 'websocket');

    _assert(restName, _t.String, 'restName');

    super(websocket);

    this.keyPath = 'id';
    if (!restName) {
      throw new Error(`Invalid restName: "${ restName }"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    _assert(key, _t.String, 'key');

    return new Query(this, key);
  }

  emit(type) {
    if (this.connection.isDisconnected()) {
      throw new Error('Websocket is not connected');
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return this.connection.emit('rest', {
      type,
      restName: this.restName,
      buffer: args && encode(args)
    }).then(result => result && decode(result));
  }

  emitSubscribe(type) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var emit = () => this.emit(type, ...args);
    return emit().then(result => {
      this.connection.on('reconnect', emit);
      return () => this.connection.off('reconnect', emit);
    });
  }

  insertOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      return this.emit('insertOne', object);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  updateOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      return this.emit('updateOne', object);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  updateSeveral(objects) {
    _assert(objects, _t.list(_t.Any), 'objects');

    return _assert(function () {
      return this.emit('updateSeveral', objects);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateByKey(key, partialUpdate) {
    _assert(key, _t.Any, 'key');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateByKey', key, partialUpdate);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateOne(object, partialUpdate) {
    _assert(object, _t.Any, 'object');

    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateOne', object, partialUpdate);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  partialUpdateMany(criteria, partialUpdate) {
    _assert(partialUpdate, _t.Object, 'partialUpdate');

    return _assert(function () {
      return this.emit('partialUpdateMany', criteria, partialUpdate);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  deleteByKey(key) {
    _assert(key, _t.Any, 'key');

    return _assert(function () {
      return this.emit('deleteByKey', key);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  deleteOne(object) {
    _assert(object, _t.Any, 'object');

    return _assert(function () {
      return this.emit('deleteOne', object);
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  cursor(criteria, sort) {
    _assert(criteria, _t.maybe(_t.Object), 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    return _assert(function () {
      return Promise.resolve(new WebsocketCursor(this, { criteria, sort }));
    }.apply(this, arguments), _t.Promise, 'return value');
  }

  findByKey(key) {
    _assert(key, _t.Any, 'key');

    return this.findOne({ id: key });
  }

  findOne(criteria, sort) {
    _assert(criteria, _t.Object, 'criteria');

    _assert(sort, _t.maybe(_t.Object), 'sort');

    return _assert(function () {
      return this.emit('findOne', criteria, sort);
    }.apply(this, arguments), _t.Promise, 'return value');
  }
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

    return type(x);
  }

  if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=WebsocketStore.js.map