"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
exports.default = (function (router, prefix) {
    if (prefix === void 0) { prefix = '/apis/common'; }
    router.get(prefix + "/hehe", index_1.default.test),
        router.get(prefix + "/org/dimension", index_1.default.orgDimension),
        router.get(prefix + "/org/tree", index_1.default.orgTree),
        router.get(prefix + "/org/users", index_1.default.orgUser);
});
