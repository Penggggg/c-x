import { Context, Next } from 'koa';
import querystring from 'querystring';

/**
 * 日志中间件
 */
export const mylog = async ( ctx: Context, next: Next ) => {

    const start = new Date( );
    const { path, method, query, header } = ctx;
    const { body } = ctx.request;

    const summary0 = `
        ================= ${start.toLocaleString( )} =================
    `;
    const summary1 = `
        ${method.toLocaleUpperCase( )}: ${path}
    `;
    const summary2 = `
        Query: ${ JSON.stringify( query || { })}
    `;
    const summary3 = `
        Body: ${ JSON.stringify( body || { })}
    `;
    const summary4 = `
        Header: ${ JSON.stringify( header || { })}
    `;

    await next( );

    const end = new Date( );

    const summary5 = `
        Time: ${start.getTime( )}  ${end.getTime( )} 
    `;
    const summary6 = `
        Used: ${end.getTime( ) - start.getTime( )}ms
    `;

    const end0 = `
        Status: ${ctx.status}
    `;
    const end1 = `
        Result: ${typeof ctx.body === 'object' ? JSON.stringify( ctx.body ) : ctx.body}
    `;
    const end2 = `
        ================= End =================
    `;


    // 修改log颜色
    console.log('\x1b[35m\x1b[1m');
    console.log( summary0 );

    // 修改log颜色
    console.log('\x1b[32m\x1b[1m');
    console.log( summary1 );
    console.log( summary2 );
    console.log( summary3 );
    console.log( summary4 );
    console.log( summary5 );
    console.log( summary6 );

    // 修改log颜色
    console.log('\x1b[33m\x1b[1m');
    console.log( end0 );

    // 修改log颜色
    console.log('\x1b[32m\x1b[1m');
    console.log( end1 );

    // 修改log颜色
    console.log('\x1b[35m\x1b[1m');
    console.log( end2 );
};