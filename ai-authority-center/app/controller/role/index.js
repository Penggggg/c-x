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
 * 角色层级的相关接口
 */
var RoleCtrl = /** @class */ (function () {
    function RoleCtrl() {
    }
    /**
     * @description
     * 创建一个「应用」底下的「角色」
     */
    RoleCtrl.prototype.createRole = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, create_sql, create$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        create_sql = common.sql_add('role', [
                            'app_id',
                            'sys_id',
                            'name',
                            'is_enable'
                        ], __assign(__assign({}, ctx.request.body), { is_enable: 0 }));
                        return [4 /*yield*/, common.sql(create_sql.sql)];
                    case 1:
                        create$ = _a.sent();
                        if (!create$.ok) {
                            throw '创建「角色」时发生错误';
                        }
                        return [2 /*return*/, common.back({
                                role_id: create_sql._id
                            })];
                }
            });
        });
    };
    /**
     * @description
     * 创建一个「应用」底下的「角色列表」
     */
    RoleCtrl.prototype.findRole = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, app_id, sys_id, tableNames, findRole$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.query, app_id = _a.app_id, sys_id = _a.sys_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("select _id as role_id, name from " + tableNames.role + " where sys_id = '" + sys_id + "' and app_id = '" + app_id + "'")];
                    case 1:
                        findRole$ = _b.sent();
                        if (!findRole$.ok) {
                            throw '查询「角色」时发生错误';
                        }
                        return [2 /*return*/, common.back(findRole$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 创建一个「角色」基础信息
     */
    RoleCtrl.prototype.findRoleBase = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, role_id, tableNames, findRole$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        role_id = ctx.query.role_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("select _id as role_id, name, remark, end_time, start_time, is_enable from " + tableNames.role + " where _id = '" + role_id + "'")];
                    case 1:
                        findRole$ = _a.sent();
                        if (!findRole$.ok) {
                            throw '查询「角色」时发生错误';
                        }
                        return [2 /*return*/, common.back(findRole$.result[0])];
                }
            });
        });
    };
    /**
     * @description
     * 删除一个「角色」
     */
    RoleCtrl.prototype.deleteRole = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, role_id, tableNames, delete$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        role_id = ctx.query.role_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.role + " WHERE  _id = '" + role_id + "'")];
                    case 1:
                        delete$ = _a.sent();
                        if (!delete$.ok) {
                            throw '删除「角色」时发生错误';
                        }
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @description
     * 更新一个「角色」的基本信息
     */
    RoleCtrl.prototype.updateBase = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, role_id, is_enable, tableNames, update_sql, update$, find$;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.request.body, role_id = _a.role_id, is_enable = _a.is_enable;
                        tableNames = common.helpers.constants.tableNames;
                        update_sql = common.sql_update('role', [
                            'name',
                            'remark',
                            'end_time',
                            'start_time',
                            'is_enable'
                        ], ctx.request.body, { _id: role_id });
                        return [4 /*yield*/, common.sql(update_sql.sql)];
                    case 1:
                        update$ = _b.sent();
                        if (!update$.ok) {
                            throw '更新「角色」时发生错误';
                        }
                        return [4 /*yield*/, common.sql("select _id as role_id, name, start_time, end_time, is_enable, remark from " + tableNames.role + " where _id = '" + role_id + "'")];
                    case 2:
                        find$ = _b.sent();
                        if (!find$.ok) {
                            throw '查询「角色」时发生错误';
                        }
                        return [2 /*return*/, common.back(find$.result[0])];
                }
            });
        });
    };
    /**
     * @description
     * 更新一个「角色」底下的「账号」
     *
     * user: {
     *      type: string,
     *      value: string,
     *      name: string
     * }[ ]
     */
    RoleCtrl.prototype.updateUsers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, role_id, users, tableNames, find$, sholdDeleteArr, sholdCreateArr, find2$;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.request.body, role_id = _a.role_id, users = _a.users;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("select _id as auth_user_id from " + tableNames.auth_users + " where role_id = '" + role_id + "'")];
                    case 1:
                        find$ = _b.sent();
                        if (!find$.ok) {
                            throw '查询「角色用户」时发生错误';
                        }
                        sholdDeleteArr = find$.result.filter(function (x) {
                            return !users.find(function (y) { return y.auth_user_id === x.auth_user_id; });
                        });
                        return [4 /*yield*/, Promise.all(sholdDeleteArr.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var delete$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.auth_users + " WHERE _id = '" + user.auth_user_id + "'")];
                                        case 1:
                                            delete$ = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))
                            // 3、插入没有id的「用户」
                        ];
                    case 2:
                        _b.sent();
                        sholdCreateArr = users.filter(function (user) { return !user.auth_user_id; });
                        return [4 /*yield*/, Promise.all(sholdCreateArr.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var create_sql;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            create_sql = common.sql_add('auth_users', [
                                                'value',
                                                'type',
                                                'name',
                                                'role_id'
                                            ], __assign(__assign({}, user), { role_id: role_id }));
                                            return [4 /*yield*/, common.sql(create_sql.sql)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))
                            // 4、返回所有的「用户」
                        ];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, common.sql("select _id as auth_user_id, role_id, type, name, value from " + tableNames.auth_users + " where role_id = '" + role_id + "'")];
                    case 4:
                        find2$ = _b.sent();
                        if (!find2$.ok) {
                            throw '查询「用户」时发生错误';
                        }
                        return [2 /*return*/, common.back(find2$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 添加一个「角色」底下的「账号」
     *
     * user: {
     *      type: string,
     *      value: string,
     *      name: string
     * }[ ]
     */
    RoleCtrl.prototype.addUsers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, _a, role_id, users, tableNames, sholdCreateArr, find2$;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        _a = ctx.request.body, role_id = _a.role_id, users = _a.users;
                        tableNames = common.helpers.constants.tableNames;
                        sholdCreateArr = users.filter(function (user) { return !user.auth_user_id; });
                        return [4 /*yield*/, Promise.all(sholdCreateArr.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                                var create_sql;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            create_sql = common.sql_add('auth_users', [
                                                'value',
                                                'type',
                                                'name',
                                                'role_id'
                                            ], __assign(__assign({}, user), { role_id: role_id }));
                                            return [4 /*yield*/, common.sql(create_sql.sql)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))
                            // 4、返回所有的「用户」
                        ];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, common.sql("select _id as auth_user_id, role_id, type, name, value from " + tableNames.auth_users + " where role_id = '" + role_id + "'")];
                    case 2:
                        find2$ = _b.sent();
                        if (!find2$.ok) {
                            throw '查询「用户」时发生错误';
                        }
                        return [2 /*return*/, common.back(find2$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 删除一个「角色」底下的「账号」
     *
     * 账号可用 逗号分隔
     *
     */
    RoleCtrl.prototype.deleteUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, auth_user_ids, tableNames;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        auth_user_ids = ctx.query.auth_user_ids;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, Promise.all(auth_user_ids.split(',').map(function (auth_user_id) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.auth_users + " WHERE _id = '" + auth_user_id + "'")];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, common.back()];
                }
            });
        });
    };
    /**
     * @description
     * 查询一个「角色」底下的「账号」
     */
    RoleCtrl.prototype.findUsers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, role_id, tableNames, find2$;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        role_id = ctx.query.role_id;
                        tableNames = common.helpers.constants.tableNames;
                        return [4 /*yield*/, common.sql("select _id as auth_user_id, role_id, type, name, value from " + tableNames.auth_users + " where role_id = '" + role_id + "'")];
                    case 1:
                        find2$ = _a.sent();
                        if (!find2$.ok) {
                            throw '查询「用户」时发生错误';
                        }
                        return [2 /*return*/, common.back(find2$.result)];
                }
            });
        });
    };
    /**
     * @description
     * 更新一个「角色」底下的「页面」、「按钮」
     *
     * pages: page_id[ ]
     */
    RoleCtrl.prototype.updatePagesBtns = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, _a, role_id, pages, btns, isPagesExisted, isBtnsExisted, findAuthPage$, pages$, findAuthBtns$, btns$;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        _a = ctx.request.body, role_id = _a.role_id, pages = _a.pages, btns = _a.btns;
                        return [4 /*yield*/, Promise.all(pages.map(function (page_id) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as page_id from " + tableNames.pages + " where _id = '" + page_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, find$.result.length > 0];
                                    }
                                });
                            }); }))];
                    case 1:
                        isPagesExisted = _b.sent();
                        if (isPagesExisted.includes(false)) {
                            throw '「页面」不存在，请刷新后重试';
                        }
                        // 1、删除旧有的
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.auth_pages + " WHERE role_id = '" + role_id + "'")];
                    case 2:
                        // 1、删除旧有的
                        _b.sent();
                        // 2、插入新的「页面权限」
                        return [4 /*yield*/, Promise.all(pages.map(function (page_id) { return __awaiter(_this, void 0, void 0, function () {
                                var create_sql;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            create_sql = common.sql_add('auth_pages', [
                                                'page_id',
                                                'role_id'
                                            ], {
                                                page_id: page_id,
                                                role_id: role_id
                                            });
                                            return [4 /*yield*/, common.sql(create_sql.sql)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))
                            // 校验即将配置的「按钮」是否存在
                        ];
                    case 3:
                        // 2、插入新的「页面权限」
                        _b.sent();
                        return [4 /*yield*/, Promise.all(btns.map(function (btn_id) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as page_id from " + tableNames.btns + " where _id = '" + btn_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, find$.result.length > 0];
                                    }
                                });
                            }); }))];
                    case 4:
                        isBtnsExisted = _b.sent();
                        if (isBtnsExisted.includes(false)) {
                            throw '「按钮」不存在，请刷新后重试';
                        }
                        // 1、删除旧有的
                        return [4 /*yield*/, common.sql("DELETE FROM " + tableNames.auth_btns + " WHERE role_id = '" + role_id + "'")];
                    case 5:
                        // 1、删除旧有的
                        _b.sent();
                        // 2、插入新的「按钮权限」
                        return [4 /*yield*/, Promise.all(btns.map(function (btn_id) { return __awaiter(_this, void 0, void 0, function () {
                                var create_sql;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            create_sql = common.sql_add('auth_btns', [
                                                'btn_id',
                                                'role_id'
                                            ], {
                                                btn_id: btn_id,
                                                role_id: role_id
                                            });
                                            return [4 /*yield*/, common.sql(create_sql.sql)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 6:
                        // 2、插入新的「按钮权限」
                        _b.sent();
                        return [4 /*yield*/, common.sql("select page_id from " + tableNames.auth_pages + " where role_id = '" + role_id + "'")];
                    case 7:
                        findAuthPage$ = _b.sent();
                        if (!findAuthPage$.ok) {
                            throw '查询「页面权限」时发生错误';
                        }
                        return [4 /*yield*/, Promise.all(findAuthPage$.result.map(function (authPage) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as page_id, code, name, remark from " + tableNames.pages + " where _id = '" + authPage.page_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, !!find$.ok ? find$.result[0] : []];
                                    }
                                });
                            }); }))];
                    case 8:
                        pages$ = _b.sent();
                        return [4 /*yield*/, common.sql("select btn_id from " + tableNames.auth_btns + " where role_id = '" + role_id + "'")];
                    case 9:
                        findAuthBtns$ = _b.sent();
                        if (!findAuthBtns$.ok) {
                            throw '查询「按钮权限」时发生错误';
                        }
                        return [4 /*yield*/, Promise.all(findAuthBtns$.result.map(function (authBtn) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as btn_id, code, name, remark from " + tableNames.btns + " where _id = '" + authBtn.btn_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, !!find$.ok ? find$.result[0] : []];
                                    }
                                });
                            }); }))];
                    case 10:
                        btns$ = _b.sent();
                        return [2 /*return*/, common.back({
                                pages: pages$,
                                btns: btns$
                            })];
                }
            });
        });
    };
    /**
     * @description
     * 查询一个「角色」底下的「页面」、「按钮」
     *
     * pages: page_id[ ]
     */
    RoleCtrl.prototype.finPagesBtns = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, tableNames, role_id, findAuthPage$, pages$, findAuthBtns$, btns$;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common = ctx.service.common;
                        tableNames = common.helpers.constants.tableNames;
                        role_id = ctx.query.role_id;
                        return [4 /*yield*/, common.sql("select page_id from " + tableNames.auth_pages + " where role_id = '" + role_id + "'")];
                    case 1:
                        findAuthPage$ = _a.sent();
                        if (!findAuthPage$.ok) {
                            throw '查询「页面权限」时发生错误';
                        }
                        return [4 /*yield*/, Promise.all(findAuthPage$.result.map(function (authPage) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as page_id, code, name, remark from " + tableNames.pages + " where _id = '" + authPage.page_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, !!find$.ok ? find$.result[0] : []];
                                    }
                                });
                            }); }))];
                    case 2:
                        pages$ = _a.sent();
                        return [4 /*yield*/, common.sql("select btn_id from " + tableNames.auth_btns + " where role_id = '" + role_id + "'")];
                    case 3:
                        findAuthBtns$ = _a.sent();
                        if (!findAuthBtns$.ok) {
                            throw '查询「按钮权限」时发生错误';
                        }
                        return [4 /*yield*/, Promise.all(findAuthBtns$.result.map(function (authBtn) { return __awaiter(_this, void 0, void 0, function () {
                                var find$;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, common.sql("select _id as btn_id, code, name, remark from " + tableNames.btns + " where _id = '" + authBtn.btn_id + "'")];
                                        case 1:
                                            find$ = _a.sent();
                                            return [2 /*return*/, !!find$.ok ? find$.result[0] : []];
                                    }
                                });
                            }); }))];
                    case 4:
                        btns$ = _a.sent();
                        return [2 /*return*/, common.back({
                                pages: pages$,
                                btns: btns$
                            })];
                }
            });
        });
    };
    __decorate([
        isKeysEmpty({
            body: 'app_id,sys_id,name'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "createRole", null);
    __decorate([
        isKeysEmpty({
            query: 'app_id,sys_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "findRole", null);
    __decorate([
        isKeysEmpty({
            query: 'role_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "findRoleBase", null);
    __decorate([
        isKeysEmpty({
            query: 'role_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "deleteRole", null);
    __decorate([
        isKeysEmpty({
            body: 'role_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "updateBase", null);
    __decorate([
        isKeysEmpty({
            body: 'role_id,users'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "updateUsers", null);
    __decorate([
        isKeysEmpty({
            body: 'role_id,users'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "addUsers", null);
    __decorate([
        isKeysEmpty({
            query: 'auth_user_ids'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "deleteUser", null);
    __decorate([
        isKeysEmpty({
            query: 'role_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "findUsers", null);
    __decorate([
        isKeysEmpty({
            body: 'role_id,pages,btns'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "updatePagesBtns", null);
    __decorate([
        isKeysEmpty({
            query: 'role_id'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], RoleCtrl.prototype, "finPagesBtns", null);
    return RoleCtrl;
}());
exports.default = new RoleCtrl();
