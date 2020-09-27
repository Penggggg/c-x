import { BaseContext } from 'koa';
import * as aiUtil from '@cvte/ai-node-util'
import { Db } from '../../../global';
import { throws } from 'assert';

const { isKeysEmpty } = aiUtil.decorator;

interface IRoleCtrl {
    findRole( ctx: BaseContext ): void
    createRole( ctx: BaseContext ): void
    deleteRole( ctx: BaseContext ): void
    updateBase( ctx: BaseContext ): void
    updateUsers( ctx: BaseContext ): void
    updatePagesBtns( ctx: BaseContext ): void
}

/**
 * 角色层级的相关接口
 */
class RoleCtrl implements IRoleCtrl {

    /**
     * @description
     * 创建一个「应用」底下的「角色」
     */
    @isKeysEmpty({
        body: 'app_id,sys_id,name'
    })
    public async createRole( ctx: BaseContext ) {
        const { common } = ctx.service;
        
        // 创建角色
        const create_sql = common.sql_add< Db.roleTable >( 
            'role', [
                'app_id',
                'sys_id',
                'name',
                'is_enable'
            ], 
            {
                ...ctx.request.body,
                is_enable: 0
            }
        );
        const create$ = await common.sql( create_sql.sql );

        if ( !create$.ok ) { throw '创建「角色」时发生错误';}

        return common.back({
            role_id: create_sql._id
        });
    }

    /**
     * @description
     * 创建一个「应用」底下的「角色列表」
     */
    @isKeysEmpty({
        query: 'app_id,sys_id'
    })
    public async findRole( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { app_id, sys_id } = ctx.query;
        const { tableNames } = common.helpers.constants;
        
        const findRole$ = await common.sql(
            `select _id as role_id, name from ${tableNames.role} where sys_id = '${sys_id}' and app_id = '${app_id}'`
        );

        if ( !findRole$.ok ) { throw '查询「角色」时发生错误'}

        return common.back( findRole$.result );
    }

    /**
     * @description
     * 创建一个「角色」基础信息
     */
    @isKeysEmpty({
        query: 'role_id'
    })
    public async findRoleBase( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id } = ctx.query;
        const { tableNames } = common.helpers.constants;
        
        const findRole$ = await common.sql(
            `select _id as role_id, name, remark, end_time, start_time, is_enable from ${tableNames.role} where _id = '${role_id}'`
        );

        if ( !findRole$.ok ) { throw '查询「角色」时发生错误'}

        return common.back( findRole$.result[ 0 ]);
    }

    /**
     * @description
     * 删除一个「角色」
     */
    @isKeysEmpty({
        query: 'role_id'
    })
    public async deleteRole( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id } = ctx.query;
        const { tableNames } = common.helpers.constants;
        
        // 删除
        const delete$ = await common.sql(
            `DELETE FROM ${tableNames.role} WHERE  _id = '${role_id}'`
        );
        if ( !delete$.ok ) { throw '删除「角色」时发生错误';}

        return common.back(  );
    }

    /**
     * @description
     * 更新一个「角色」的基本信息
     */
    @isKeysEmpty({
        body: 'role_id'
    })
    public async updateBase( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id, is_enable } = ctx.request.body;
        const { tableNames } = common.helpers.constants;
        
        // 更新
        const update_sql = common.sql_update< Db.roleTable >( 
            'role', [
                'name',
                'remark',
                'end_time',
                'start_time',
                'is_enable'
            ], 
            ctx.request.body,
            { _id: role_id }
        );
        const update$ = await common.sql( update_sql.sql );

        if ( !update$.ok ) { throw '更新「角色」时发生错误';}

        // 查询
        const find$ = await common.sql(
            `select _id as role_id, name, start_time, end_time, is_enable, remark from ${tableNames.role} where _id = '${role_id}'`
        );

        if ( !find$.ok ) { throw '查询「角色」时发生错误';}

        return common.back( find$.result[ 0 ]);
    }

    /**
     * @description
     * 更新一个「角色」底下的「账号」
     * 
     * user: {
     *      type: string,
     *      value: string,
     *      name: string
     * }[ ]
     */
    @isKeysEmpty({
        body: 'role_id,users'
    })
    public async updateUsers( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id, users } = ctx.request.body;
        const { tableNames } = common.helpers.constants;
        
        // 1、获取「角色」底下所有的「用户」
        const find$ = await common.sql(
            `select _id as auth_user_id from ${tableNames.auth_users} where role_id = '${role_id}'`
        );

        if ( !find$.ok ) { throw '查询「角色用户」时发生错误';}

        // 2、数据库删除被用户手动删除了的「用户」
        const sholdDeleteArr = find$.result.filter(( x: any ) => {
            return !users.find(( y: any ) => y.auth_user_id === x.auth_user_id )
        });
        await Promise.all(
            sholdDeleteArr.map( async ( user: any ) => {
                const delete$ = await common.sql(
                    `DELETE FROM ${tableNames.auth_users} WHERE _id = '${user.auth_user_id}'`
                );
            })
        )
            
        // 3、插入没有id的「用户」
        const sholdCreateArr = users.filter(( user: any ) => !user.auth_user_id );
        await Promise.all(
            sholdCreateArr.map( async ( user: any ) => {
                const create_sql = common.sql_add< Db.authUsersTable >( 
                    'auth_users', [
                        'value',
                        'type',
                        'name',
                        'role_id'
                    ], 
                    {
                        ...user,
                        role_id
                    }
                );
                await common.sql( create_sql.sql ); 
            })
        )
        
        // 4、返回所有的「用户」
        const find2$ = await common.sql(
            `select _id as auth_user_id, role_id, type, name, value from ${tableNames.auth_users} where role_id = '${role_id}'`
        );

        if ( !find2$.ok ) { throw '查询「用户」时发生错误';}

        return common.back( find2$.result );
    }

    /**
     * @description
     * 添加一个「角色」底下的「账号」
     * 
     * user: {
     *      type: string,
     *      value: string,
     *      name: string
     * }[ ]
     */
    @isKeysEmpty({
        body: 'role_id,users'
    })
    public async addUsers( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id, users } = ctx.request.body;
        const { tableNames } = common.helpers.constants;
                    
        // 3、插入没有id的「用户」
        const sholdCreateArr = users.filter(( user: any ) => !user.auth_user_id );
        await Promise.all(
            sholdCreateArr.map( async ( user: any ) => {
                const create_sql = common.sql_add< Db.authUsersTable >( 
                    'auth_users', [
                        'value',
                        'type',
                        'name',
                        'role_id'
                    ], 
                    {
                        ...user,
                        role_id
                    }
                );
                await common.sql( create_sql.sql ); 
            })
        )
        
        // 4、返回所有的「用户」
        const find2$ = await common.sql(
            `select _id as auth_user_id, role_id, type, name, value from ${tableNames.auth_users} where role_id = '${role_id}'`
        );

        if ( !find2$.ok ) { throw '查询「用户」时发生错误';}

        return common.back( find2$.result );
    }

    /**
     * @description
     * 删除一个「角色」底下的「账号」
     * 
     * 账号可用 逗号分隔
     * 
     */
    @isKeysEmpty({
        query: 'auth_user_ids'
    })
    public async deleteUser( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { auth_user_ids } = ctx.query;
        const { tableNames } = common.helpers.constants;

        await Promise.all(
            auth_user_ids.split(',').map( async ( auth_user_id: string ) => {
                await common.sql(
                    `DELETE FROM ${tableNames.auth_users} WHERE _id = '${auth_user_id}'`
                );
            })
        )

        return common.back( );
    }

    /**
     * @description
     * 查询一个「角色」底下的「账号」
     */
    @isKeysEmpty({
        query: 'role_id'
    })
    public async findUsers( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { role_id } = ctx.query;
        const { tableNames } = common.helpers.constants;
        
        // 4、返回所有的「用户」
        const find2$ = await common.sql(
            `select _id as auth_user_id, role_id, type, name, value from ${tableNames.auth_users} where role_id = '${role_id}'`
        );

        if ( !find2$.ok ) { throw '查询「用户」时发生错误';}

        return common.back( find2$.result );
    }

    /**
     * @description
     * 更新一个「角色」底下的「页面」、「按钮」
     * 
     * pages: page_id[ ]
     */
    @isKeysEmpty({
        body: 'role_id,pages,btns'
    })
    public async updatePagesBtns( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants;
        const { role_id, pages, btns } = ctx.request.body;

        // 校验即将配置的「页面」是否存在
        const isPagesExisted = await Promise.all(
            pages.map( async ( page_id: string ) => {
                const find$ = await common.sql(
                    `select _id as page_id from ${tableNames.pages} where _id = '${page_id}'`
                );
                return find$.result.length > 0
            })
        );

        if ( isPagesExisted.includes( false )) { throw '「页面」不存在，请刷新后重试';}

        // 1、删除旧有的
        await common.sql(
            `DELETE FROM ${tableNames.auth_pages} WHERE role_id = '${role_id}'`
        );

        // 2、插入新的「页面权限」
        await Promise.all(
            pages.map( async ( page_id: string ) => {
                const create_sql = common.sql_add< Db.authPagesTable >( 
                    'auth_pages', [
                        'page_id',
                        'role_id'
                    ], 
                    {
                        page_id,
                        role_id
                    }
                );
                await common.sql( create_sql.sql ); 
            })
        )

        // 校验即将配置的「按钮」是否存在
        const isBtnsExisted = await Promise.all(
            btns.map( async ( btn_id: string ) => {
                const find$ = await common.sql(
                    `select _id as page_id from ${tableNames.btns} where _id = '${btn_id}'`
                );
                return find$.result.length > 0
            })
        );

        if ( isBtnsExisted.includes( false )) { throw '「按钮」不存在，请刷新后重试';}

        // 1、删除旧有的
        await common.sql(
            `DELETE FROM ${tableNames.auth_btns} WHERE role_id = '${role_id}'`
        );

        // 2、插入新的「按钮权限」
        await Promise.all(
            btns.map( async ( btn_id: string ) => {
                const create_sql = common.sql_add< Db.authBtnsTable >( 
                    'auth_btns', [
                        'btn_id',
                        'role_id'
                    ], 
                    {
                        btn_id,
                        role_id
                    }
                );
                await common.sql( create_sql.sql ); 
            })
        );

        // 返回最新的「页面权限」+「按钮权限」
        const findAuthPage$ = await common.sql(
            `select page_id from ${tableNames.auth_pages} where role_id = '${role_id}'`
        );

        if ( !findAuthPage$.ok ) { throw '查询「页面权限」时发生错误'}

        const pages$ = await Promise.all(
            findAuthPage$.result.map( async ( authPage: any ) => {
                const find$ = await common.sql(
                    `select _id as page_id, code, name, remark from ${tableNames.pages} where _id = '${authPage.page_id}'`
                );
                return !!find$.ok ? find$.result[ 0 ] : [ ]
            })
        );

        const findAuthBtns$ = await common.sql(
            `select btn_id from ${tableNames.auth_btns} where role_id = '${role_id}'`
        );

        if ( !findAuthBtns$.ok ) { throw '查询「按钮权限」时发生错误'}

        const btns$ = await Promise.all(
            findAuthBtns$.result.map( async ( authBtn: any ) => {
                const find$ = await common.sql(
                    `select _id as btn_id, code, name, remark from ${tableNames.btns} where _id = '${authBtn.btn_id}'`
                );
                return !!find$.ok ? find$.result[ 0 ] : [ ]
            })
        );

        return common.back({
            pages: pages$,
            btns: btns$
        });
    }

    /**
     * @description
     * 查询一个「角色」底下的「页面」、「按钮」
     * 
     * pages: page_id[ ]
     */
    @isKeysEmpty({
        query: 'role_id'
    })
    public async finPagesBtns( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { tableNames } = common.helpers.constants;
        const { role_id } = ctx.query;

        // 返回最新的「页面权限」+「按钮权限」
        const findAuthPage$ = await common.sql(
            `select page_id from ${tableNames.auth_pages} where role_id = '${role_id}'`
        );

        if ( !findAuthPage$.ok ) { throw '查询「页面权限」时发生错误'}

        const pages$ = await Promise.all(
            findAuthPage$.result.map( async ( authPage: any ) => {
                const find$ = await common.sql(
                    `select _id as page_id, code, name, remark from ${tableNames.pages} where _id = '${authPage.page_id}'`
                );
                return !!find$.ok ? find$.result[ 0 ] : [ ]
            })
        );

        const findAuthBtns$ = await common.sql(
            `select btn_id from ${tableNames.auth_btns} where role_id = '${role_id}'`
        );

        if ( !findAuthBtns$.ok ) { throw '查询「按钮权限」时发生错误'}

        const btns$ = await Promise.all(
            findAuthBtns$.result.map( async ( authBtn: any ) => {
                const find$ = await common.sql(
                    `select _id as btn_id, code, name, remark from ${tableNames.btns} where _id = '${authBtn.btn_id}'`
                );
                return !!find$.ok ? find$.result[ 0 ] : [ ]
            })
        );

        return common.back({
            pages: pages$,
            btns: btns$
        });
    }

}

export default new RoleCtrl( );