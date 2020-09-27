const axios = require('axios');
import querystring from 'querystring'
import { Context, Next } from 'koa';

type TTestLogin = { 

}

/**
 * 测试环境的登陆
 */
export const TestLogin = ( ) => {
    return async ( ctx: Context, next: Next ) => {

        const reg = /^\/(apis|t-api)/;
        const isDev = (process.env.NODE_ENV || '').toLocaleLowerCase( ) === 'dev';
        if ( isDev && reg.test( ctx.path )) {
            const jwtStr = 'WzBukqyl54HitXEmJ0DC9RecKfY8Gs';
            ctx['ai_train'] = jwtStr
            ctx.cookies.set('ai_train', jwtStr )
        }
        await next( );
    }
};