import Koa from 'koa';
const webpack = require('webpack')
const webpackDev  = require('webpack-dev-middleware')
const webpackConf = require('../../config/webpack.config');
const webpackHotMiddleware = require('koa-webpack-hot-middleware');


export const setDevHot = ( app: Koa, isDev =  String( process.env.NODE_ENV ).startsWith('dev')) => {
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
}