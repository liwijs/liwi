var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

import Logger from 'nightingale-logger';
import AbstractStore from '../store/AbstractStore';
import WebsocketCursor from './WebsocketCursor';
import { encode, decode } from '../extended-json';
import Query from './Query';

import t from 'flow-runtime';
var logger = new Logger('liwi:websocket-client');

var WebsocketConnectionType = t.type('WebsocketConnectionType', t.object(t.property('emit', t.function()), t.property('isConnected', t.function())));

var _WebsocketStoreTypeParametersSymbol = Symbol('WebsocketStoreTypeParameters');

var WebsocketStore = (_temp = _class = function (_AbstractStore) {
  function WebsocketStore(websocket, restName) {
    _classCallCheck(this, WebsocketStore);

    var _typeParameters = {
      ModelType: t.typeParameter('ModelType')
    };

    var _restNameType = t.string();

    t.param('websocket', WebsocketConnectionType).assert(websocket), t.param('restName', _restNameType).assert(restName);

    var _this = _possibleConstructorReturn(this, (WebsocketStore.__proto__ || Object.getPrototypeOf(WebsocketStore)).call(this, websocket));

    if (_this.keyPath = 'id', _this[_WebsocketStoreTypeParametersSymbol] = _typeParameters, t.bindTypeParameters(_this, WebsocketConnectionType), !restName) throw new Error('Invalid restName: "' + restName + '"');

    return _this.restName = restName, _this.restName = restName, _this;
  }

  return _inherits(WebsocketStore, _AbstractStore), _createClass(WebsocketStore, [{
    key: 'createQuery',
    value: function createQuery(key) {
      var _keyType = t.string();

      return t.param('key', _keyType).assert(key), logger.debug('createQuery', { key: key }), new Query(this, key);
    }
  }, {
    key: 'emit',
    value: function emit(type) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];

      if (logger.debug('emit', { type: type, args: args }), this.connection.isDisconnected()) throw new Error('Websocket is not connected');

      return this.connection.emit('rest', {
        type: type,
        restName: this.restName,
        json: encode(args)
      }).then(function (result) {
        return result && decode(result);
      });
    }
  }, {
    key: 'emitSubscribe',
    value: function emitSubscribe(type) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];

      var emit = function emit() {
        return _this2.emit.apply(_this2, [type].concat(args));
      };
      return emit().then(function () {
        return _this2.connection.on('reconnect', emit), function () {
          return _this2.connection.off('reconnect', emit);
        };
      });
    }
  }, {
    key: 'insertOne',
    value: function insertOne(object) {
      var _objectType = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      return t.param('object', _objectType).assert(object), this.emit('insertOne', object).then(function (_arg) {
        return _returnType.assert(_arg);
      });
    }
  }, {
    key: 'updateOne',
    value: function updateOne(object) {
      var _objectType2 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType2 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      return t.param('object', _objectType2).assert(object), this.emit('updateOne', object).then(function (_arg2) {
        return _returnType2.assert(_arg2);
      });
    }
  }, {
    key: 'updateSeveral',
    value: function updateSeveral(objects) {
      var _objectsType = t.array(t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType));

      var _returnType3 = t.return(t.array(this[_WebsocketStoreTypeParametersSymbol].ModelType));

      return t.param('objects', _objectsType).assert(objects), this.emit('updateSeveral', objects).then(function (_arg3) {
        return _returnType3.assert(_arg3);
      });
    }
  }, {
    key: 'partialUpdateByKey',
    value: function partialUpdateByKey(key, partialUpdate) {
      var _keyType2 = t.any();

      var _partialUpdateType = t.object();

      var _returnType4 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      return t.param('key', _keyType2).assert(key), t.param('partialUpdate', _partialUpdateType).assert(partialUpdate), this.emit('partialUpdateByKey', key, partialUpdate).then(function (_arg4) {
        return _returnType4.assert(_arg4);
      });
    }
  }, {
    key: 'partialUpdateOne',
    value: function partialUpdateOne(object, partialUpdate) {
      var _objectType3 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _partialUpdateType2 = t.object();

      var _returnType5 = t.return(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      return t.param('object', _objectType3).assert(object), t.param('partialUpdate', _partialUpdateType2).assert(partialUpdate), this.emit('partialUpdateOne', object, partialUpdate).then(function (_arg5) {
        return _returnType5.assert(_arg5);
      });
    }
  }, {
    key: 'partialUpdateMany',
    value: function partialUpdateMany(criteria, partialUpdate) {
      var _partialUpdateType3 = t.object();

      var _returnType6 = t.return(t.void());

      return t.param('partialUpdate', _partialUpdateType3).assert(partialUpdate), this.emit('partialUpdateMany', criteria, partialUpdate).then(function (_arg6) {
        return _returnType6.assert(_arg6);
      });
    }
  }, {
    key: 'deleteByKey',
    value: function deleteByKey(key) {
      var _keyType3 = t.any();

      var _returnType7 = t.return(t.void());

      return t.param('key', _keyType3).assert(key), this.emit('deleteByKey', key).then(function (_arg7) {
        return _returnType7.assert(_arg7);
      });
    }
  }, {
    key: 'deleteOne',
    value: function deleteOne(object) {
      var _objectType4 = t.flowInto(this[_WebsocketStoreTypeParametersSymbol].ModelType);

      var _returnType8 = t.return(t.void());

      return t.param('object', _objectType4).assert(object), this.emit('deleteOne', object).then(function (_arg8) {
        return _returnType8.assert(_arg8);
      });
    }
  }, {
    key: 'cursor',
    value: function cursor(criteria, sort) {
      var _criteriaType = t.nullable(t.object());

      var _sortType = t.nullable(t.object());

      var _returnType9 = t.return(t.ref(WebsocketCursor, this[_WebsocketStoreTypeParametersSymbol].ModelType));

      return t.param('criteria', _criteriaType).assert(criteria), t.param('sort', _sortType).assert(sort), Promise.resolve(new WebsocketCursor(this, { criteria: criteria, sort: sort })).then(function (_arg9) {
        return _returnType9.assert(_arg9);
      });
    }
  }, {
    key: 'findByKey',
    value: function findByKey(key) {
      var _keyType4 = t.any();

      return t.param('key', _keyType4).assert(key), this.findOne({ id: key });
    }
  }, {
    key: 'findOne',
    value: function findOne(criteria, sort) {
      var _criteriaType2 = t.object();

      var _sortType2 = t.nullable(t.object());

      var _returnType10 = t.return(t.object());

      return t.param('criteria', _criteriaType2).assert(criteria), t.param('sort', _sortType2).assert(sort), this.emit('findOne', criteria, sort).then(function (_arg10) {
        return _returnType10.assert(_arg10);
      });
    }
  }]), WebsocketStore;
}(AbstractStore), _class[t.TypeParametersSymbol] = _WebsocketStoreTypeParametersSymbol, _temp);
export { WebsocketStore as default };
//# sourceMappingURL=WebsocketStore.js.map