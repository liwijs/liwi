import t from 'flow-runtime';

const JsonReplacer = t.type("JsonReplacer", t.function(t.param("key", t.string()), t.param("value", t.any()), t.return(t.union(t.number(), t.string(), t.boolean(), t.object(), t.ref("undefined")))));

// const internalReplacer = (key, value) => {
//   return value;
// };

/**
 * @param  {*}   value           The value to convert to a JSON string
 * @param  {function} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * @param {string|number} [space]
 * @return {string}
 */

var stringify = (function (value, replacer, space) {
  let _valueType = t.any();

  let _replacerType = t.nullable(JsonReplacer);

  let _spaceType = t.union(t.nullable(t.string()), t.number());

  const _returnType = t.return(t.string());

  t.param("value", _valueType).assert(value);
  t.param("replacer", _replacerType).assert(replacer);
  t.param("space", _spaceType).assert(space);
  return _returnType.assert(JSON.stringify(value,
  // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
  replacer, space));
});

const regexpStringDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const JsonReviver = t.type('JsonReviver', t.function(t.param('key', t.string()), t.param('value', t.any()), t.return(t.any())));


const internalReviver = JsonReviver.assert(function (key, value) {
  let _keyType = t.string();

  let _valueType = t.any();

  t.param('key', _keyType).assert(key);
  t.param('value', _valueType).assert(value);

  if (typeof value === 'string') {
    const matchDate = regexpStringDate.exec(value);
    if (matchDate) {
      return new Date(Date.UTC(+matchDate[1], +matchDate[2] - 1, +matchDate[3], +matchDate[4], +matchDate[5], +matchDate[6]));
    }
  }

  return value;
});

/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */
var parse = (function (text, reviver) {
  let _textType = t.string();

  let _reviverType = t.nullable(JsonReviver);

  t.param('text', _textType).assert(text);
  t.param('reviver', _reviverType).assert(reviver);
  return JSON.parse(text, reviver == null ? internalReviver : function (key, value) {
    return reviver(key, internalReviver(value));
  });
});

export { stringify, parse, stringify as encode, parse as decode };
//# sourceMappingURL=index-browsermodern-dev.es.js.map
