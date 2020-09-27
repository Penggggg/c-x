import { Application, Context } from 'egg';

const apiUrl = `/api/health-check`;

/** 健康体检模块路由 */
export const healthCheckRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {

    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
    const { server } = app.config.host;
    return [
        {
            /** 线上套餐列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/online_package_list`
        }, {
            /** 套餐详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/online_package/:id`
        }, {
            /** 添加健康体检 */
            url: `${apiUrl}/bind`,
            java: `${server}/api/v1/personal/test`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/package/:id`,
            java: `${server}/api/v1/online_package/:id/packages`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/item/list`,
            java: `${server}/api/v1/item/list`
        }, {
            /** 健康卡激活 */
            url: `${apiUrl}/active`,
            java: `${server}/api/v1/card/active_by_mobile`
        }
    ]
}