"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/service`;
/** 体征模块路由 */
exports.healthServiceRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        // router.post(`${apiUrl}/notify`, xmlParse , controller.appointment.index.wxPayNotify);
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 根据id获取某个人的就诊记录 */
            url: `${apiUrl}/clinic/record/list`,
            java: `${server}/api/v1/clinic/record/list`
        }, {
            /** 获取就诊记录列表 */
            url: `${apiUrl}/statistic`,
            java: `${server}/api/v1/clinic/record/statistic`
        }, {
            /** 获取健康中心列表 */
            url: `${apiUrl}/clinic/record/:id/download`,
            java: `${server}/api/v1/clinic/record/:id/download`
        }, {
            /** 获取医生列表 */
            url: `${apiUrl}/clinic/record/:id/info`,
            java: `${server}/api/v1/clinic/record/:id/info`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBRTlCLGFBQWE7QUFDQSxRQUFBLG1CQUFtQixHQUFHLENBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ3RELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ25DLElBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFHO1FBQzVCLHdGQUF3RjtLQUMzRjtJQUNELE9BQU87QUFDWCxDQUFDLENBQUM7QUFFVyxRQUFBLFFBQVEsR0FBYSxDQUFFLEdBQVksRUFBRSxHQUFnQixFQUFHLEVBQUU7SUFDbkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DLE9BQU87UUFDSDtZQUNJLHFCQUFxQjtZQUNyQixHQUFHLEVBQUUsR0FBRyxNQUFNLHFCQUFxQjtZQUNuQyxJQUFJLEVBQUUsR0FBRyxNQUFNLDRCQUE0QjtTQUM5QyxFQUFFO1lBQ0MsZUFBZTtZQUNmLEdBQUcsRUFBRSxHQUFHLE1BQU0sWUFBWTtZQUMxQixJQUFJLEVBQUUsR0FBRyxNQUFNLGlDQUFpQztTQUNuRCxFQUFFO1lBQ0MsZUFBZTtZQUNmLEdBQUcsRUFBRSxHQUFHLE1BQU0sNkJBQTZCO1lBQzNDLElBQUksRUFBRSxHQUFHLE1BQU0sb0NBQW9DO1NBQ3RELEVBQUU7WUFDQyxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSx5QkFBeUI7WUFDdkMsSUFBSSxFQUFFLEdBQUcsTUFBTSxnQ0FBZ0M7U0FDbEQ7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFBIn0=