"use strict";
/// <reference path="./global.d.ts" />
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
var koa_1 = __importDefault(require("koa"));
var path_1 = __importDefault(require("path"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var aiUtil = __importStar(require("@cvte/ai-node-util"));
var middlewares_1 = require("@cvte/ai-node-util/middlewares");
var router_1 = __importDefault(require("./app/router"));
var service_1 = __importDefault(require("./app/service"));
var nacos_1 = require("./app/util/nacos");
var test_login_1 = require("./app/middleware/test-login");
var staticServe = require('koa-static');
var app = new koa_1.default();
nacos_1.getConfig() // 拉取nacos配
    .then(function (conf) {
    var _a = conf.data, port = _a.port, hosts = _a.hosts, authCookie = _a.authCookie, ssoNext = _a.ssoNext;
    app
        .use(koa_bodyparser_1.default()) // post body
        .use(service_1.default()) // 初始化服务实例
        .use(middlewares_1.aiLog) // 日志
        .use(middlewares_1.aiErr) // 全局错误捕抓日
        .use(staticServe(__dirname + "/")) // 静态服务
        .use(aiUtil.aiLogin.check({
        ssoNext: ssoNext,
        cookieName: authCookie,
    }))
        .use(test_login_1.TestLogin()) // 测试登陆
        .use(middlewares_1.swProxy()) // sw代理
        // .use( swProxy2( ))
        .use(middlewares_1.aiTransfer({
        reg: '/t-apis',
        targetUrl: hosts.target,
        ctxCookiesKey: authCookie
    }))
        .use(middlewares_1.aiWebPage({
        excludes: /^\/(apis|t-api|dist)/,
        htmlUrl: path_1.default.join(__dirname, './dist/build/index.html')
    }))
        .use(router_1.default.routes()) // 路由
        .use(router_1.default.allowedMethods()); // 匹配方法错误：405
    app.listen(conf.data.port); // 启动应用
    console.log("========= App start: " + port + ", NODE_ENV: " + process.env.NODE_ENV + " ===========");
});
