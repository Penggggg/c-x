import { Context } from 'egg';

/**
 * @description
 * 如果是想去体征设备入口页面，
 * 需要带上是否关注参数后继续走
 * */
export default ( ) => {
    return async (ctx: Context, next) => {
        if ( ctx.path.includes('/bodysign/device-bind-check')) {

            const { sc, dn } = ctx.query;
            const { host, wmp } = ctx.app.config
            const openid = await ctx.service.jwt.index.getItem('account.openid');

            // 微信相关：是否已经关注
            const userInfo = await ctx.service.wechat.index.getUserInfo( openid );
            // 是否已经关注公众号
            const isSubscribe = !!Number( userInfo.data.subscribe );

            //日志
            ctx.logger.info(`【设备扫码啦】openid:  ${openid}，微信数据：${userInfo.data.subscribe}，回调：/body-sign/bind-guide?sc=${sc ||'xicoo'}&dn=${dn}&active=1&f=${isSubscribe ? 1 : 0}`);
            ctx.logger.info(`!!!!!!!!${ctx.url}`);
            return ctx.redirect(`/body-sign/bind-guide?sc=${sc || 'xicoo'}&dn=${dn}&active=1&f=${isSubscribe ? 1 : 0}`);

        } else {
            await next( );
        }
    };
  };
