import Msgpack from 'msgpack5';

var msgpack = new Msgpack();

msgpack.register(0x42, Date, date => Buffer.from(date.getTime().toString()), timeBuffer => new Date(Number(timeBuffer.toString())));

export var encode = msgpack.encode;
export var decode = msgpack.decode;
//# sourceMappingURL=index.js.map