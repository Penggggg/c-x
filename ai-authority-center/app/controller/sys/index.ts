import { BaseContext } from 'koa';
import * as aiUtil from '@cvte/ai-node-util'
import { Db } from '../../../global';

const { isKeysEmpty } = aiUtil.decorator;

interface ISysCtrl {
    create( ctx: BaseContext ): void
}

/**
 * 系统层级的相关接口
 */
class SysCtrl implements ISysCtrl {

    /**
     * @description
     * 创建一个系统，及一个默认类型的应用
     * 返回：系统id + appid
     */
    @isKeysEmpty({
        body: 'sys_name,creator_account'
    })
    public async create( ctx: BaseContext ) {
        const { common } = ctx.service;

        // 创建系统
        const create_sql1 = common.sql_add< Db.systemTable >( 
            'system', [
                'remark',
                'sys_url',
                'sys_name',
                'login_next',
                'creator_account'
            ], 
            ctx.request.body
        );
        const create1$ = await common.sql( create_sql1.sql );
        const sysId = create_sql1._id;

        if ( !create1$.ok ) { throw '创建「系统」时发生错误';}

        // 创建默认应用
        const create_sql2 = common.sql_add< Db.appTable >(
            'app', [
                'sys_id',
                'app_name'
            ],
            { sys_id: sysId, app_name: '默认应用' }
        );
        const create2$ = await common.sql( create_sql2.sql );
        const appId = create_sql2._id;

        if ( !create2$.ok ) { throw '创建「系统的默认应用」时发生错误';}
        
        return common.back({
            sys_id: sysId,
            app_id: appId
        });
    }

}

export default new SysCtrl( );