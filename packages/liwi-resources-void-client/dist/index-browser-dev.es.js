import { AbstractClient } from 'liwi-resources-client';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

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
}(AbstractClient);

export { VoidClient };
//# sourceMappingURL=index-browser-dev.es.js.map
