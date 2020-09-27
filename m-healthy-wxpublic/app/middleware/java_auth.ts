import { Context } from 'egg';
import * as querystring from "querystring";

const whiteList = [
    '/api',
    '/wx_o',
    '/clear_cookies',
    '/account/bind',
    '/account/has-bind',
    '/account/register',
    '/body-sign/account-bind'
];

/**
 * @description
 * 登陆：校验后台用户绑定，生成jwt
 */
export default ( ) => {
    return async (ctx: Context, next) => {

        const javaHeader = 'x-auth-token';
        const maxAge = 24 * 60 * 60 * 1000;
        const wmpConfig = ctx.app.config.wmp;
        const authToken = ctx.cookies.get( javaHeader );

        const getJWT = async ( url, data: object, headers ) => {
            return await ctx.curl( url, {
                data,
                headers,
                method: 'POST',
                dataType: 'json',
                contentType: 'json',
            });
        }

        // 白名单
        if ( whiteList.some( x => ctx.url.indexOf( x ) !== -1 ) || ctx.request.url === '/' ) {
            await next( );

        // 如果是已经进来过这个middlware了 那就next，否则引起死循环
        } else if ( !!ctx.query.n_next ) {
            await next( );

        // 登陆
        } else if ( !authToken ) {

            /** 这里应该用系统用户id生成jwt */
            const { wmp } = ctx.app.config;
            const iacToken = await ctx.service.iac.index.getToken( );
            const openid = await ctx.service.jwt.index.getItem('account.openid');

            if ( !openid ) {
                return ctx.redirect(`/account/bind?n=${ctx.url}`);
            }

            const systemUser = await ctx.service.account.index.getSystemUser( openid, wmp.appId )

            ctx.logger.info(`.....【后台系统登陆】${JSON.stringify( systemUser )}`);

            if ( !!systemUser.data && systemUser.status === 200 ) {

                const jwtData = await getJWT(`${ctx.app.config.host.jwtServer}/csb-jwt/v1/token`, {
                    sub: systemUser.data.id,
                    timeout: maxAge,
                    map: {
                        openId: openid,
                        account: systemUser.data.id,
                        appId: ctx.app.config.wmp.appId,
                    },
                    }, {
                    'x-iac-token': iacToken,
                });

                ctx.cookies.set( javaHeader, jwtData.data.data, { maxAge });
                await ctx.service.jwt.index.setItem( 'account.sysid', systemUser.data.id );
                
            } else {

                if ( ctx.url.indexOf('/body-sign/bind-guide') !== -1 ) {

                    const query = { ...ctx.query };
                    return ctx.redirect(`/body-sign/bind-guide?${querystring.stringify( query )}&active=1&n_next=1`);

                } else if ( ctx.url.includes('/activity/gys')) {
                
                    const query = { ...ctx.query };
                    delete query['u'];
                    return ctx.redirect(`/activity/gys?${querystring.stringify( query )}&u=0&n_next=1`);
                }

                return ctx.redirect(`/account/bind?n=${ctx.url}`);
            }

            const query = { ...ctx.query };
            delete query['u'];
            return ctx.redirect(`${ctx.path}?${querystring.stringify( query )}&u=1&n_next=1`);
        
        // next
        } else if ( !!authToken ) {
            const query = { ...ctx.query };
            delete query['u'];
            return ctx.redirect(`${ctx.path}?${querystring.stringify( query )}&u=1&n_next=1`);
        } 
    };
  };
