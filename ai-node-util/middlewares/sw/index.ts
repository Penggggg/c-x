const axios = require('axios');
import { Context, Next } from 'koa';

const wpHost = `https://wpp.ai.cvte.com`;

/**
 * sw文件的代理
 */
export const swProxy = ({ }: SwProxy = { }) => {
    return async ( ctx: Context, next: Next ) => {
 
        if ( ctx.path === '/sw.js' ) {
            try {
                // 性能平台
                const swFile = await axios({
                    method: 'get',
                    url: `${wpHost}/apis/sw/file?appId=${ctx.query.appId}`
                });
                ctx.set('content-type', 'application/javascript; charset=utf-8');
                return ctx.body = swFile.data;
                
            } catch ( e ) { ctx.body = 'get sw error' }
        }      
        await next( );
    }
}

type SwProxy = { }