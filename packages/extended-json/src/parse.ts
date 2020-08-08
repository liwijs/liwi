import { ExtendedJsonValue } from './ExtendedJsonValue';

// eslint-disable-next-line unicorn/no-unsafe-regex
const regexpStringDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

type JsonReviver = (key: string, value: any) => any;

const internalReviver: JsonReviver = (key: string, value: any) => {
  if (typeof value === 'string') {
    const matchDate = regexpStringDate.exec(value);
    if (matchDate) {
      return new Date(
        Date.UTC(
          +matchDate[1],
          +matchDate[2] - 1,
          +matchDate[3],
          +matchDate[4],
          +matchDate[5],
          +matchDate[6],
        ),
      );
    }
  }

  return value;
};

/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */
export default function parse<Value = ExtendedJsonValue>(
  text: string,
  reviver?: JsonReviver,
): Value {
  return JSON.parse(
    text,
    reviver == null
      ? internalReviver
      : (key, value) => reviver(key, internalReviver(key, value)),
  );
}
