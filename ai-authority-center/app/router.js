"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var koa_router_1 = __importDefault(require("koa-router"));
var router = new koa_router_1.default();
fs_1.default.readdirSync(path_1.default.join(__dirname + '/controller'))
    .map(function (moduleName) {
    var modulePath = "" + path_1.default.join(__dirname, "/controller/" + moduleName + "/router");
    if (fs_1.default.existsSync(modulePath + ".js")) {
        Promise.resolve().then(function () { return __importStar(require(modulePath)); }).then(function (m) {
            // 注册node路由
            !!m.default && typeof m.default === 'function' && m.default(router);
        });
    }
});
exports.default = router;
