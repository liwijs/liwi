import Msgpack from 'msgpack5';

var msgpack = new Msgpack();

msgpack.register(0x42, Date, function (date) {
  return Buffer.from(date.getTime().toString());
}, function (timeBuffer) {
  return new Date(Number(timeBuffer.toString()));
});

export var encode = msgpack.encode;
export var decode = msgpack.decode;
//# sourceMappingURL=index.js.map