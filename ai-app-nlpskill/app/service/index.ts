import fs from 'fs';
import path from 'path';
import { Context, Next } from 'koa';
import { sqlHelper } from '../util/mysql';
import constants from '../util/constans';
import { TSeriviceHelper } from '../../global';

export default ( ) => {

    // 所有serviceModule
    let servicesModule: any = { };

    // 把服务先加到内存
    fs.readdirSync( path.join( __dirname  ))
        .filter( x => !x.includes('.'))
        .map( moduleName => {

            const modulePath = `${path.join( __dirname, `/${moduleName}/index` )}`;
            if ( fs.existsSync(`${modulePath}.js`)) {
                import( modulePath )
                    .then( m => {
                        if ( !!m.default && typeof m.default === 'function' ) {
                            servicesModule = {
                                ...servicesModule,
                                [ moduleName ]: m.default
                            };
                        }
                    });
            }
        });
    
    // 加载nacos配置
    let nacosConf = { };
    const nacosPath = path.join( __dirname, '../../config/nacos.json');

    if ( fs.existsSync( nacosPath )) {
        try {
            nacosConf = JSON.parse( fs.readFileSync( nacosPath, {
                encoding: 'utf8'
            }))
        } catch ( e ) {}
    }

    //  返回一个koa中间件
    return async ( ctx: Context, next: Next ) => {
        let innerServices: any = { };
        Object.keys( servicesModule )
            .map( moduleKey => {
                innerServices = {
                    ...innerServices,
                    [ moduleKey ]: new servicesModule[ moduleKey ]( ctx, {
                        // 数据库链接实例
                        mysql: sqlHelper.get( ),
                        // 系统常量
                        constants,
                        // nacos配置
                        nacosConf
                    } as TSeriviceHelper )
                }
            });
        ctx.service = innerServices;
        await next( );
    }
};