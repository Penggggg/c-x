import { Context, Next } from 'koa';

/**
 * 测试环境的登陆
 */
export const TestLogin = ( ) => {
    return async ( ctx: Context, next: Next ) => {

        const reg = /^\/(apis|t-api)/;
        const isDev = (process.env.NODE_ENV || '').toLocaleLowerCase( ) === 'dev';
        if ( isDev && reg.test( ctx.path )) {
            const jwtStr = '281e0417-94ae-45a9-9187-6b592e9dcc1c';
            ctx['Session'] = jwtStr
            ctx.cookies.set('Session', jwtStr )
        }
        await next( );
    }
};