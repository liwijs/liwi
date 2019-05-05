declare type JsonReviver = (key: string, value: any) => any;
/**
 * @param  {string}   text      The string to parse as JSON
 * @param  {function} [reviver] If a function, prescribes how the value originally produced by parsing is transformed, before being returned
 * @return {*}
 */
export default function parse(text: string, reviver?: JsonReviver): any;
export {};
//# sourceMappingURL=parse.d.ts.map