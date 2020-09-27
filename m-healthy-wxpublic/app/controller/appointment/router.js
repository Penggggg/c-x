"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlparse_1 = require("../../middleware/xmlparse");
const apiUrl = `/api/order`;
/** 体征模块路由 */
exports.appointmentRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.post(`${apiUrl}/notify`, xmlparse_1.default, controller.appointment.index.wxPayNotify);
        router.get(`${apiUrl}/getPhoto/:id`, controller.appointment.index.getPhoto);
        router.get(`${apiUrl}/reserve/order/:id`, controller.appointment.index.reserveOrder);
        router.put(`/api/v1/reserve/order/:id`, controller.appointment.index.updateReserveOrder);
    }
    return;
};
exports.transfer = (ctx, app) => {
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
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esd0RBQWlEO0FBRWpELE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQztBQUU1QixhQUFhO0FBQ0EsUUFBQSxpQkFBaUIsR0FBRyxDQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNwRCxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRztRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxTQUFTLEVBQUUsa0JBQVEsRUFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxlQUFlLEVBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sb0JBQW9CLEVBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEYsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzdGO0lBQ0QsT0FBTztBQUNYLENBQUMsQ0FBQztBQUVXLFFBQUEsUUFBUSxHQUFhLENBQUUsR0FBWSxFQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNuRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbkMsT0FBTztRQUNIO1lBQ0ksd0JBQXdCO1lBQ3hCLEdBQUcsRUFBRSxHQUFHLE1BQU0sYUFBYTtZQUMzQixJQUFJLEVBQUUsR0FBRyxNQUFNLG9CQUFv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