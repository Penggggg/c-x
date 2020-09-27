import { Context, Next } from 'koa';

/**
 * 检查body中的sys_id或app_id是否在数据库中存在
 */
export const myCheck = async ( ctx: Context, next: Next ) => {
    try {
        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const sys_id = ( ctx.request.body|| { }).sys_id || ctx.query.sys_id;
        const app_id = ( ctx.request.body|| { }).app_id || ctx.query.app_id;

        if ( !!sys_id ) {
            // 检查是否存在此系统
            const check$ = await common.sql(
                `SELECT id FROM ${tableNames.system} where _id = '${sys_id}'`
            );
            if ( !check$.ok ) { throw '查询「「系统」时发生错误';}
            if ( check$.ok && check$.result.length === 0 ) { throw `${sys_id}的系统不存在`; }
        }

        if ( !!app_id ) {
            const check2$ = await common.sql(
                `SELECT id FROM ${tableNames.app} where _id = '${app_id}'`
            );
    
            if ( !check2$.ok ) { throw '查询「应用」时发生错误';}
            if ( check2$.ok && check2$.result.length === 0 ) { throw `${app_id}的应用不存在`; }
        }

        await next( );

    } catch ( e ) {
        return ctx.body = {
            status: 500,
            message: e
        };
    }
}