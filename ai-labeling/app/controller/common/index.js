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
var CommonCtrl = /** @class */ (function () {
    function CommonCtrl() {
    }
    CommonCtrl.prototype.test = function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var a;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.service.common.getJwt()];
                    case 1:
                        a = _a.sent();
                        return [2 /*return*/, ctx.service.common.back(a)];
                }
            });
        });
    };
    /**
     * @description
     * 组织架构纬度
     */
    CommonCtrl.prototype.orgDimension = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, hosts, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        common = ctx.service.common;
                        hosts = common.helpers.nacosConf.hosts;
                        _b = (_a = common).back;
                        return [4 /*yield*/, common.transfer({
                                url: hosts.org + "/admin/v1/org/dimension",
                            })];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * @description
     * 组织架构 树
     * query - dimensionId, 组织架构纬度id
     * */
    CommonCtrl.prototype.orgTree = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, hosts, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        common = ctx.service.common;
                        hosts = common.helpers.nacosConf.hosts;
                        _b = (_a = common).back;
                        return [4 /*yield*/, common.transfer({
                                params: __assign({}, ctx.query),
                                url: hosts.org + "/admin/v1/org/relation_tree",
                            })];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * @description
     * 组织架构 用户列表
     * query - orgId, 组织架构id
     * query - pageNum，分页
     * query - pageSize，分页
     * query - account，域账号
     * query - name，姓名
     * */
    CommonCtrl.prototype.orgUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var common, hosts, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        common = ctx.service.common;
                        hosts = common.helpers.nacosConf.hosts;
                        _b = (_a = common).back;
                        return [4 /*yield*/, common.transfer({
                                params: __assign({}, ctx.query),
                                url: hosts.org + "/admin/v1/user/role_user_unit",
                            })];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    /**
     * @description
     * 设置用户的角色
     */
    CommonCtrl.prototype.setRole = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            return __generator(this, function (_a) {
                role = ctx.request.body.role;
                ctx.cookies.set('role', String(role));
                return [2 /*return*/, ctx.service.common.back()];
            });
        });
    };
    /**
     * @description
     * 返回用户的角色
     */
    CommonCtrl.prototype.getRole = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            return __generator(this, function (_a) {
                role = ctx.cookies.get('role');
                return [2 /*return*/, ctx.service.common.back(!!role ? Number(role) : null)];
            });
        });
    };
    __decorate([
        isKeysEmpty({
            body: 'role'
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], CommonCtrl.prototype, "setRole", null);
    return CommonCtrl;
}());
exports.default = new CommonCtrl();