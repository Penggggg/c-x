"use strict";
/// <reference path="./global.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var path_1 = __importDefault(require("path"));
var koa2_cors_1 = __importDefault(require("koa2-cors"));
var koa_body_1 = __importDefault(require("koa-body"));
var middlewares_1 = require("@cvte/ai-node-util/middlewares");
var router_1 = __importDefault(require("./app/router"));
var service_1 = __importDefault(require("./app/service"));
var nacos_1 = require("./app/util/nacos");
var staticServe = require('koa-static');
var app = new koa_1.default();
nacos_1.getConfig() // 拉取nacos配置
    .then(function (conf) {
    var _a = conf.data, port = _a.port, hosts = _a.hosts, authCookie = _a.authCookie;
    app
        .use(koa_body_1.default({
        formLimit: '5mb',
        jsonLimit: '5mb',
        textLimit: '5mb',
        strict: false,
        multipart: true,
        formidable: {
            maxFieldsSize: 100 * 1024 * 1024,
        }
    }))
        .use(service_1.default()) // 初始化服务实例
        .use(koa2_cors_1.default())
        .use(middlewares_1.aiLog) // 日志
        .use(middlewares_1.aiErr) // 全局错误捕抓日
        .use(staticServe(__dirname + "/", {
        maxage: 10 * 24 * 60 * 60
    }))
        .use(middlewares_1.aiTransfer({
        reg: '/t-apis',
        targetUrl: hosts.dev,
    }))
        .use(middlewares_1.aiTransfer({
        reg: '/t-nlp',
        meta: true,
        targetUrl: hosts.nlp
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
