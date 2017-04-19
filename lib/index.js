"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request");
const cookie_1 = require("./cookie");
function getRequest(opts) {
    return new Promise((resolve, reject) => {
        Request.get(opts, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
class HeadlessBrowser {
    constructor(headers = {}) {
        this.headers = Object.assign({}, headers);
    }
    get(opts) {
        const defaults = { headers: this.headers };
        opts = Object.assign({}, defaults, opts);
        return getRequest(opts).then((res) => {
            this.setCookiesFromResponse(res);
            return res;
        });
    }
    setHeaders(headers) {
        this.headers = headers;
    }
    setHeader(key, value) {
        this.headers[key] = value;
    }
    setCookie(key, value) {
        const cookie = cookie_1.default.assign(this.headers['Cookie'], key, value);
        this.setHeader('Cookie', cookie);
    }
    getCookies() {
        return cookie_1.default.parse(this.headers['Cookie']);
    }
    setCookies(cookies) {
        if (typeof cookies == 'string') {
            return this.setCookies(cookie_1.default.parse(cookies));
        }
        else {
            for (let key in cookies) {
                this.setCookie(key, cookies[key]);
            }
        }
    }
    getUserAgent() {
        return this.headers['User-Agent'];
    }
    setUserAgent(value) {
        this.setHeader('User-Agent', value);
    }
    setAcceptEncoding(value) {
        this.setHeader('Accept-Encoding', value);
    }
    setCookiesFromResponse(res) {
        const resCookies = res.headers['set-cookie'];
        if (resCookies) {
            const cookies = resCookies.map(s => cookie_1.default.parseSetString(s)).join('; ');
            this.setCookies(cookies);
        }
    }
}
exports.default = HeadlessBrowser;
