"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("@mcrowe/result");
const Request = require("request");
const cookie_1 = require("./cookie");
function getRequest(opts) {
    return new Promise((resolve, _reject) => {
        Request.get(opts, (err, data) => {
            if (err) {
                resolve(result_1.Result.Error(err.message));
            }
            else {
                resolve(result_1.Result.OK(data));
            }
        });
    });
}
function postRequest(opts) {
    return new Promise((resolve, _reject) => {
        Request.post(opts, (err, data) => {
            if (err) {
                resolve(result_1.Result.Error(err.message));
            }
            else {
                resolve(result_1.Result.OK(data));
            }
        });
    });
}
class HeadlessBrowser {
    constructor(headers = {}) {
        this.headers = Object.assign({}, headers);
    }
    get(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = { headers: this.headers };
            opts = Object.assign({}, defaults, opts);
            const res = yield getRequest(opts);
            if (res.ok) {
                this.setCookiesFromResponse(res.data);
            }
            return res;
        });
    }
    post(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaults = { headers: this.headers };
            opts = Object.assign({}, defaults, opts);
            const res = yield postRequest(opts);
            if (res.ok) {
                this.setCookiesFromResponse(res.data);
            }
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
            const validCookies = resCookies.filter(s => cookie_1.default.isExpired(s) === false);
            const cookies = validCookies.map(s => cookie_1.default.parseSetString(s)).join('; ');
            this.setCookies(cookies);
        }
    }
}
exports.default = HeadlessBrowser;
