const request = require('request');
import { Context } from 'koa';

/** 获取网络图片 */
export const networkImg = async ( ctx: Context ) => {
    const { img } = ctx.query;
    
    if ( !img ) {
        return ctx.body = 'img in query is empty.'
    }

    const req = await request({
        url: img,
        encoding: null
    })
    return ctx.body = req ;
}
