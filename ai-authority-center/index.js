"use strict";
/// <reference path="./global.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = __importDefault(require("koa"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var router_1 = __importDefault(require("./app/router"));
var service_1 = __importDefault(require("./app/service"));
var log_1 = require("./app/middleware/log");
var err_1 = require("./app/middleware/err");
var nacos_1 = require("./app/util/nacos");
var mysql_1 = require("./app/util/mysql");
var axios = require('axios');
var staticServe = require('koa-static');
var app = new koa_1.default();
app
    .use(koa_bodyparser_1.default()) // post body
    .use(service_1.default()) // 初始化服务实例
    .use(log_1.mylog) // 日志
    .use(err_1.myErr) // 全局错误捕抓日
    .use(router_1.default.routes()) // 路由
    .use(router_1.default.allowedMethods()) // 匹配方法错误：405
    .use(staticServe(__dirname + "./dist") // 静态服务
);
nacos_1.getConfig() // 拉取nacos配置
    .then(function (conf) {
    var _a = conf.data, port = _a.port, mysql = _a.mysql;
    app.listen(port); // 启动应用
    mysql_1.sqlHelper.init(mysql); // 链接数据库
    console.log("========= App start: " + port + " ===========");
});
