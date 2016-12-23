/* eslint-disable max-len */

// const internalReplacer = (key, value) => {
//   if (value instanceof Date) {
//     return ['extended-json', 'date', value.getTime()];
//   }
//
//   return value;
// };

/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * @param {string|number} [space]
 * @return {string}
 */
export default function (text, replacer, space) {
  return JSON.stringify(
    text,
    // replacer == null ? internalReplacer : (key, value) => replacer(key, internalReplacer(value)),
    replacer,
    space
  );
}
