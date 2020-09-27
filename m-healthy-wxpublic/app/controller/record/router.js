"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/record`;
/** 报告模块路由 */
exports.recordRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.get(`${apiUrl}/download`, controller.record.index.downloadRecord);
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 就诊报告列表 */
            url: `${apiUrl}/clinic`,
            java: `${server}/api/v1/report`
        }, {
            /** 一份就诊报告中的所有项目 */
            url: `${apiUrl}/clinic/report_items`,
            java: `${server}/api/v1/report_items`
        }, {
            /** 一份就诊报告的详情 */
            url: `${apiUrl}/clinic/:id`,
            java: `${server}/api/v1/report/:id`
        },
        {
            /** 家属体检报告列表 */
            url: `${apiUrl}/relative`,
            java: `${server}/api/v1/relative_report`
        },
        {
            /** 上传邮箱 */
            url: `${apiUrl}/email_report`,
            java: `${server}/api/v1/email_report`
        },
        {
            /** 获取检查报告列表 */
            url: `${apiUrl}/report`,
            java: `${server}/api/v1/wx/report`
        },
        {
            /** 获取检查报告详情 */
            url: `${apiUrl}/report/:id`,
            java: `${server}/api/v1/wx/report/:id`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDO0FBRTdCLGFBQWE7QUFDQSxRQUFBLFlBQVksR0FBRyxDQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUMvQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxXQUFXLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFFLENBQUM7S0FDN0U7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQWEsQ0FBRSxHQUFZLEVBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ25FLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQyxPQUFPO1FBQ0g7WUFDSSxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxTQUFTO1lBQ3ZCLElBQUksRUFBRSxHQUFHLE1BQU0sZ0JBQWdCO1NBQ2xDLEVBQUU7WUFDQyxtQkFBbUI7WUFDbkIsR0FBRyxFQUFFLEdBQUcsTUFBTSxzQkFBc0I7WUFDcEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxzQkFBc0I7U0FDeEMsRUFBRTtZQUNDLGdCQUFnQjtZQUNoQixHQUFHLEVBQUUsR0FBRyxNQUFNLGFBQWE7WUFDM0IsSUFBSSxFQUFFLEdBQUcsTUFBTSxvQkFBb0I7U0FDdEM7UUFDRDtZQUNJLGVBQWU7WUFDZixHQUFHLEVBQUUsR0FBRyxNQUFNLFdBQVc7WUFDekIsSUFBSSxFQUFFLEdBQUcsTUFBTSx5QkFBeUI7U0FDM0M7UUFDRDtZQUNJLFdBQVc7WUFDWCxHQUFHLEVBQUUsR0FBRyxNQUFNLGVBQWU7WUFDN0IsSUFBSSxFQUFFLEdBQUcsTUFBTSxzQkFBc0I7U0FDeEM7UUFDRDtZQUNJLGVBQWU7WUFDZixHQUFHLEVBQUUsR0FBRyxNQUFNLFNBQVM7WUFDdkIsSUFBSSxFQUFFLEdBQUcsTUFBTSxtQkFBbUI7U0FDckM7UUFDRDtZQUNJLGVBQWU7WUFDZixHQUFHLEVBQUUsR0FBRyxNQUFNLGFBQWE7WUFDM0IsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBdUI7U0FDekM7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFBIn0=