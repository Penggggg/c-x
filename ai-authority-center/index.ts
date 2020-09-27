/// <reference path="./global.d.ts" />

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './app/router';
import services from './app/service';
import { mylog } from './app/middleware/log';
import { myErr } from './app/middleware/err';
import { getConfig } from './app/util/nacos';
import { sqlHelper } from './app/util/mysql';

const axios = require('axios');
const staticServe = require('koa-static');
const app = new Koa( );

app 
    .use( bodyParser( )) // post body
    .use( services( )) // 初始化服务实例
    .use( mylog ) // 日志
    .use( myErr ) // 全局错误捕抓日
    .use( router.routes( )) // 路由
    .use( router.allowedMethods( )) // 匹配方法错误：405
    .use( 
        staticServe( __dirname + "./dist" ) // 静态服务
    );


getConfig( ) // 拉取nacos配置
    .then( conf => {
        const { port, mysql } = conf.data;
        app.listen( port ); // 启动应用
        sqlHelper.init( mysql ); // 链接数据库
        console.log(`========= App start: ${port} ===========`)
    });