"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
exports.default = (function (router, prefix) {
    if (prefix === void 0) { prefix = '/apis/sys'; }
    router.post("" + prefix, index_1.default.create);
});
