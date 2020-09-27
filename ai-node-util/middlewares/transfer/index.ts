import fs from 'fs';
import FormData from 'form-data';
import querystring from 'querystring'
import { Context, Next } from 'koa';

const axios = require('axios');
const isDev = (process.env.NODE_ENV || '').toLocaleLowerCase( ) === 'dev';

type TTransfer = { 
    reg: string,  // url头部带上该字符、匹配上了，才触发转发
    targetUrl?: string,  // 后台地址
    mockUrl?: string, // mock地址
    cookies?: string // 额外添加的cookies
    ctxCookiesKey?: string // 到ctx中读取cookies，用于和登陆sdk配合
    cookies2Header?: string // 从cookies中读取数据，再放到头部中，如：'key1,key2'
    meta?: boolean // 是否返回原始的数据，而不是data.data
}

export const aiTransfer = ({ reg, targetUrl, mockUrl, cookies, ctxCookiesKey, cookies2Header = '', meta = false }: TTransfer ) => {
    return async ( ctx: Context, next: Next ) => {

        const { path, method, query, header } = ctx;
        const { body } = ctx.request;
        const files: any = (ctx as any).request.files || ((ctx as any).request.body || { }).files;

        const allCookies = (cookies || '') + ( header.cookie || '' ) + ';' + (!!ctxCookiesKey ? `${ctxCookiesKey}=${ ctx.cookies.get( ctxCookiesKey ) || ctx[ ctxCookiesKey ]}` : '')
        
        const _cookies2Header = cookies2Header
            .split(',')
            .filter( x => !!x )
            .reduce(( pre, cur ) => ({
                ...pre,
                [ cur ]: ctx.cookies.get( cur ) || ''
            }), { });

        const headers = {
            ...header,
            ..._cookies2Header,
            cookie: allCookies
        }

        if ( !path.startsWith( reg )) {
            await next( );
        } else {

            delete headers['host'];
            const url = `${ mockUrl || targetUrl }/${path.split('/').slice( 2 ).join('/')}?${querystring.stringify( query || { })}`
            let reqData = {
                url,
                method,
                headers,
                data: body,
            };

            /** 文件转发 */
            if ( !!files ) {
                
                const form = new FormData( );

                /** 单个文件 */
                if ( !Array.isArray( files ) && Object.keys( files ).length > 0 ) {

                    // 先处理file类型
                    Object.keys( files )
                        .map( key => {
                            const file = files[ key ];
                            console.log(`文件：`, key )
                            form.append( 
                                key, 
                                (Buffer as any).from( fs.readFileSync( file.path ), 'binary' ),
                                file.name 
                            )
                        });

                    console.log(`检查：`, body )

                    // 如果传文件过程中，还有其他非files的key-value的字段数据
                    !!body.fields && Object.keys( body.fields )
                        .map( key => {
                            const target = body.fields[ key ];
                            if ( typeof target === 'string' || typeof target === 'number' ) {
                                console.log(`其他字段：`, key )
                                form.append( key, target );
                            }
                        });

                    Object.keys( body )
                        .map( key => {
                            const target = body[ key ];
                            if ( typeof target === 'string' || typeof target === 'number' ) {
                                console.log(`其他字段：`, key )
                                form.append( key, target );
                            }
                        });

                /** 多个文件 */
                } else {

                }

                console.log(`
                    ================= 文件转发 =================
                `);

                console.log( form );

                /** 文件转发 */
                const req = await axios.post( url, form, {
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    headers: {
                        ...headers,
                        ...form.getHeaders( ),
                        'content-length': form.getLengthSync( )
                    }
                });

                const { status, data, msg, message } = req.data;
                return ctx.body = {
                    data,
                    message: msg || message,
                    status: status === 200 || status === 0 || status === '200' || status === '0' ? 200 : status
                }

            /** 接口口转发 */
            } else {
                if ( isDev ) {
                    console.log(`
                    ================= Transfer Start =================
                    `);
                    console.log( reqData )
                }
                
                !!isDev && console.log( reqData )

                // 转发
                const req = await axios( reqData );
        
                if ( isDev ) {
                    console.log(`
                    ================= Transfer Result =================
                    `);
                    console.log( req.data )
                }

                if ( !!mockUrl ) {
                    return ctx.body = {
                        status: 200,
                        data: req.data.data
                    }
                } else if ( !!targetUrl ) {
                    const { status, data, msg, message } = req.data;
                    return ctx.body = {
                        data: meta ? req.data : data,
                        message: msg || message,
                        status: status === 200 || status === 0 || status === '200' || status === '0' ? 200 : status
                    }
                }
            }
        }

    }
}