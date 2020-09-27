"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require('webpack');
var webpackDev = require('webpack-dev-middleware');
var webpackConf = require('../../config/webpack.config');
var webpackHotMiddleware = require('koa-webpack-hot-middleware');
exports.setDevHot = function (app, isDev) {
    if (isDev === void 0) { isDev = String(process.env.NODE_ENV).startsWith('dev'); }
    // if ( !isDev ) { return; }
    // const compiler = webpack( webpackConf );
    // const devMiddleware = (compiler: any, opts?: any) => {
    //     const middleware = webpackDev(compiler, opts)
    //     return async (ctx: any, next: any) => {
    //         await middleware(ctx.req, {
    //             end: (content: any) => {
    //                 ctx.body = content
    //             },
    //             setHeader: (name: any, value: any) => {
    //                 ctx.set(name, value)
    //             }
    //         }, next)
    //     }
    // }
    // app.use( devMiddleware( compiler ));
    // app.use( webpackHotMiddleware( compiler, {
    //     noInfo: true
    // }))
};
