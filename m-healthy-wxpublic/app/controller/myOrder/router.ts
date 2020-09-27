import { Application, Context } from 'egg';

const apiUrl = `/api/my-order`;

/** 我的订单模块路由 */
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
            /** 我的订单列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/personal_appointments`
        }, {
            /** 我的订单详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/personal_appoint/:id`
        }, {
            /** 我的订单取消 */
            url: `${apiUrl}/cancel`,
            java: `${server}/api/v1/personal_appoint_cancel`
        }
    ]
}