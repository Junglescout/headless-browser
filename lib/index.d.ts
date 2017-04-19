export interface Map {
    [key: string]: string;
}
declare class HeadlessBrowser {
    headers: Map;
    constructor(headers?: Map);
    get(opts: any): Promise<any>;
    setHeaders(headers: Map): void;
    setHeader(key: string, value: string): void;
    setCookie(key: string, value: string): void;
    getCookies(): Map;
    setCookies(cookies: Map | string): any;
    getUserAgent(): string;
    setUserAgent(value: string): void;
    setAcceptEncoding(value: string): void;
    setCookiesFromResponse(res: any): void;
}
export default HeadlessBrowser;
