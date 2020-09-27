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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = __importDefault(require("uuid"));
var axios = require('axios');
var ciac = require('@cvte/ciac');
/**
 * 通用服务
 */
var CommonService = /** @class */ (function () {
    function CommonService(ctx, helpers) {
        this.ctx = ctx;
        this.helpers = helpers;
    }
    /**
     * @description
     * 获取iac
     */
    CommonService.prototype.getIac = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nacosConf, _a, id, secrect;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nacosConf = this.helpers.nacosConf;
                        if (!nacosConf.iac) {
                            throw 'iac配置缺失，请补充！';
                        }
                        _a = nacosConf.iac, id = _a.id, secrect = _a.secrect;
                        return [4 /*yield*/, ciac.getToken(id, secrect)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * @description
     * 获取jwt
     */
    CommonService.prototype.getJwt = function (account) {
        if (account === void 0) { account = 'hezhuopeng'; }
        return __awaiter(this, void 0, void 0, function () {
            var nacosConf, jwt, iac, req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nacosConf = this.helpers.nacosConf;
                        if (!nacosConf.hosts) {
                            throw 'host配置缺失，请补充！';
                        }
                        jwt = nacosConf.hosts.jwt;
                        return [4 /*yield*/, this.getIac()];
                    case 1:
                        iac = _a.sent();
                        return [4 /*yield*/, axios({
                                method: 'post',
                                url: jwt + "/v1/token",
                                headers: {
                                    'x-iac-token': iac
                                },
                                data: {
                                    sub: account,
                                    timeout: "99999999",
                                    account: {
                                        account: account
                                    }
                                }
                            })];
                    case 2:
                        req = _a.sent();
                        return [2 /*return*/, {
                                'x-iac-token': iac,
                                'access-token': iac,
                                'x-auth-token': req.data.data
                            }];
                }
            });
        });
    };
    /**
     * @description
     * 双授权转发
     */
    CommonService.prototype.transfer = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, req, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getJwt()];
                    case 1:
                        headers = _a.sent();
                        return [4 /*yield*/, axios(__assign(__assign({}, data), { headers: __assign(__assign({}, (data.headers || {})), headers) }))];
                    case 2:
                        req = _a.sent();
                        return [2 /*return*/, req.data.data];
                    case 3:
                        e_1 = _a.sent();
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description
     * 执行sql
     */
    CommonService.prototype.sql = function (arg) {
        return this.helpers.mysql.sql(arg);
    };
    /**
     * @description
     * 解析sql的创建语句，会自动插入uuid
     *
     * tableName: 表名称，
     * keyArr: 要插入的字段，
     * dataMeta: 提供数据的对象
     * custom_id：自定义的 _id
     */
    CommonService.prototype.sql_add = function (tableName, keyArr, dataMeta, custom_id) {
        var _id = uuid_1.default.v4();
        var sql = "insert into " + tableName + " (\n            " + __spreadArrays([
            '_id'
        ], keyArr
            .filter(function (key) {
            return dataMeta[key] !== undefined;
        })).join(',') + "\n        ) VALUES (\n            " + __spreadArrays([
            "'" + (custom_id || _id) + "'"
        ], keyArr
            .filter(function (key) {
            return dataMeta[key] !== undefined;
        })
            .map(function (key) { return "'" + dataMeta[key] + "'" || null; })).join(',') + "\n        )";
        return {
            sql: sql,
            _id: custom_id || _id
        };
    };
    /**
     * @description
     * 解析sql的更新语句
     *
     * tableName: 表名称，
     * keyArr: 要插入的字段，
     * dataMeta: 提供数据的对象
     */
    CommonService.prototype.sql_update = function (tableName, keyArr, dataMeta, where) {
        var idKey = Object.keys(where)[0];
        var sql = "update " + tableName + " set \n            " + __spreadArrays(keyArr
            .filter(function (key) {
            return dataMeta[key] !== undefined;
        })
            .map(function (key) {
            return key + " = " + (typeof dataMeta[key] === 'number' ? dataMeta[key] : "'" + dataMeta[key] + "'");
        })).join(',') + "\n        where " + idKey + " = '" + where[idKey] + "'";
        return {
            sql: sql
        };
    };
    /**
     * @description
     * 客户端返回内容 + status: 200
     */
    CommonService.prototype.back = function (data) {
        return this.ctx.body = {
            data: data,
            status: 200
        };
    };
    return CommonService;
}());
exports.default = CommonService;
