"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiLogin = void 0;
var axios = require('axios');
var aiJwt_1 = require("../aiJwt");
var defaultCookisName = 'ai-login';
var isDev = (process.env.NODE_ENV || '').toLocaleLowerCase() === 'dev';
/** 接入统一登陆的 Koa Controller */
var login = function (redirectUrl, cookieName, maxAge) {
    if (redirectUrl === void 0) { redirectUrl = '/'; }
    if (cookieName === void 0) { cookieName = defaultCookisName; }
    if (maxAge === void 0) { maxAge = 24 * 60 * 60 * 1000; }
    return function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var code, req, _a, resultCode, resultData, token, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    code = ctx.query.code;
                    return [4 /*yield*/, axios({
                            method: 'get',
                            url: "https://ai.cvte.com/sso/cheack/checkCode?code=" + code
                        })];
                case 1:
                    req = _b.sent();
                    _a = req.data, resultCode = _a.resultCode, resultData = _a.resultData;
                    if (resultCode !== 0) {
                        return [2 /*return*/, ctx.body = JSON.stringify(req.data)];
                    }
                    console.log("\n                =============== ai login ============\n            ");
                    console.log(resultData.user_info);
                    return [4 /*yield*/, aiJwt_1.AiJwt.sign(resultData.user_info)];
                case 2:
                    token = _b.sent();
                    ctx[cookieName] = token;
                    ctx.cookies.set(cookieName, token, { maxAge: maxAge });
                    ctx.redirect(redirectUrl);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    ctx.body = 'login error';
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
/** 检查是否有登陆的 Koa Middleware */
var check = function (_a) {
    var ssoNext = _a.ssoNext, cookieName = _a.cookieName, _b = _a.whiteList, whiteList = _b === void 0 ? [] : _b, _c = _a.needCheck, needCheck = _c === void 0 ? !isDev : _c;
    return function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
        var isExited, isInWhiteList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isExited = ctx.cookies.get(cookieName) || ctx[cookieName];
                    isInWhiteList = !!__spreadArrays([
                        'sso',
                        'login',
                        'callback',
                        'oauth',
                        '.'
                    ], whiteList).find(function (x) { return ctx.url.toLocaleLowerCase().includes(x); });
                    if (!(!isExited && !isInWhiteList && needCheck)) return [3 /*break*/, 1];
                    console.log("\n                =============== ai login checking: " + !!isExited + " ============\n            ");
                    ctx.redirect("https://ai.cvte.com/oauth2/#/login?next=" + ssoNext);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
/** 接入业务系统登陆的 Koa Controller */
var code2Session = function (loginUrl, maxAge) {
    if (maxAge === void 0) { maxAge = 24 * 60 * 60 * 1000; }
    return function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var code, res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    code = ctx.query.code;
                    console.log("\n                ============= \u767B\u9646\u4E2D =============\n            ");
                    console.log("loginUrl: " + loginUrl + " code: " + code);
                    return [4 /*yield*/, axios({
                            method: 'post',
                            url: loginUrl,
                            data: {
                                code: code
                            }
                        })];
                case 1:
                    res = _a.sent();
                    res.headers['set-cookie']
                        .map(function (x) { return "" + x.split(';')[0]; })
                        .map(function (x) {
                        var _a = x.split('='), key = _a[0], val = _a[1];
                        ctx.cookies.set(key, val, { maxAge: maxAge });
                    });
                    ctx.redirect('/');
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    ctx.body = 'login error';
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
/** 业务系统、当前系统的登出 */
var logout = function (_a) {
    var ssoNext = _a.ssoNext, cookieName = _a.cookieName, logoutUrl = _a.logoutUrl;
    return function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var cookie, reqData, res, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookie = ctx.cookies.get(cookieName);
                    console.log("\n            =============== ai logout ============\n        ");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    reqData = {
                        url: logoutUrl,
                        headers: {
                            Cookie: cookieName + "=" + cookie
                        }
                    };
                    console.log(reqData);
                    return [4 /*yield*/, axios(reqData)];
                case 2:
                    res = _a.sent();
                    console.log("\n                =============== bussiness logout ============\n            ");
                    console.log(res.data);
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    // node再清除cookie
                    ctx.cookies.set(cookieName, '', { maxAge: 10 });
                    // 重定向
                    ctx.redirect("https://ai.cvte.com/oauth2/#/login?next=" + ssoNext + "&action=reLogin");
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.aiLogin = {
    login: login,
    check: check,
    logout: logout,
    code2Session: code2Session
};
