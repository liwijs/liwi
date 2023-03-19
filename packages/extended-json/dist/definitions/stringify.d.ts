import type { ExtendedJsonValue } from './ExtendedJsonValue';
type JsonReplacer = (key: string, value: any) => Record<string, any> | boolean | number | string | undefined;
/**
 * @param {*} value The value to convert to a JSON string
 * @param {function} [replacer] A function that alters the behavior of the stringification process, or an array of String and Number objects that serve as a whitelist for selecting the properties of the value object to be included in the JSON string. If this value is null or not provided, all properties of the object are included in the resulting JSON string.
 * @param {string|number} [space]
 * @return {string}
 */
export default function stringify(value: ExtendedJsonValue, replacer?: JsonReplacer, space?: number | string): string;
export {};
//# sourceMappingURL=stringify.d.ts.map