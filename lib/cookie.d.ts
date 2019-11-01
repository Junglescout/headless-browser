declare function serialize(object: any): string;
declare function parse(string: string | undefined): {};
declare function assign(string: any, key: any, value: any): string;
declare function parseSetString(string: string): string;
declare const _default: {
    serialize: typeof serialize;
    parse: typeof parse;
    assign: typeof assign;
    parseSetString: typeof parseSetString;
};
export default _default;
