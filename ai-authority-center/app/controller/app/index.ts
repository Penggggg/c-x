import { BaseContext } from 'koa';
import * as aiUtil from '@cvte/ai-node-util'
import { Db } from '../../../global';

const { isKeysEmpty } = aiUtil.decorator;

/**
 * 应用层级的相关接口
 */
class AppCtrl implements IAppCtrl {

    /**
     * @description
     * 创建一个「系统」底下的「应用」
     * 
     * 可以由业务系统主动创建（ 需要带上 custom_app_id ）
     */
    @isKeysEmpty({
        body: 'sys_id,app_name'
    })
    public async create( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { sys_id, custom_app_id } = ctx.request.body;

        // 创建应用
        const create_sql = common.sql_add< Db.appTable >( 
            'app', [
                'sys_id',
                'app_name'
            ], 
            ctx.request.body, custom_app_id
        );
        const create$ = await common.sql( create_sql.sql );

        if ( !create$.ok ) { throw '创建「系统」时发生错误';}
        
        return common.back({
            sys_id,
            app_id: create_sql._id
        });
    }

    /**
     * @description
     * 创建一个「应用」底下的「页面模块」
     */
    @isKeysEmpty({
        body: 'app_id,sys_id,code,name'
    })
    public async createPageModule( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { sys_id, app_id } = ctx.request.body;

        // 创建应用
        const create_sql = common.sql_add< Db.pageModuleTable >( 
            'page_module', [
                'sys_id',
                'app_id',
                'code',
                'name'
            ], 
            ctx.request.body
        );

        const create$ = await common.sql( create_sql.sql );

        if ( !create$.ok ) { throw '创建「页面模块」时发生错误';}
        
        return common.back({
            sys_id,
            app_id,
            page_module_id: create_sql._id
        });
    }

    /**
     * @description
     * 创建一个「页面模块」底下的「页面」
     */
    @isKeysEmpty({
        body: 'app_id,sys_id,page_module_id,name,code'
    })
    public async createPage( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const { page_module_id } = ctx.request.body;

        // 检查是否存在此模块
        const check$ = await common.sql(
            `SELECT id FROM ${tableNames.page_module} where _id = '${page_module_id}'`
        );

        if ( !check$.ok ) { throw '查询「页面模块」时发生错误';}
        if ( check$.ok && check$.result.length === 0 ) { throw `${page_module_id}的页面模块不存在`; }

        // 创建应用
        const create_sql = common.sql_add< Db.pagesTable >( 
            'pages', [
                'app_id',
                'sys_id',
                'page_module_id',
                'code',
                'name',
                'remark'
            ], 
            ctx.request.body
        );

        const create$ = await common.sql( create_sql.sql );

        if ( !create$.ok ) { throw '创建「页面」时发生错误';}
        
        return common.back({
            page_id: create_sql._id
        });
    }

    /**
     * @description
     * 创建一个「页面」底下的「按钮」
     */
    @isKeysEmpty({
        body: 'page_id,name,code'
    })
    public async createBtn( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const { page_id } = ctx.request.body;

        // 检查是否存在此页面
        const check$ = await common.sql(
            `SELECT id FROM ${tableNames.pages} where _id = '${page_id}'`
        );

        if ( !check$.ok ) { throw '查询「页面」时发生错误';}
        if ( check$.ok && check$.result.length === 0 ) { throw `${page_id}的页面模块不存在`; }

        // 创建按钮
        const create_sql = common.sql_add< Db.btnsTable >( 
            'btns', [
                'page_id',
                'code',
                'name',
                'remark'
            ], 
            ctx.request.body
        );

        const create$ = await common.sql( create_sql.sql );

        if ( !create$.ok ) { throw '创建「按钮」时发生错误';}

        // 返回最新的按钮列表
        const find$ = await common.sql(
            `SELECT _id as btn_id, name, code FROM ${tableNames.btns} where page_id = '${page_id}'`
        );
        if ( !find$.ok ) { throw '查询「按钮列表」时发生错误';}

        return common.back( find$.result );
    }

    /**
     * @description
     * 更新「页面模块」
     */
    @isKeysEmpty({
        body: 'page_module_id'
    })
    public async upadtePageModule( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { page_module_id } = ctx.request.body;

        // 创建应用
        const update_sql = common.sql_update< Db.pageModuleTable >( 
            'page_module', [
                'code',
                'name'
            ], 
            ctx.request.body,
            { _id: page_module_id }
        );

        const update$ = await common.sql( update_sql.sql );

        if ( !update$.ok ) { throw '更新「页面模块」时发生错误';}
        
        return common.back( );
    }

    /**
     * @description
     * 更新「页面」
     */
    @isKeysEmpty({
        body: 'page_id,page_module_id'
    })
    public async upadtePage( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { page_id } = ctx.request.body;

        // 创建应用
        const update_sql = common.sql_update< Db.pagesTable >( 
            'pages', [
                'code',
                'name',
                'remark',
                'page_module_id'
            ], 
            ctx.request.body,
            { _id: page_id }
        );

        const update$ = await common.sql( update_sql.sql );

        if ( !update$.ok ) { throw '更新「页面」时发生错误';}
        
        return common.back( );
    }

    /**
     * @description
     * 更新「按钮」
     */
    @isKeysEmpty({
        body: 'btn_id'
    })
    public async upadteBtn( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { btn_id } = ctx.request.body;

        // 创建应用
        const update_sql = common.sql_update< Db.btnsTable >( 
            'btns', [
                'code',
                'name',
                'remark'
            ], 
            ctx.request.body,
            { _id: btn_id }
        );

        const update$ = await common.sql( update_sql.sql );

        if ( !update$.ok ) { throw '更新「按钮」时发生错误';}
        
        return common.back( );
    }

    /**
     * @description
     * 查询「页面模块」
     */
    @isKeysEmpty({
        query: 'sys_id,app_id'
    })
    public async findPageModule( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { sys_id, app_id } = ctx.query;
        const { tableNames } = common.helpers.constants;

        const find$ = await common.sql(
            `SELECT _id as page_module_id, name, code FROM ${tableNames.page_module} where sys_id = '${sys_id}' and app_id = '${app_id}'`
        );
        if ( !find$.ok ) { throw '查询「页面模块」时发生错误';}
        
        return common.back( find$.result );
    }

    /**
     * @description
     * 查询「页面模块」
     */
    @isKeysEmpty({
        query: 'sys_id,app_id'
    })
    public async findPages( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { sys_id, app_id } = ctx.query;
        const { tableNames } = common.helpers.constants;

        const find$ = await common.sql(
            `SELECT _id as page_id, page_module_id, name, code, remark FROM ${tableNames.pages} where sys_id = '${sys_id}' and app_id = '${app_id}'`
        );
        if ( !find$.ok ) { throw '查询「页面模块」时发生错误';}

        const pages = find$.result;
        const find2$: any[ ] = await Promise.all(
            pages.map( async ( x: any ) => {
                const findBtn$ = await common.sql(
                    `SELECT _id as btn_id, page_id, name, code, remark FROM ${tableNames.btns} where page_id = '${x.page_id}'`
                );
                if ( !findBtn$.ok ) { return [ ];}
                return findBtn$.result || [ ];
            })
        );
        
        return common.back( 
            find$.result.map(( x: any, k: number ) => {
                return {
                    ...x,
                    btns: find2$[ k ]
                }
            })
        );
    }

    /**
     * @descript
     * 删除一个「页面模块」
     */
    @isKeysEmpty({
        query: 'page_module_id'
    })
    public async deletePageModule( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const { page_module_id, sys_id, app_id } = ctx.query;

        // 检查有没有「页面」正在引用「页面模块」
        const check$ = await common.sql(
            `SELECT id FROM ${tableNames.pages} where page_module_id = '${page_module_id}'`
        );

        if ( !check$.ok ) { throw '查询「页面模块引用」时发生错误';}
        if ( check$.ok && check$.result.length > 0 ) { throw `此页面模块被引用，请先删除模块底下的页面`; }

        // 删除
        const delete$ = await common.sql(
            `DELETE FROM ${tableNames.page_module} WHERE  _id = '${page_module_id}'`
        );
        if ( !delete$.ok ) { throw '删除「页面模块」时发生错误';}

        return common.back( );
    }

    /**
     * @descript
     * 删除一个「页面」
     * 
     * TODO，要判断是否有角色依赖了此页面
     */
    @isKeysEmpty({
        query: 'page_id'
    })
    public async deletePage( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const { page_id } = ctx.query;

        // 删除
        const delete$ = await common.sql(
            `DELETE FROM ${tableNames.pages} WHERE  _id = '${page_id}'`
        );
        if ( !delete$.ok ) { throw '删除「页面」时发生错误';}

        return common.back( );
    }

    /**
     * @descript
     * 删除一个「按钮」
     * 
     * TODO，要判断是否有角色依赖了此按钮
     */
    @isKeysEmpty({
        query: 'btn_id'
    })
    public async deleteBtn( ctx: BaseContext ) {

        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants
        const { btn_id } = ctx.query;

        // 删除
        const delete$ = await common.sql(
            `DELETE FROM ${tableNames.btns} WHERE  _id = '${btn_id}'`
        );
        if ( !delete$.ok ) { throw '删除「按钮」时发生错误';}

        return common.back( );
    }

}

interface IAppCtrl {
    create( ctx: BaseContext ): void
    createPageModule( ctx: BaseContext ): void
    createPage( ctx: BaseContext ): void
    createBtn( ctx: BaseContext ): void
    deletePageModule( ctx: BaseContext ): void
    deletePage( ctx: BaseContext ): void
    deleteBtn( ctx: BaseContext ): void
    upadtePageModule( ctx: BaseContext ): void
    upadtePage( ctx: BaseContext ): void
    upadteBtn( ctx: BaseContext ): void
    findPageModule( ctx: BaseContext ): void
    findPages( ctx: BaseContext ): void
}

export default new AppCtrl( );