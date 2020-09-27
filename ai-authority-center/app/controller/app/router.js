"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var check_1 = require("../../middleware/check");
exports.default = (function (router, prefix) {
    if (prefix === void 0) { prefix = '/apis/app'; }
    /** ============ 应用 ============= */
    router.post("" + prefix, check_1.myCheck, index_1.default.create),
        /** ============ 页面模块 ============= */
        router.post(prefix + "/page-module", check_1.myCheck, index_1.default.createPageModule),
        router.put(prefix + "/page-module", index_1.default.upadtePageModule),
        router.get(prefix + "/page-module", check_1.myCheck, index_1.default.findPageModule),
        router.delete(prefix + "/page-module", index_1.default.deletePageModule),
        /** ============ 页面 ============= */
        router.post(prefix + "/page", check_1.myCheck, index_1.default.createPage),
        router.put(prefix + "/page", index_1.default.upadtePage),
        router.delete(prefix + "/page", check_1.myCheck, index_1.default.deletePage),
        router.get(prefix + "/page", check_1.myCheck, index_1.default.findPages),
        /** ============ 按钮 ============= */
        router.post(prefix + "/btn", index_1.default.createBtn),
        router.delete(prefix + "/btn", index_1.default.deleteBtn),
        router.put(prefix + "/btn", index_1.default.upadteBtn);
});
