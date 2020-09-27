import { Context, Next } from 'koa';

/**
 * 测试环境的登陆
 */
export const TestLogin = ( ) => {
    return async ( ctx: Context, next: Next ) => {

        const reg = /^\/(apis|t-api)/;
        const isDev = (process.env.NODE_ENV || '').toLocaleLowerCase( ) === 'dev';
        if ( isDev && reg.test( ctx.path )) {
            const jwtStr = 'jXZeaOQVkBR4EhImJU2ASsz3Wd60YK';
            ctx['ai_label_task'] = jwtStr
            ctx.cookies.set('ai_label_task', jwtStr )
        }
        await next( );
    }
};