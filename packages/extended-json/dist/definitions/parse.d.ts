import type { ExtendedJsonValue } from './ExtendedJsonValue';
type JsonReviver = <T extends ExtendedJsonValue>(key: string, value: T) => ExtendedJsonValue;
/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */
export default function parse<Value = ExtendedJsonValue>(text: string, reviver?: JsonReviver): Value;
export {};
//# sourceMappingURL=parse.d.ts.map