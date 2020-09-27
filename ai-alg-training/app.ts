/// <reference path="./global.d.ts" />

import Koa from 'koa';
import path from 'path';
import koaBody from 'koa-body';
// import bodyParser from 'koa-bodyparser';
import * as aiUtil from '@cvte/ai-node-util';
import { aiLog, aiErr, aiTransfer, aiWebPage } from '@cvte/ai-node-util/middlewares';

import router from './app/router';
import services from './app/service';
import { getConfig } from './app/util/nacos';
import { TestLogin } from './app/middleware/test-login'; 

const staticServe = require('koa-static');
const app = new Koa( );

getConfig( ) // 拉取nacos配置
    .then( conf => {
        const { port, hosts, authCookie, ssoNext } = conf.data;

        app 
            // .use( bodyParser( )) // post body 
            .use( koaBody({
                formLimit:"5mb",
                jsonLimit:"5mb",
                textLimit:"5mb",
                multipart:true,
                    formidable:{
                        maxFieldsSize:100*1024*1024,
                    }
                }))
            .use( services( )) // 初始化服务实例
            .use( aiLog ) // 日志
            .use( aiErr ) // 全局错误捕抓日
            .use( staticServe( __dirname + "/" )) // 静态服务
            .use( 
                aiUtil.aiLogin.check({ // 统一登陆
                    ssoNext,
                    cookieName: authCookie,
                })
            ) 
            .use( 
                TestLogin( ) // 测试登陆
            ) 
            .use( 
                aiTransfer({ // 业务接口转发
                    reg: '/t-apis', 
                    targetUrl: hosts.target,
                    ctxCookiesKey: authCookie
                })
            )
            .use( 
                aiWebPage({
                    excludes: /^\/(apis|t-api|dist)/,
                    htmlUrl: path.join( __dirname, './dist/build/index.html' )
                })
            ) // 返回主页面 ( html )
            .use( router.routes( )) // 路由
            .use( router.allowedMethods( )) // 匹配方法错误：405
 
        app.listen( conf.data.port ); // 启动应用
        console.log(`========= App start: ${port}, NODE_ENV: ${process.env.NODE_ENV} ===========`);
    });