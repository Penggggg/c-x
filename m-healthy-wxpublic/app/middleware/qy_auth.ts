import { Context } from 'egg';

const whiteList = [
  '/wx_o',
  '/clear_cookies',
  '/api/common/wx-follow',
  '/api/common/wxpay-notify',
  '/api/order/notify',
  '/api/record/download',
  '/body-sign/bind-guide'
];

/**
 * @description
 * 登陆：微信授权
 * redirect到wmp，并获取openid
 * 可配置白名单
 */
export default ( ) => {
    return async (ctx: Context, next) => {

      const wmpConfig = ctx.app.config.wmp;
      const authToken = ctx.cookies.get('auth');

      if ( wmpConfig.qyOauth || wmpConfig.wxOauth ) {

        if ( whiteList.some( x => ctx.url.indexOf( x ) !== -1 ) || ctx.request.url === '/' ) {
          await next( );
        } else {
          if ( !authToken ) {
            const redirectUrl = `${wmpConfig.local}/wx_o?n=${encodeURIComponent(ctx.url)}`;
            ctx.redirect(`${wmpConfig.host}/${wmpConfig.appId}/oauth?url=${encodeURIComponent(redirectUrl)}&type=1`);
          } else {
            await next( );
          }
        }
      } else {
        /** mock */
        await ctx.service.jwt.index.setItem( 'account.openid', 'o8t9E0UQ_V7xO2_8aKQLfKwXW6Gg' );
        ctx.cookies.set('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7InN5c2lkIjoiIiwib3BlbmlkIjoibzh0OUUwVVFfVjd4TzJfOGFLUUxmS3dYVzZHZyIsIm5pY2tuYW1lIjoi7oGU7pSg7oCZ7pSiIiwic2V4IjoxLCJsYW5ndWFnZSI6IiIsImNpdHkiOiIiLCJwcm92aW5jZSI6IiIsImNvdW50cnkiOiIiLCJoZWFkaW1ndXJsIjoiaHR0cDovL3RoaXJkd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL1JmWERHendOdWRLdUM4UUhQMXNpYzg2aWE1UFlCSDhRcmNuaWJ3b1E4eGhkU0FmNG5pYmlhMUZ4RzI1SDlpY3IxejBwUmpLZWd2ZFZpYTNRNVlxMGQ1dXNmWHpydy8xMzIiLCJwcml2aWxlZ2UiOltdfSwiaWF0IjoxNTM3MzI5NjMwfQ.465YuWVk2nrxGUIfjtSMajZ25vYuSr5C8UOPLoqMaiI');
        await next( );
      }

    };
  };
