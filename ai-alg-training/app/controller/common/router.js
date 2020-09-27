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
var aiUtil = __importStar(require("@cvte/ai-node-util"));
var index_1 = __importDefault(require("./index"));
var nacosConf = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../../../config/nacos.json'), {
    encoding: 'utf8'
}));
exports.default = (function (router, prefix) {
    if (prefix === void 0) { prefix = '/apis/common'; }
    var hosts = nacosConf.hosts, ssoNext = nacosConf.ssoNext, authCookie = nacosConf.authCookie;
    router.get(prefix + "/ai-login", aiUtil.aiLogin.code2Session(hosts.target + "/login")),
        router.get(prefix + "/ai-logout", aiUtil.aiLogin.logout({ ssoNext: ssoNext, cookieName: authCookie, logoutUrl: hosts.target + "/logout" })),
        router.get(prefix + "/role", index_1.default.getRole),
        router.post(prefix + "/role", index_1.default.setRole),
        router.get(prefix + "/hehe", index_1.default.test),
        router.get(prefix + "/org/dimension", index_1.default.orgDimension),
        router.get(prefix + "/org/tree", index_1.default.orgTree),
        router.get(prefix + "/org/users", index_1.default.orgUser);
});
