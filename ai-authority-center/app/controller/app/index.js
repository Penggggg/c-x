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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aiUtil = __importStar(require("@cvte/ai-node-util"));
var isKeysEmpty = aiUtil.decorator.isKeysEmpty;
/**
 * 应用层级的相关接口
 */
var AppCtrl = /** @class */ (function () {
    function AppCtrl() {
    }
    /**
     * @description
     * 创建一个「系统」底下的「应用」
     *
     * 可以由业务系统主动创建（ 需要带上 custom_app_id ）
     */
    AppCtrl.prototype.create = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, _a, sys_id, custom_app_id, create_sql, create$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        _a = ctx.request.body, sys_id = _a.sys_id, custom_app_id = _a.custom_app_id;
                        create_sql = common.sql_add('app', [
                            'sys_id',
                            'app_name'
                        ], ctx.request.body, custom_app_id);
                        return [4 /*yield*/, common.sql(create_sql.sql)];
                    case 1:
                        create$ = _b.sent();
                        if (!create$.ok) {
                            throw '创建「系统」时发生错误';
                        }
                        return [2 /*return*/, common.back({
                                sys_id: sys_id,
                                app_id: create_sql._id
                            })];
                }
            });
        });
    };
    /**
     * @description
     * 创建一个「应用」底下的「页面模块」
     */
    AppCtrl.prototype.createPageModule = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, sys_id, app_id, create_sql, create$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.request.body, sys_id = _a.sys_id, app_id = _a.app_id;
                        create_sql = common.sql_add('page_module', [
                            'sys_id',
                            'app_id',
                            'code',
                            'name'
                        ], ctx.request.body);
                        return [4 /*yield*/, common.sql(create_sql.sql)];
                    case 1:
                        create$ = _b.sent();
                        if (!create$.ok) {
                            throw '创建「页面模块」时发生错误';
                        }
                        return [2 /*return*/, common.back({
                                sys_id: sys_id,
                                app_id: app_id,
                                page_module_id: create_sql._id
                            })];
                }
            });
        });
    };
    /**
     * @description
     * 创建一个「页面模块」底下的「页面」
     */
    AppCtrl.prototype.createPage = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, page_module_id, check$, create_sql, create$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        page_module_id = ctx.request.body.page_module_id;
                        return [4 /*yield*/, common.sql("SELECT id FROM " + tableNames.page_module + " where _id = '" + page_module_id + "'")];
                    case 1:
                        check$ = _a.sent();
                        if (!check$.ok) {
                            throw '查询「页面模块」时发生错误';
                        }
                        if (check$.ok && check$.result.length === 0) {
                            throw page_module_id + "\u7684\u9875\u9762\u6A21\u5757\u4E0D\u5B58\u5728";
                        }
                        create_sql = common.sql_add('pages', [
                            'app_id',
                            'sys_id',
                            'page_module_id',
                            'code',
                            'name',
                            'remark'
                        ], ctx.request.body);
                        return [4 /*yield*/, common.sql(create_sql.sql)];
                    case 2:
                        create$ = _a.sent();
                        if (!create$.ok) {
                            throw '创建「页面」时发生错误';
                        }
                        return [2 /*return*/, common.back({
                                page_id: create_sql._id
                            })];
                }
            });
        });
    };
    /**
     * @description
     * 创建一个「页面」底下的「按钮」
     */
    AppCtrl.prototype.createBtn = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, page_id, check$, create_sql, create$, find$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        page_id = ctx.request.body.page_id;
                        return [4 /*yield*/, common.sql("SELECT id FROM " + tableNames.pages + " where _id = '" + page_id + "'")];
                    case 1:
                        check$ = _a.sent();
                        if (!check$.ok) {
                            throw '查询「页面」时发生错误';
                        }
                        if (check$.ok && check$.result.length === 0) {
                            throw page_id + "\u7684\u9875\u9762\u6A21\u5757\u4E0D\u5B58\u5728";
                        }
                        create_sql = common.sql_add('btns', [
                            'page_id',
                            'code',
                            'name',
                            'remark'
                        ], ctx.request.body);
                        return [4 /*yield*/, common.sql(create_sql.sql)];
                    case 2:
                        create$ = _a.sent();
                        if (!create$.ok) {
                            throw '创建「按钮」时发生错误';
                        }
                        return [4 /*yield*/, common.sql("SELECT _id as btn_id, name, code FROM " + tableNames.btns + " where page_id = '" + page_id + "'")];
                    case 3:
                        find$ = _a.sent();
                        if (!find$.ok) {
                            throw '查询「按钮列表」时发生错误';
                        }
                        return [2 /*return*/, common.back(find$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 更新「页面模块」
     */
    AppCtrl.prototype.upadtePageModule = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, page_module_id, update_sql, update$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        page_module_id = ctx.request.body.page_module_id;
                        update_sql = common.sql_update('page_module', [
                            'code',
                            'name'
                        ], ctx.request.body, { _id: page_module_id });
                        return [4 /*yield*/, common.sql(update_sql.sql)];
                    case 1:
                        update$ = _a.sent();
                        if (!update$.ok) {
                            throw '更新「页面模块」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @description
     * 更新「页面」
     */
    AppCtrl.prototype.upadtePage = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, page_id, update_sql, update$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        page_id = ctx.request.body.page_id;
                        update_sql = common.sql_update('pages', [
                            'code',
                            'name',
                            'remark',
                            'page_module_id'
                        ], ctx.request.body, { _id: page_id });
                        return [4 /*yield*/, common.sql(update_sql.sql)];
                    case 1:
                        update$ = _a.sent();
                        if (!update$.ok) {
                            throw '更新「页面」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @description
     * 更新「按钮」
     */
    AppCtrl.prototype.upadteBtn = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, btn_id, update_sql, update$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        btn_id = ctx.request.body.btn_id;
                        update_sql = common.sql_update('btns', [
                            'code',
                            'name',
                            'remark'
                        ], ctx.request.body, { _id: btn_id });
                        return [4 /*yield*/, common.sql(update_sql.sql)];
                    case 1:
                        update$ = _a.sent();
                        if (!update$.ok) {
                            throw '更新「按钮」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @description
     * 查询「页面模块」
     */
    AppCtrl.prototype.findPageModule = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, sys_id, app_id, tableNames, find$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.query, sys_id = _a.sys_id, app_id = _a.app_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("SELECT _id as page_module_id, name, code FROM " + tableNames.page_module + " where sys_id = '" + sys_id + "' and app_id = '" + app_id + "'")];
                    case 1:
                        find$ = _b.sent();
                        if (!find$.ok) {
                            throw '查询「页面模块」时发生错误';
                        }
                        return [2 /*return*/, common.back(find$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 查询「页面模块」
     */
    AppCtrl.prototype.findPages = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, sys_id, app_id, tableNames, find$, pages, find2$;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.query, sys_id = _a.sys_id, app_id = _a.app_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("SELECT _id as page_id, page_module_id, name, code, remark FROM " + tableNames.pages + " where sys_id = '" + sys_id + "' and app_id = '" + app_id + "'")];
                    case 1:
                        find$ = _b.sent();
                        if (!find$.ok) {
                            throw '查询「页面模块」时发生错误';
                        }
                        pages = find$.result;
                        return [4 /*yield*/, Promise.all(pages.map(function (x) { return __awaiter(_this, void 0, void 0, function () {
                                var findBtn$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("SELECT _id as btn_id, page_id, name, code, remark FROM " + tableNames.btns + " where page_id = '" + x.page_id + "'")];
                                        case 1:
                                            findBtn$ = _a.sent();
                                            if (!findBtn$.ok) {
                                                return [2 /*return*/, []];
                                            }
                                            return [2 /*return*/, findBtn$.result || []];
                                    }
                                });
                            }); }))];
                    case 2:
                        find2$ = _b.sent();
                        return [2 /*return*/, common.back(find$.result.map(function (x, k) {
                                return __assign(__assign({}, x), { btns: find2$[k] });
                            }))];
                }
            });
        });
    };
    /**
     * @descript
     * 删除一个「页面模块」
     */
    AppCtrl.prototype.deletePageModule = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, _a, page_module_id, sys_id, app_id, check$, delete$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        _a = ctx.query, page_module_id = _a.page_module_id, sys_id = _a.sys_id, app_id = _a.app_id;
                        return [4 /*yield*/, common.sql("SELECT id FROM " + tableNames.pages + " where page_module_id = '" + page_module_id + "'")];
                    case 1:
                        check$ = _b.sent();
                        if (!check$.ok) {
                            throw '查询「页面模块引用」时发生错误';
                        }
                        if (check$.ok && check$.result.length > 0) {
                            throw "\u6B64\u9875\u9762\u6A21\u5757\u88AB\u5F15\u7528\uFF0C\u8BF7\u5148\u5220\u9664\u6A21\u5757\u5E95\u4E0B\u7684\u9875\u9762";
                        }
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.page_module + " WHERE  _id = '" + page_module_id + "'")];
                    case 2:
                        delete$ = _b.sent();
                        if (!delete$.ok) {
                            throw '删除「页面模块」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @descript
     * 删除一个「页面」
     *
     * TODO，要判断是否有角色依赖了此页面
     */
    AppCtrl.prototype.deletePage = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, page_id, delete$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        page_id = ctx.query.page_id;
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.pages + " WHERE  _id = '" + page_id + "'")];
                    case 1:
                        delete$ = _a.sent();
                        if (!delete$.ok) {
                            throw '删除「页面」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @descript
     * 删除一个「按钮」
     *
     * TODO，要判断是否有角色依赖了此按钮
     */
    AppCtrl.prototype.deleteBtn = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, btn_id, delete$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        btn_id = ctx.query.btn_id;
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.btns + " WHERE  _id = '" + btn_id + "'")];
                    case 1:
                        delete$ = _a.sent();
                        if (!delete$.ok) {
                            throw '删除「按钮」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    __decorate([
        isKeysEmpty({
            body: 'sys_id,app_name'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "create", null);
    __decorate([
        isKeysEmpty({
            body: 'app_id,sys_id,code,name'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "createPageModule", null);
    __decorate([
        isKeysEmpty({
            body: 'app_id,sys_id,page_module_id,name,code'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "createPage", null);
    __decorate([
        isKeysEmpty({
            body: 'page_id,name,code'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "createBtn", null);
    __decorate([
        isKeysEmpty({
            body: 'page_module_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "upadtePageModule", null);
    __decorate([
        isKeysEmpty({
            body: 'page_id,page_module_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "upadtePage", null);
    __decorate([
        isKeysEmpty({
            body: 'btn_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "upadteBtn", null);
    __decorate([
        isKeysEmpty({
            query: 'sys_id,app_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "findPageModule", null);
    __decorate([
        isKeysEmpty({
            query: 'sys_id,app_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "findPages", null);
    __decorate([
        isKeysEmpty({
            query: 'page_module_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "deletePageModule", null);
    __decorate([
        isKeysEmpty({
            query: 'page_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "deletePage", null);
    __decorate([
        isKeysEmpty({
            query: 'btn_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AppCtrl.prototype, "deleteBtn", null);
    return AppCtrl;
}());
exports.default = new AppCtrl();
