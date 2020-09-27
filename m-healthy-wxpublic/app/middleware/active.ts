import { Context } from 'egg';

/**
 * @description
 * 活动页面专用中间件
 * */
export default ( ) => {
    return async (ctx: Context, next) => {

        /**
         * @description
         * 如果是想去「供应商领券页」/active-check/gys
         * 需要校验：是否已关注公众号、是否已经激活
         */
        if ( ctx.path.includes('/active-check/gys')) {

            const { cid } = ctx.query;
            const { host, wmp } = ctx.app.config
            const openid = await ctx.service.jwt.index.getItem('account.openid');

            // 微信相关：是否已经关注
            const userInfo = await ctx.service.wechat.index.getUserInfo( openid );
            // 是否已经关注公众号
            const isSubscribe = !!Number( userInfo.data.subscribe );

            try {
                /** 检查此用户、此卡：是否已激活、已预约 */
                const cardInfo = await ctx.service.account.index.getHealcardInfo( openid, cid );
                const { isActive, isUsed } = cardInfo.data;

                //日志
                return ctx.redirect(`/activity/gys?f=${isSubscribe ? 1 : 0}&a=${isActive}&r=${isUsed}&cid=${cid}`);
            } catch ( e ) {
                // 当前用户没有任何可用的健康卡
                return ctx.redirect(`/activity/gys?e=1&f=${isSubscribe ? 1 : 0}&a=0&r=0&cid=${cid}`);
            }
        } else {
            await next( );
        }
    };
  };
