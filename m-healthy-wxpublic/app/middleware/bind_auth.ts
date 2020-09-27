import { Context } from 'egg';

/**
 * @description 
 * 如果是想去用户绑定页面
 * 需要校验是否已经绑定过了 
 * 已绑定的 就不需要了
 * */
export default ( ) => {
    return async (ctx: Context, next) => {

        if ( ctx.path === '/account/bind') {

            const { host, wmp } = ctx.app.config
            const openid = await ctx.service.jwt.index.getItem('account.openid');

            if ( !openid ) {
                await next( );
            } else {
                const checkReq = await ctx.service.account.index.getSystemUser( openid, wmp.appId )
                if ( checkReq.status === 200 && !!checkReq.data ) {
                    return ctx.redirect('/account/has-bind');
                } else {
                    await next( );
                }
            }
        } else {
            await next( );
        }
    };
  };
