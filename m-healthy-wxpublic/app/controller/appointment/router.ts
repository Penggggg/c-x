import { Application, Context } from 'egg';
import xmlParse from '../../middleware/xmlparse';

const apiUrl = `/api/order`;

/** 体征模块路由 */
export const appointmentRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        router.post(`${apiUrl}/notify`, xmlParse , controller.appointment.index.wxPayNotify);
        router.get(`${apiUrl}/getPhoto/:id` , controller.appointment.index.getPhoto);
        router.get(`${apiUrl}/reserve/order/:id` , controller.appointment.index.reserveOrder);
        router.put(`/api/v1/reserve/order/:id` , controller.appointment.index.updateReserveOrder);
    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
    const { server } = app.config.host;
    return [
        {
            /** 根据广告展示的位置·获取广告的列表 */
            url: `${apiUrl}/reserve/ad`,
            java: `${server}/api/v1/reserve/ad`
        }, {
            /** 获取门诊科室列表 */
            url: `${apiUrl}/reserve/dept`,
            java: `${server}/api/v1/reserve/dept`
        }, {
            /** 获取健康中心列表 */
            url: `${apiUrl}/reserve/hospital`,
            java: `${server}/api/v1/reserve/hospital`
        }, {
            /** 获取医生列表 */
            url: `${apiUrl}/reserve/doctor/list`,
            java: `${server}/api/v1/reserve/doctor/list`
        }, {
            /** 获取医生排班信息 */
            url: `${apiUrl}/reserve/schedule/:id/time_info`,
            java: `${server}/api/v1/reserve/schedule/:id/time_info`
        }, {
            /** 获取分组后的科室列表 */
            url: `${apiUrl}/reserve/dept/group`,
            java: `${server}/api/v1/reserve/dept/group`
        }, {
            /** 获取首页科室 */
            url: `${apiUrl}/reserve/index/dept`,
            java: `${server}/api/v1/reserve/index/dept`
        }, {
            /** 获取医生排班信息 */
            url: `${apiUrl}/reserve/doctor/schedule`,
            java: `${server}/api/v1/reserve/doctor/schedule`
        }, {
            /** 获取医生具体出诊时间 */
            url: `${apiUrl}/reserve/schedule/:shiftId/time_info`,
            java: `${server}/api/v1/reserve/schedule/:shiftId/time_info`
        }, {
            /** 新增预约 */
            url: `${apiUrl}/reserve`,
            java: `${server}/api/v1/reserve`
        }, 
        // {
        //     /** 获取订单Id */
        //     url: `${apiUrl}/reserve/order/:id`,
        //     java: `${server}/api/v1/reserve/order/:id`
        // }, 
        {
            /** 获取预约记录 */
            url: `${apiUrl}/reserve/order/list`,
            java: `${server}/api/v1/reserve/order/list`
        }, {
            /** 取消预约 */
            url: `${apiUrl}/reserve/cancel`,
            java: `${server}/api/v1/reserve/cancel`
        }, {
            /** 微信支付 */
            url: `${apiUrl}/reserve/pay`,
            java: `${server}/api/v1/reserve/pay`
        }, {
            /** 支付回掉 */
            url: `${apiUrl}/reserve/pay/notify`,
            java: `${server}/api/v1/reserve/pay/notify`
        }, 
        // {
        //     /** 更改订单状态 */
        //     url: `${apiUrl}/reserve/order/:id`,
        //     java: `${server}/api/v1/reserve/order/:id`
        // }, 
        {
            /** 查询用户的账号配置 */
            url: `${apiUrl}/user-config`,
            java: `${server}/api/sign/v1/findUserConfig`
        }, {
            /** 更改用户的账号配置 */
            url: `${apiUrl}/update-user-config`,
            java: `${server}/api/sign/v1/sign/config/saveOrUpdateUser`
        }, {
            /** 获取首页显示的健康课列表 */
            url: `${apiUrl}/knowledge/list`,
            java: `${server}/api/v1/knowledge/index/list`
        }, {
            /** 获取首页显示的健康课列表 */
            url: `${apiUrl}/knowledge`,
            java: `${server}/api/v1/knowledge/list`
        }
    ]
}