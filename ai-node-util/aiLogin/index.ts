const axios = require('axios');
import { Context, Next } from 'koa';
import { AiJwt } from '../aiJwt';

const defaultCookisName = 'ai-login';
const isDev = (process.env.NODE_ENV || '').toLocaleLowerCase( ) === 'dev';

/** 接入统一登陆的 Koa Controller */
const login = ( redirectUrl = '/', cookieName = defaultCookisName, maxAge = 24 * 60 * 60 * 1000 ) => {
    return async ( ctx: Context ) => {
        try {
            
            const { code } = ctx.query;
            const req = await axios({
                method: 'get',
                url: `https://ai.cvte.com/sso/cheack/checkCode?code=${code}`
            });
    
            const { resultCode, resultData } = req.data;
    
            if ( resultCode !== 0 ) { 
                return ctx.body = JSON.stringify( req.data );
            }
    
            console.log(`
                =============== ai login ============
            `)
            console.log( resultData.user_info );
    
            const token = await AiJwt.sign( resultData.user_info );

            ctx[ cookieName ] = token;
            ctx.cookies.set( cookieName, token, { maxAge });
            
            ctx.redirect( redirectUrl );
    
        } catch ( e ) {
            ctx.body = 'login error'
        }
    }
}

/** 检查是否有登陆的 Koa Middleware */
const check = ({ ssoNext, cookieName, whiteList = [ ], needCheck = !isDev }: TCheck ) => {
    return async ( ctx: Context, next: Next ) => {
        const isExited = ctx.cookies.get( cookieName ) || ctx[ cookieName ];
        const isInWhiteList = !![
            'sso',
            'login',
            'callback',
            'oauth',
            '.',
            ...whiteList
        ].find( x => ctx.url.toLocaleLowerCase( ).includes( x ));

        // 需要登陆
        if ( !isExited && !isInWhiteList && needCheck ) {
            console.log(`
                =============== ai login checking: ${ !!isExited } ============
            `)
            ctx.redirect(`https://ai.cvte.com/oauth2/#/login?next=${ssoNext}`)
        } else {
            await next( );
        }
    }
}

/** 接入业务系统登陆的 Koa Controller */
const code2Session = ( loginUrl: string, maxAge = 24 * 60 * 60 * 1000 ) => {
    return async ( ctx: Context ) => {
        try {

            const { code } = ctx.query;

            console.log(`
                ============= 登陆中 =============
            `);
            console.log(`loginUrl: ${loginUrl} code: ${code}`)
            
            const res = await axios({
                method: 'post',
                url: loginUrl,
                data: {
                    code
                }
            });

            res.headers['set-cookie']
                .map(( x: string ) => `${x.split(';')[ 0 ]}`)
                .map(( x: string ) => {
                    const [ key, val ] = x.split('=');
                    ctx.cookies.set( key, val, { maxAge })
                });

            ctx.redirect('/');

        } catch ( e ) {
            ctx.body = 'login error'
        }
    }
}

/** 业务系统、当前系统的登出 */
const logout = ({ ssoNext, cookieName, logoutUrl }: TLogout) => {
    return async ( ctx: Context ) => {

        const cookie = ctx.cookies.get( cookieName )
    
        console.log(`
            =============== ai logout ============
        `)
        
        // 先进行业务系统的退出
        try {
            const reqData = {
                url: logoutUrl,
                headers: {
                    Cookie: `${cookieName}=${cookie}`
                }
            }
            console.log( reqData );

            const res = await axios( reqData );

            console.log(`
                =============== bussiness logout ============
            `)
            console.log( res.data );
        } catch ( e ) { }

        // node再清除cookie
        ctx.cookies.set( cookieName, '', { maxAge: 10 });

        // 重定向
        ctx.redirect(`https://ai.cvte.com/oauth2/#/login?next=${ssoNext}&action=reLogin`)
    }
}


type TCheck = {
    ssoNext: string, 
    cookieName: string,
    needCheck?: boolean,
    whiteList?: string[ ]
}

type TLogout = {
    ssoNext: string, 
    cookieName: string,
    logoutUrl: string
}


export const aiLogin = {
    login,
    check,
    logout,
    code2Session
}
