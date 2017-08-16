'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractQuery = require('../store/AbstractQuery');

var _AbstractQuery2 = _interopRequireDefault(_AbstractQuery);

var _RethinkStore = require('./RethinkStore');

var _RethinkStore2 = _interopRequireDefault(_RethinkStore);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SubscribeReturnType = _flowRuntime2.default.type('SubscribeReturnType', _flowRuntime2.default.object(_flowRuntime2.default.property('cancel', _flowRuntime2.default.function()), _flowRuntime2.default.property('stop', _flowRuntime2.default.function())));

let Query = class extends _AbstractQuery2.default {
  constructor(...args) {
    super(...args), _flowRuntime2.default.bindTypeParameters(this, _flowRuntime2.default.ref(_RethinkStore2.default));
  }

  fetch(callback) {
    let _callbackType = _flowRuntime2.default.nullable(_flowRuntime2.default.function());

    const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.any());

    return _flowRuntime2.default.param('callback', _callbackType).assert(callback), this.queryCallback(this.store.query(), this.store.r).run().then(callback).then(_arg => _returnType.assert(_arg));
  }

  _subscribe(callback, _includeInitial = false, args) {
    let _callbackType2 = _flowRuntime2.default.function();

    let _argsType = _flowRuntime2.default.array(_flowRuntime2.default.any());

    const _returnType2 = _flowRuntime2.default.return(SubscribeReturnType);

    _flowRuntime2.default.param('callback', _callbackType2).assert(callback), _flowRuntime2.default.param('args', _argsType).assert(args);

    let _feed;
    let promise = this.queryCallback(this.store.query(), this.store.r).changes({
      includeInitial: _includeInitial,
      includeStates: true,
      includeTypes: true,
      includeOffsets: true
    }).then(feed => (args.length === 0 && (_feed = feed, delete this._promise), feed.each(callback), feed));

    args.length === 0 && (this._promise = promise);


    const stop = () => {
      this.closeFeed(_feed, promise);
    };

    return _returnType2.assert({
      stop,
      cancel: stop,
      then: (cb, errCb) => promise.then(cb, errCb)
    });
  }

  closeFeed(feed, promise) {
    feed ? feed.close() : promise && promise.then(feed => feed.close());
  }
};
exports.default = Query;
//# sourceMappingURL=Query.js.map