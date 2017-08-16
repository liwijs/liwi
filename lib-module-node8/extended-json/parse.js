/* eslint-disable max-len */

const regexpStringDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const internalReviver = (key, value) => {
  // if (Array.isArray(value) && value.length === 3 && value[0] === 'extended-json') {
  //   switch (value[1]) {
  //     case 'date':
  //       return new Date(value[2]);
  //     default:
  //       throw new Error(`Invalid type: "${value[1]}"`);
  //   }
  // }

  if (typeof value === 'string') {
    const matchDate = regexpStringDate.exec(value);
    if (matchDate) return new Date(Date.UTC(+matchDate[1], +matchDate[2] - 1, +matchDate[3], +matchDate[4], +matchDate[5], +matchDate[6]));
  }

  return value;
};

/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */
export default function (text, reviver) {
  return JSON.parse(text, reviver == null ? internalReviver : (key, value) => reviver(key, internalReviver(value)));
}
//# sourceMappingURL=parse.js.map