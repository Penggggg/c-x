"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/booking`;
/** 预约模块路由 */
exports.bookingRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 就诊人列表、增加就诊人、更新就诊人 */
            url: `${apiUrl}/clinic_people`,
            java: `${server}/api/v1/clinic_people`
        }, {
            /** 就诊人详情、更新 */
            url: `${apiUrl}/clinic_people/:id`,
            java: `${server}/api/v1/clinic_people/:id`
        }, {
            /** 根据门诊ID，获取科室列表 */
            url: `${apiUrl}/department`,
            java: `${server}/api/v1/clinic/department`
        }, {
            /** 门诊的预约记录 */
            url: `${apiUrl}/clinic/record`,
            java: `${server}/api/v1/clinic/appointment`
        }, {
            /** 新增预约的可用日期选择 */
            url: `${apiUrl}/clinic/scheduleDate`,
            java: `${server}/api/v1/clinic/scheduleDate`
        }, {
            /** 新增预约的可用时间 */
            url: `${apiUrl}/clinic/scheduleTime`,
            java: `${server}/api/v1/clinic/scheduleTime`
        }, {
            /** 新增门诊预约、预约列表 */
            url: `${apiUrl}/clinic`,
            java: `${server}/api/v1/clinic/appointment`
        }, {
            /** 取消预约 */
            url: `${apiUrl}/clinic/cancel`,
            java: `${server}/api/v1/clinic/cancel_appointment`
        }, {
            /** 健康卡体检排期 */
            url: `${apiUrl}/health-card/scheduleDate`,
            java: `${server}/api/v1/common/medical_scheduling`
        }, {
            /** 健康卡预约 */
            url: `${apiUrl}/health-card`,
            java: `${server}/api/v1/card_appoint`
        }, {
            /** 健康卡预约列表 */
            url: `${apiUrl}/health-card/record`,
            java: `${server}/api/v1/card_appointments`
        }, {
            /** 取消健康卡预约 */
            url: `${apiUrl}/health-card/cancel`,
            java: `${server}/api/v1/card_appoint_cancel`
        }, {
            /** 个人体检预约 */
            url: `${apiUrl}/health-check`,
            java: `${server}/api/v1/personal_appoint`
        }, {
            /** 获取轮播图片 */
            url: `${apiUrl}/carouselImages`,
            java: `${server}/api/v1/common/carousel_image_list`
        }, {
            /** 个人体检预约 - 获取微信支付预付款信息 */
            url: `${apiUrl}/health-check/prepay/:id`,
            java: `${server}/api/v1/personal_appoint/:id/prepay`
        }, {
            /** 个人体检预约 - 更新预约支付结果 */
            url: `${apiUrl}/health-check/pay/:id`,
            java: `${server}/api/v1/personal_appoint/:id/pay`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBRTlCLGFBQWE7QUFDQSxRQUFBLGFBQWEsR0FBRyxDQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNoRCxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRztLQUUvQjtJQUNELE9BQU87QUFDWCxDQUFDLENBQUM7QUFFVyxRQUFBLFFBQVEsR0FBYSxDQUFFLEdBQVksRUFBRSxHQUFnQixFQUFHLEVBQUU7SUFDbkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DLE9BQU87UUFDSDtZQUNJLHdCQUF3QjtZQUN4QixHQUFHLEVBQUUsR0FBRyxNQUFNLGdCQUFnQjtZQUM5QixJQUFJLEVBQUUsR0FBRyxNQUFNLHVCQUF1QjtTQUN6QyxFQUFFO1lBQ0MsZUFBZTtZQUNmLEdBQUcsRUFBRSxHQUFHLE1BQU0sb0JBQW9CO1lBQ2xDLElBQUksRUFBRSxHQUFHLE1BQU0sMkJBQTJCO1NBQzdDLEVBQUU7WUFDQyxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxhQUFhO1lBQzNCLElBQUksRUFBRSxHQUFHLE1BQU0sMkJBQTJCO1NBQzdDLEVBQUU7WUFDQyxjQUFjO1lBQ2QsR0FBRyxFQUFFLEdBQUcsTUFBTSxnQkFBZ0I7WUFDOUIsSUFBSSxFQUFFLEdBQUcsTUFBTSw0QkFBNEI7U0FDOUMsRUFBRTtZQUNDLGtCQUFrQjtZQUNsQixHQUFHLEVBQUUsR0FBRyxNQUFNLHNCQUFzQjtZQUNwQyxJQUFJLEVBQUUsR0FBRyxNQUFNLDZCQUE2QjtTQUMvQyxFQUFFO1lBQ0MsZ0JBQWdCO1lBQ2hCLEdBQUcsRUFBRSxHQUFHLE1BQU0sc0JBQXNCO1lBQ3BDLElBQUksRUFBRSxHQUFHLE1BQU0sNkJBQTZCO1NBQy9DLEVBQUU7WUFDQyxrQkFBa0I7WUFDbEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxTQUFTO1lBQ3ZCLElBQUksRUFBRSxHQUFHLE1BQU0sNEJBQTRCO1NBQzlDLEVBQUU7WUFDQyxXQUFXO1lBQ1gsR0FBRyxFQUFFLEdBQUcsTUFBTSxnQkFBZ0I7WUFDOUIsSUFBSSxFQUFFLEdBQUcsTUFBTSxtQ0FBbUM7U0FDckQsRUFBRTtZQUNDLGNBQWM7WUFDZCxHQUFHLEVBQUUsR0FBRyxNQUFNLDJCQUEyQjtZQUN6QyxJQUFJLEVBQUUsR0FBRyxNQUFNLG1DQUFtQztTQUNyRCxFQUFFO1lBQ0MsWUFBWTtZQUNaLEdBQUcsRUFBRSxHQUFHLE1BQU0sY0FBYztZQUM1QixJQUFJLEVBQUUsR0FBRyxNQUFNLHNCQUFzQjtTQUN4QyxFQUFFO1lBQ0MsY0FBYztZQUNkLEdBQUcsRUFBRSxHQUFHLE1BQU0scUJBQXFCO1lBQ25DLElBQUksRUFBRSxHQUFHLE1BQU0sMkJBQTJCO1NBQzdDLEVBQUU7WUFDQyxjQUFjO1lBQ2QsR0FBRyxFQUFFLEdBQUcsTUFBTSxxQkFBcUI7WUFDbkMsSUFBSSxFQUFFLEdBQUcsTUFBTSw2QkFBNkI7U0FDL0MsRUFBRTtZQUNDLGFBQWE7WUFDYixHQUFHLEVBQUUsR0FBRyxNQUFNLGVBQWU7WUFDN0IsSUFBSSxFQUFFLEdBQUcsTUFBTSwwQkFBMEI7U0FDNUMsRUFBRTtZQUNDLGFBQWE7WUFDYixHQUFHLEVBQUUsR0FBRyxNQUFNLGlCQUFpQjtZQUMvQixJQUFJLEVBQUUsR0FBRyxNQUFNLG9DQUFvQztTQUN0RCxFQUFFO1lBQ0MsMkJBQTJCO1lBQzNCLEdBQUcsRUFBRSxHQUFHLE1BQU0sMEJBQTBCO1lBQ3hDLElBQUksRUFBRSxHQUFHLE1BQU0scUNBQXFDO1NBQ3ZELEVBQUU7WUFDQyx3QkFBd0I7WUFDeEIsR0FBRyxFQUFFLEdBQUcsTUFBTSx1QkFBdUI7WUFDckMsSUFBSSxFQUFFLEdBQUcsTUFBTSxrQ0FBa0M7U0FDcEQ7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFBIn0=