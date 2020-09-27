
import * as fs from 'fs';
import * as path from 'path';

export default options => {
    return async ( ctx, next ) => {

        if ( ctx.url === '/test' ) {
            return await next( );
        }

        const isMobile = ( ) => {
            const userAgentInfo = ctx.get('user-agent');
            if ( !!userAgentInfo.match(/AppleWebKit.*Mobile.*/) || !!userAgentInfo.match(/AppleWebKit/) ) {
                const temp = userAgentInfo.toLowerCase();
                if ( temp.indexOf('android') > -1 || temp.indexOf('iphone') > -1
                    || temp.indexOf('ipad') > -1 ||  temp.indexOf('windows phone') > -1
                    || temp.indexOf('blackberry') > -1 ||  temp.indexOf('hp-tablet') > -1
                    || temp.indexOf('symbian') > -1 ||  temp.indexOf('phone') > -1
                ) {
                    return true;
                }
            }
            return false;
        };
        if ( isMobile( )) {
            await next( );
        } else {
            ctx.body = fs.readFileSync( path.join( __dirname, '../web/ua-error.html'), 'utf-8');
        }
    };
};