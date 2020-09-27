import { Next, BaseContext } from 'koa';

class CommonCtrl {

    public async test( ctx: BaseContext, next: Next ) {
        const a = await ctx.service.common.getJwt( );
        return ctx.service.common.back( a )
    }

    /** 
     * @description
     * 组织架构纬度 
     */
    public async orgDimension( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { hosts } = common.helpers.nacosConf;

        return common.back( await common.transfer({
            url: `${hosts.org}/admin/v1/org/dimension`,
        }));
    }

    /** 
     * @description
     * 组织架构 树 
     * query - dimensionId, 组织架构纬度id
     * */
    public async orgTree( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { hosts } = common.helpers.nacosConf;

        return common.back( await common.transfer({
            params: { ...ctx.query },
            url: `${hosts.org}/admin/v1/org/relation_tree`,
        }));
    }

     /** 
     * @description
     * 组织架构 用户列表
     * query - orgId, 组织架构id
     * query - pageNum，分页
     * query - pageSize，分页
     * query - account，域账号
     * query - name，姓名
     * */
    public async orgUser( ctx: BaseContext ) {
        const { common } = ctx.service;
        const { hosts } = common.helpers.nacosConf;

        return common.back( await common.transfer({
            params: { ...ctx.query },
            url: `${hosts.org}/admin/v1/user/role_user_unit`,
        }));
    }

}

export default new CommonCtrl( );