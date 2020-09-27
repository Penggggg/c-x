import * as fs from 'fs';
import * as path from 'path';
import * as querystring from 'querystring';
import { Context, Application } from 'egg';
import { transfer as t1 } from '../controller/account/router';
import { transfer as t2 } from '../controller/common/router';
import { transfer as t3 } from '../controller/booking/router';
import { transfer as t4 } from '../controller/record/router';
import { transfer as t5 } from '../controller/healthcard/router';
import { transfer as t6 } from '../controller/healthCheck/router';
import { transfer as t7 } from '../controller/myOrder/router';
import { transfer as t8 } from '../controller/bodySign/router';
import { transfer as t9 } from '../controller/evaluation/router';
import { transfer as t10 } from '../controller/appointment/router';
import { transfer as t11 } from '../controller/healthService/router';
import { transfer as t12 } from '../controller/questionnaire/router';

// const basePath = path.join( __dirname, '../controller/');

// fs.readdirSync( basePath ).map( item => {
//     const filePath = `${basePath}${item}/router.js`;
//     if ( fs.existsSync(`${filePath}`)) {
//         const defaultImport = require( filePath );
//     }
//     console.log( '...', fs.existsSync(`${filePath}` ));
// });

export default ( options, app: Application ) => {
    return async ( ctx: Context, next ) => {

        /** 在这里增加，转发模块 */
        const allTransferList = [ t1, t2, t3, t4, t5, t6, t7, t8, t9, t10,t11,t12 ];
        let transferItem: any = null;
        const { path, method, query } = ctx.request;

        /**
         * 1. 匹配路径
         * 2. 匹配方法
         * 3. 转发（ params + query + data ）
         */
        allTransferList.some( moduleTransfer => {
            const transferList = moduleTransfer( ctx, app );
            const gotTransferItem = transferList.some( transfer => {

                const hasParams = transfer.url.includes(':');
                /** 1. 情况1: 无params，且请求路径、方法完全匹配 */
                if ( !hasParams ) {
                    if ( path === transfer.url &&
                            ( !transfer.method ||
                              transfer.method
                                      .split(',')
                                      .find( x => x.toLocaleLowerCase( ) === method.toLocaleLowerCase( )))) {
                        transferItem = transfer;
                        return true;
                    }
                    return false;
                } else {

                    const reqUrlItem = path.split('/').filter( x => !!x );
                    const configUrlItem = transfer.url.split('/').filter( x => !!x );
                    /** 2. 情况2: 有params，但请求路径并不匹配 */
                    if ( configUrlItem.length !== reqUrlItem.length ) {

                        return false;
                    } else {

                        /** 3. 情况3: 有params，且路径、方法均匹配 */
                        const isFit = configUrlItem.every(( urlItem, k ) => {
                            if ( urlItem.startsWith(':')) {
                                return true;
                            } else {
                                return urlItem === reqUrlItem[ k ];
                            }
                        });

                        if ( isFit &&
                            ( !transfer.method ||
                              transfer.method
                                    .split(',')
                                    .find( x => x.toLocaleLowerCase( ) === method.toLocaleLowerCase( )))) {
                            transferItem = transfer;
                            return true;
                        }

                        return false;
                    }

                }
            });
            return !!gotTransferItem;
        });

        
        if ( !!transferItem ) {

            const paramsObj = { };
            const reqUrlItem = path.split('/').filter( x => !!x );
            const configUrlItem = transferItem.url.split('/').filter( x => !!x );
            const configJavaItem = transferItem.java.split('/').filter( x => !!x );

            // 找到各个params的值、替换到javaUrl
            configUrlItem.map(( x, k ) => {
                if ( x.startsWith(':')) {
                    paramsObj[ x ] = reqUrlItem[ k ];
                }
            });

            const finalUrl: string[] = configJavaItem.map( x => {
                return !x.startsWith(':') ?
                        x :
                        paramsObj[ x ];
            });
            if ( finalUrl[ 0 ] === 'http:' || finalUrl[ 0 ] === 'https:' ) {
                finalUrl[ 0 ] += '/'
            }
            // 转发
            const req = await ctx.helper.myReq(`${finalUrl.join('/')}?${querystring.stringify(ctx.request.query)}`, {
                data: ctx.request.body,
                method: ctx.request.method.toLocaleUpperCase( ),
            });

            if ( transferItem.cb ) {
                transferItem.cb( ctx );
            }
            

            return ctx.body = req;

        } else {
            return await next( );
        }
    };
};
