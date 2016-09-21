'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractStore = require('../store/AbstractStore');

var _AbstractStore2 = _interopRequireDefault(_AbstractStore);

var _WebsocketCursor = require('./WebsocketCursor');

var _WebsocketCursor2 = _interopRequireDefault(_WebsocketCursor);

var _msgpack = require('../msgpack');

var _Query = require('./Query');

var _Query2 = _interopRequireDefault(_Query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebsocketStore extends _AbstractStore2.default {

  constructor(websocket, restName) {
    super(websocket);

    this.keyPath = '_id';
    if (!restName) {
      throw new Error(`Invalid restName: "${ restName }"`);
    }

    this.restName = restName;
  }

  createQuery(key) {
    return new _Query2.default(this, key);
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
      buffer: args && (0, _msgpack.encode)(args)
    }).then(result => (0, _msgpack.decode)(result));
  }

  insertOne(object) {
    return this.emit('insertOne', object);
  }

  updateOne(object) {
    return this.emit('updateOne', object);
  }

  updateSeveral(objects) {
    return this.emit('updateSeveral', objects);
  }

  partialUpdateByKey(key, partialUpdate) {
    return this.emit('partialUpdateByKey', key, partialUpdate);
  }

  partialUpdateOne(object, partialUpdate) {
    return this.emit('partialUpdateOne', object, partialUpdate);
  }

  partialUpdateMany(criteria, partialUpdate) {
    return this.emit('partialUpdateMany', criteria, partialUpdate);
  }

  deleteByKey(key) {
    return this.emit('deleteByKey', key);
  }

  deleteOne(object) {
    return this.emit('deleteOne', object);
  }

  cursor(criteria, sort) {
    return Promise.resolve(new _WebsocketCursor2.default(this, { criteria, sort }));
  }

  findByKey(key) {
    return this.findOne({ _id: key });
  }

  findOne(criteria, sort) {
    return this.emit('findOne', criteria, sort);
  }
}
exports.default = WebsocketStore;
//# sourceMappingURL=WebsocketStore.js.map