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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 检查body中的sys_id或app_id是否在数据库中存在
 */
exports.myCheck = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var common, tableNames, sys_id, app_id, check$, check2$, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                common = ctx.service.common;
                tableNames = common.helpers.constants.tableNames;
                sys_id = (ctx.request.body || {}).sys_id || ctx.query.sys_id;
                app_id = (ctx.request.body || {}).app_id || ctx.query.app_id;
                if (!!!sys_id) return [3 /*break*/, 2];
                return [4 /*yield*/, common.sql("SELECT id FROM " + tableNames.system + " where _id = '" + sys_id + "'")];
            case 1:
                check$ = _a.sent();
                if (!check$.ok) {
                    throw '查询「「系统」时发生错误';
                }
                if (check$.ok && check$.result.length === 0) {
                    throw sys_id + "\u7684\u7CFB\u7EDF\u4E0D\u5B58\u5728";
                }
                _a.label = 2;
            case 2:
                if (!!!app_id) return [3 /*break*/, 4];
                return [4 /*yield*/, common.sql("SELECT id FROM " + tableNames.app + " where _id = '" + app_id + "'")];
            case 3:
                check2$ = _a.sent();
                if (!check2$.ok) {
                    throw '查询「应用」时发生错误';
                }
                if (check2$.ok && check2$.result.length === 0) {
                    throw app_id + "\u7684\u5E94\u7528\u4E0D\u5B58\u5728";
                }
                _a.label = 4;
            case 4: return [4 /*yield*/, next()];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                return [2 /*return*/, ctx.body = {
                        status: 500,
                        message: e_1
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
