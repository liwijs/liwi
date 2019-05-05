'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/esm/inheritsLoose'));
var liwiResourcesClient = require('liwi-resources-client');

var VoidClient =
/*#__PURE__*/
function (_AbstractClient) {
  _inheritsLoose(VoidClient, _AbstractClient);

  function VoidClient() {
    return _AbstractClient.apply(this, arguments) || this;
  }

  var _proto = VoidClient.prototype;

  _proto.emitSubscribe = function emitSubscribe() {
    throw new Error('Void client: emitSubscribe should not be called');
  };

  _proto.createCursor = function createCursor() {
    throw new Error('Void client: createCursor should not be called');
  };

  _proto.send = function send() {
    throw new Error('Void client: send should not be called');
  };

  _proto.on = function on() {
    throw new Error('Void client: on should not be called');
  };

  _proto.off = function off() {
    throw new Error('Void client: off should not be called');
  };

  return VoidClient;
}(liwiResourcesClient.AbstractClient);

exports.VoidClient = VoidClient;
//# sourceMappingURL=index-browser-dev.cjs.js.map
