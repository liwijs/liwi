// const internalReplacer = (key, value) => {
//   return value;
// };

/**
 * @param {*} value The value to convert to a JSON string
 * @param {function} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * @param {string|number} [space]
 * @return {string}
 */
function stringify(value, replacer, space) {
  return JSON.stringify(value, // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
  replacer, space);
}

// eslint-disable-next-line unicorn/no-unsafe-regex
const regexpStringDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const internalReviver = function (key, value) {
  if (typeof value === 'string') {
    const matchDate = regexpStringDate.exec(value);

    if (matchDate) {
      return new Date(Date.UTC(+matchDate[1], +matchDate[2] - 1, +matchDate[3], +matchDate[4], +matchDate[5], +matchDate[6]));
    }
  }

  return value;
};
/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */


function parse(text, reviver) {
  return JSON.parse(text, reviver == null ? internalReviver : (key, value) => reviver(key, internalReviver(key, value)));
}

export { parse as decode, stringify as encode, parse, stringify };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
