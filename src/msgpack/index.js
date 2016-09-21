import Msgpack from 'msgpack5';

const msgpack = new Msgpack();

msgpack.register(
  0x42,
  Date,
  date => Buffer.from(date.getTime().toString()),
  timeBuffer => new Date(Number(timeBuffer.toString())),
);

export const encode = msgpack.encode;
export const decode = msgpack.decode;
