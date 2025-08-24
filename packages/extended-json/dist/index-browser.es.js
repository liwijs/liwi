function stringify(value, replacer, space) {
  return JSON.stringify(
    value,
    // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
    replacer,
    space
  );
}

const regexpStringDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
const internalReviver = function(key, value) {
  if (typeof value === "string") {
    const matchDate = regexpStringDate.exec(value);
    if (matchDate) {
      return new Date(
        Date.UTC(
          +matchDate[1],
          +matchDate[2] - 1,
          +matchDate[3],
          +matchDate[4],
          +matchDate[5],
          +matchDate[6]
        )
      );
    }
  }
  return value;
};
function parse(text, reviver) {
  return JSON.parse(
    text,
    reviver == null ? internalReviver : (key, value) => reviver(key, internalReviver(key, value))
  );
}

export { parse as decode, stringify as encode, parse, stringify };
//# sourceMappingURL=index-browser.es.js.map
