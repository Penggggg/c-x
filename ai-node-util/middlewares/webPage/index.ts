import fs from 'fs';
import { Context, Next } from 'koa';

type TWebPage = {
    excludes: RegExp,
    htmlUrl: string
}

/**
 * 返回前端的页面
 */
export const aiWebPage = ({ excludes, htmlUrl }: TWebPage ) => {
    return async ( ctx: Context, next: Next ) => {
        if ( excludes.test( ctx.path )) {
            await next( );
        } else {
            ctx.response.type = 'html';
            ctx.body = fs.readFileSync( htmlUrl );
        }
    }
};