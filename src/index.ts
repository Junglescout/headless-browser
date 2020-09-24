import { Result, IResult } from '@mcrowe/result'
import Request = require('request')
import Cookie from './cookie'


export interface IMap {
  [key: string]: string
}


export interface IResponseHeaders {
  'set-cookie'?: string[]
  'content-type'?: string
}


export interface IHttpResponse {
  statusCode: number
  body: string
  headers: IResponseHeaders
}

export type IRequestHeaders = IMap


export type IHttpResult = IResult<IHttpResponse>


function getRequest(opts): Promise<IHttpResult> {
  return new Promise((resolve, _reject) => {
    Request.get(opts, (err, data) => {
      if (err) {
        resolve( Result.Error(err.message) )
      } else {
        resolve( Result.OK(data) )
      }
    })
  })
}


function postRequest(opts): Promise<IHttpResult> {
  return new Promise((resolve, _reject) => {
    Request.post(opts, (err, data) => {
      if (err) {
        resolve( Result.Error(err.message) )
      } else {
        resolve( Result.OK(data) )
      }
    })
  })
}


export default class HeadlessBrowser {

  headers: IRequestHeaders

  constructor(headers: IRequestHeaders = {}) {
    this.headers = { ...headers }
  }

  async get(opts): Promise<IHttpResult> {
    const defaults = {headers: this.headers}
    opts = Object.assign({}, defaults, opts)
    const res = await getRequest(opts)

    if (res.ok) {
      this.setCookiesFromResponse(res.data)
    }

    return res
  }

  async post(opts): Promise<IHttpResult> {
    const defaults = {headers: this.headers}
    opts = Object.assign({}, defaults, opts)
    const res = await postRequest(opts)

    if (res.ok) {            
      this.setCookiesFromResponse(res.data)
    }

    return res
  }

  setHeaders(headers: IRequestHeaders) {
    this.headers = headers
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value
  }

  setCookie(key: string, value: string) {
    const cookie = Cookie.assign(this.headers['Cookie'], key, value)
    this.setHeader('Cookie', cookie)
  }

  getCookies(): IMap {
    return Cookie.parse(this.headers['Cookie'])
  }

  setCookies(cookies: IMap | string) {
    if (typeof cookies == 'string') {
      return this.setCookies(Cookie.parse(cookies))
    } else {
      for (let key in cookies) {
        this.setCookie(key, cookies[key])
      }
    }
  }

  getUserAgent(): string {
    return this.headers['User-Agent']
  }

  setUserAgent(value: string) {
    this.setHeader('User-Agent', value)
  }

  setAcceptEncoding(value: string) {
    this.setHeader('Accept-Encoding', value)
  }

  setCookiesFromResponse(res: IHttpResponse) {
    const resCookies = res.headers['set-cookie']

    if (resCookies) {
      const validCookies = resCookies.filter(s => Cookie.isExpired(s) === false);
      const cookies = validCookies.map(s => Cookie.parseSetString(s)).join('; ')
      this.setCookies(cookies)
    }
  }
}