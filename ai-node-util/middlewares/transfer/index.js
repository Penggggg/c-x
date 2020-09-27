"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiTransfer = void 0;
var fs_1 = __importDefault(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var querystring_1 = __importDefault(require("querystring"));
var axios = require('axios');
var isDev = (process.env.NODE_ENV || '').toLocaleLowerCase() === 'dev';
exports.aiTransfer = function (_a) {
    var reg = _a.reg, targetUrl = _a.targetUrl, mockUrl = _a.mockUrl, cookies = _a.cookies, ctxCookiesKey = _a.ctxCookiesKey, _b = _a.cookies2Header, cookies2Header = _b === void 0 ? '' : _b, _c = _a.meta, meta = _c === void 0 ? false : _c;
    return function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
        var path, method, query, header, body, files, allCookies, _cookies2Header, headers, url, reqData, form_1, req, _a, status, data, msg, message, req, _b, status, data, msg, message;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    path = ctx.path, method = ctx.method, query = ctx.query, header = ctx.header;
                    body = ctx.request.body;
                    files = ctx.request.files || (ctx.request.body || {}).files;
                    allCookies = (cookies || '') + (header.cookie || '') + ';' + (!!ctxCookiesKey ? ctxCookiesKey + "=" + (ctx.cookies.get(ctxCookiesKey) || ctx[ctxCookiesKey]) : '');
                    _cookies2Header = cookies2Header
                        .split(',')
                        .filter(function (x) { return !!x; })
                        .reduce(function (pre, cur) {
                        var _a;
                        return (__assign(__assign({}, pre), (_a = {}, _a[cur] = ctx.cookies.get(cur) || '', _a)));
                    }, {});
                    headers = __assign(__assign(__assign({}, header), _cookies2Header), { cookie: allCookies });
                    if (!!path.startsWith(reg)) return [3 /*break*/, 2];
                    return [4 /*yield*/, next()];
                case 1:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 2:
                    delete headers['host'];
                    url = (mockUrl || targetUrl) + "/" + path.split('/').slice(2).join('/') + "?" + querystring_1.default.stringify(query || {});
                    reqData = {
                        url: url,
                        method: method,
                        headers: headers,
                        data: body,
                    };
                    if (!!!files) return [3 /*break*/, 4];
                    form_1 = new form_data_1.default();
                    /** 单个文件 */
                    if (!Array.isArray(files) && Object.keys(files).length > 0) {
                        // 先处理file类型
                        Object.keys(files)
                            .map(function (key) {
                            var file = files[key];
                            console.log("\u6587\u4EF6\uFF1A", key);
                            form_1.append(key, Buffer.from(fs_1.default.readFileSync(file.path), 'binary'), file.name);
                        });
                        console.log("\u68C0\u67E5\uFF1A", body);
                        // 如果传文件过程中，还有其他非files的key-value的字段数据
                        !!body.fields && Object.keys(body.fields)
                            .map(function (key) {
                            var target = body.fields[key];
                            if (typeof target === 'string' || typeof target === 'number') {
                                console.log("\u5176\u4ED6\u5B57\u6BB5\uFF1A", key);
                                form_1.append(key, target);
                            }
                        });
                        Object.keys(body)
                            .map(function (key) {
                            var target = body[key];
                            if (typeof target === 'string' || typeof target === 'number') {
                                console.log("\u5176\u4ED6\u5B57\u6BB5\uFF1A", key);
                                form_1.append(key, target);
                            }
                        });
                        /** 多个文件 */
                    }
                    else {
                    }
                    console.log("\n                    ================= \u6587\u4EF6\u8F6C\u53D1 =================\n                ");
                    console.log(form_1);
                    return [4 /*yield*/, axios.post(url, form_1, {
                            maxContentLength: Infinity,
                            maxBodyLength: Infinity,
                            headers: __assign(__assign(__assign({}, headers), form_1.getHeaders()), { 'content-length': form_1.getLengthSync() })
                        })];
                case 3:
                    req = _c.sent();
                    _a = req.data, status = _a.status, data = _a.data, msg = _a.msg, message = _a.message;
                    return [2 /*return*/, ctx.body = {
                            data: data,
                            message: msg || message,
                            status: status === 200 || status === 0 || status === '200' || status === '0' ? 200 : status
                        }
                        /** 接口口转发 */
                    ];
                case 4:
                    if (isDev) {
                        console.log("\n                    ================= Transfer Start =================\n                    ");
                        console.log(reqData);
                    }
                    !!isDev && console.log(reqData);
                    return [4 /*yield*/, axios(reqData)];
                case 5:
                    req = _c.sent();
                    if (isDev) {
                        console.log("\n                    ================= Transfer Result =================\n                    ");
                        console.log(req.data);
                    }
                    if (!!mockUrl) {
                        return [2 /*return*/, ctx.body = {
                                status: 200,
                                data: req.data.data
                            }];
                    }
                    else if (!!targetUrl) {
                        _b = req.data, status = _b.status, data = _b.data, msg = _b.msg, message = _b.message;
                        return [2 /*return*/, ctx.body = {
                                data: meta ? req.data : data,
                                message: msg || message,
                                status: status === 200 || status === 0 || status === '200' || status === '0' ? 200 : status
                            }];
                    }
                    _c.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
};
