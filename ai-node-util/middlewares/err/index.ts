import { Context, Next } from 'koa';

/**
 * 全局错误中间件
 */
export const aiErr = async ( ctx: Context, next: Next ) => {
    try {
        await next( );
    } catch ( e ) {
        console.log( e );
        return ctx.body = {
            status: 500,
            message: `${typeof e === 'object' ? JSON.stringify( e ) : e}`
        };
    }
}