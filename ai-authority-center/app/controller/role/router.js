"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var check_1 = require("../../middleware/check");
exports.default = (function (router, prefix) {
    /** =========== 角色 =========== */
    if (prefix === void 0) { prefix = '/apis/role'; }
    router.post("" + prefix, check_1.myCheck, index_1.default.createRole),
        router.get("" + prefix, check_1.myCheck, index_1.default.findRole),
        router.delete("" + prefix, index_1.default.deleteRole),
        router.get(prefix + "/base", index_1.default.findRoleBase),
        router.put(prefix + "/base", index_1.default.updateBase),
        router.get(prefix + "/users", index_1.default.findUsers),
        router.put(prefix + "/users", index_1.default.updateUsers),
        router.post(prefix + "/users", index_1.default.addUsers),
        router.delete(prefix + "/users", index_1.default.deleteUser),
        router.put(prefix + "/pages-btns", index_1.default.updatePagesBtns),
        router.get(prefix + "/pages-btns", index_1.default.finPagesBtns);
});
