import Request = require('request')
import Cookie from './cookie'


function getRequest(opts): Promise<any> {
  return new Promise((resolve, reject) => {
    Request.get(opts, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}


export interface Map {
  [key: string]: string
}


class HeadlessBrowser {

  headers: Map

  constructor(headers: Map = {}) {
    this.headers = { ...headers }
  }

  get(opts) {
    const defaults = {headers: this.headers}
    opts = Object.assign({}, defaults, opts)
    return getRequest(opts).then((res) => {
      this.setCookiesFromResponse(res)
      return res
    })
  }

  setHeaders(headers: Map) {
    this.headers = headers
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value
  }

  setCookie(key: string, value: string) {
    const cookie = Cookie.assign(this.headers['Cookie'], key, value)
    this.setHeader('Cookie', cookie)
  }

  getCookies(): Map {
    return Cookie.parse(this.headers['Cookie'])
  }

  setCookies(cookies: Map | string) {
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

  setCookiesFromResponse(res) {
    const resCookies = res.headers['set-cookie']

    if (resCookies) {
      const cookies = resCookies.map(s => Cookie.parseSetString(s)).join('; ')
      this.setCookies(cookies)
    }
  }

}


export default HeadlessBrowser