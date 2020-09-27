const axios = require('axios');
import { Context, Next } from 'koa';

const wpHost = `https://wpp.ai.cvte.com`;

/**
 * sw文件的代理
 */
export const swProxy2 = ({ }: SwProxy = { }) => {
    return async ( ctx: Context, next: Next ) => {
 
        if ( ctx.path === '/sw.js' ) {
            try {

                ctx.set('content-type', 'application/javascript; charset=utf-8');
                return ctx.body = `

                const t = ${Date.now( )};



                // 很想要 - 客户端代码、其他免登陆资源
                const reallyWant = [{"ver":1,"url":"/dist/build/index.20d4c0da.js","isIn":true},{"ver":1,"url":"/dist/build/vendor.d745c05b.js","isIn":true}]
                
                // 渐进式 - 区分 系统内资源、外链
                const graduals = [{"ver":1,"url":"/dist/build/img/bg-1.jpg","isIn":true},{"ver":1,"url":"/dist/build/img/bg-2.jpg","isIn":true},{"ver":1,"url":"/dist/build/img/cvte.png","isIn":true}]
                
                // 这里开始不用生成
                const version = 'wp-sw-v1';
                const versionKey = '@';
                
                // 刷新本地缓存
                const refreshCache = ( ) => new Promise( r => {
                    // 当前域名
                    const { origin } = location;
                    caches.open( version )
                        .then( vCache => {
                            vCache.keys( )
                                .then( reqArr => {
                
                                    // 先做处理：拿到版本、拿到url
                                    const cacheArr = reqArr.map(({ url }) => {
                                        const meta = url.split( versionKey ).filter( x => !!x );
                                        const ver = Number( meta.pop( ));
                                        const resource = meta.join( versionKey );
                                        return {
                                            ver,
                                            url: resource
                                        };
                                    });
                
                                    // 拿到已经不在配置列表、或版本不相等的缓存
                                    const delArr = cacheArr.filter( x => {
                                        const target = [ ...graduals, ...reallyWant ]
                                            .map( g => ({ 
                                                ...g, 
                                                url: g.isIn ? origin + g.url : g.url
                                            }))
                                            .find( c => c.url === x.url );
                                        return !target || ( !!target && target.ver !== x.ver );
                                    });
                
                                    delArr.length > 0 && console.log( '删除缓存：', delArr );
                
                                    Promise.all(
                                        delArr.map( del => vCache.delete( del.url + versionKey + del.ver ))
                                    ).then(( ) => r( ))
                                })
                        })
                })
                
                // 加载很想要的资源
                const getReallyWant = ( ) => new Promise( r => {
                    caches.open( version )
                        .then( vCache => {
                            Promise.all(
                                reallyWant.map( w => new Promise( r1 => {
                
                                    const cacheKey = w.url + versionKey + w.ver;
                                    vCache.match( cacheKey )
                                        .then( lastCache => {
                                            if ( !!lastCache ) return r1( );
                        
                                            console.log('加载资源：', w.url );
                                            fetch( w.url )
                                                .then( res => {
                                                    if ( res.ok ) {
                                                        vCache
                                                            .put( cacheKey, res.clone( ))
                                                            .then(( ) => r1( ))
                                                    } else {
                                                        r1( )
                                                    }
                                                })  
                                        })
                                }))
                            ).then(( ) => r( ))
                        })
                    
                })
                
                this.addEventListener('install', e => {
                    this.skipWaiting( );
                    e.waitUntil(
                        Promise.all([ ])
                    );
                });
                
                this.addEventListener('activate', e => {
                    console.log('sw activate');
                    e.waitUntil(
                        Promise.all([
                            clients.claim( ),
                            // 根据列表/版本，删除本地无用资源
                            refreshCache( ),
                            // 加载 reallywant
                            getReallyWant( )
                        ])
                    );
                });
                
                this.addEventListener('fetch', e => {
                
                    const { origin } = location;
                    const { url, method } = e.request;
                
                    const resource = [ ...graduals, ...reallyWant ]
                        .map( g => ({ 
                            ...g, 
                            url: g.isIn ? origin + g.url : g.url
                        }))
                        .find( g => g.url === url );
                
                    !!resource && console.log('【发起请求】', url );
                
                    if ( !!resource && method.toUpperCase( ) === 'GET' ) {
                
                        const cacheKey = url + versionKey + resource.ver;
                        e.respondWith(
                            caches.open( version )
                                .then( vCache => vCache.match( cacheKey ))
                                .then( reqCahe => {
                
                                    !!reqCahe && console.log('【命中】', cacheKey );
                                    if ( !!reqCahe ) return reqCahe;
                                    return fetch( e.request )
                                        .then( res => {
                                            caches
                                                .open( version )
                                                .then( vCache => 
                                                    vCache.put( cacheKey, res.clone( ))
                                                )
                                            return res.clone( );
                                        })
                                })
                        );
                    }
                })
                        ;
                            
                `;
                
            } catch ( e ) { ctx.body = 'get sw error' }
        }      
        await next( );
    }
}

type SwProxy = { }