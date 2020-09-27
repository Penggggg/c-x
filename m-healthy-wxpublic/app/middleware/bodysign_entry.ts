import { Context } from 'egg';
import * as querystring from 'querystring';

/** 体征数据详情页 - 分流  */
export default ( ) => {
    return async (ctx: Context, next) => {
        if ( ctx.path.includes('/bs')) {
            const { t } = ctx.query;
            const query = `${querystring.stringify(ctx.request.query)}`;

            // 血压
            if ( t === '1' ) {
                return ctx.redirect(`/body-sign/xueya-show?${query}`);

            // 血糖
            } else if ( t === '3' ) {
                return ctx.redirect(`/body-sign/xuetang-show?${query}`);

            // 血氧
            } else if ( t === '2' ) {
                return ctx.body = '公众号暂未开放血氧数据'

            }
        } else {
            await next( );
        }
    };
  };
