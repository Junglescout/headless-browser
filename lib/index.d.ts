import { IResult } from '@mcrowe/result';
export interface IMap {
    [key: string]: string;
}
export interface IResponseHeaders {
    'set-cookie'?: string[];
    'content-type'?: string;
}
export interface IHttpResponse {
    statusCode: number;
    body: string;
    headers: IResponseHeaders;
}
export declare type IRequestHeaders = IMap;
export declare type IHttpResult = IResult<IHttpResponse>;
export default class HeadlessBrowser {
    headers: IRequestHeaders;
    constructor(headers?: IRequestHeaders);
    get(opts: any): Promise<IHttpResult>;
    setHeaders(headers: IRequestHeaders): void;
    setHeader(key: string, value: string): void;
    setCookie(key: string, value: string): void;
    getCookies(): IMap;
    setCookies(cookies: IMap | string): any;
    getUserAgent(): string;
    setUserAgent(value: string): void;
    setAcceptEncoding(value: string): void;
    setCookiesFromResponse(res: IHttpResponse): void;
}
