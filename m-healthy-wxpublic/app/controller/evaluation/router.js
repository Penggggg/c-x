"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/evaluation`;
/** 问卷模块路由 */
exports.evaluationRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 问卷大厅 - 全部问卷列表 */
            url: `${apiUrl}`,
            java: `${server}/api/questionnaire/v1/all_qn_list`
        }, {
            /** 问卷大厅 - 全部问卷列表 */
            url: `${apiUrl}/list/unfinished`,
            java: `${server}/api/questionnaire/v1/unfinished_qn_list`
        }, {
            /** 问卷大厅 - 全部问卷列表 */
            url: `${apiUrl}/list/finished`,
            java: `${server}/api/questionnaire/v1/finished_qn_list`
        }, {
            /** 问卷详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/questionnaire/v1/find/:id`
        }, {
            /** 获取问答宝链接 */
            url: `${apiUrl}/question-url`,
            java: `${server}/api/questionnaire/v1/qn_url`
        }, {
            /** 问卷的报告详情，通过模版id */
            url: `${apiUrl}/report`,
            java: `${server}/api/questionnaire/v1/template_report`
        }, {
            /** 问卷的报告详情，通过历史id */
            url: `${apiUrl}/report2/:hid`,
            java: `${server}/api/questionnaire/v1/find_report/:hid`
        }, {
            /** 问卷的历史 */
            url: `${apiUrl}/history`,
            java: `${server}/api/questionnaire/v1/history`
        }, {
            /**  根据旧链接，获取新的链接， */
            url: `${apiUrl}/get_url_by_old`,
            java: `${server}/api/questionnaire/v1/transfer_url`
        }, {
            /**  根据扫描二维码获取问卷地址 */
            url: `${apiUrl}/qrcode-enter`,
            java: `${server}/api/questionnaire/v1/qn_url`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsaUJBQWlCLENBQUM7QUFFakMsYUFBYTtBQUNBLFFBQUEsZ0JBQWdCLEdBQUcsQ0FBRSxHQUFnQixFQUFHLEVBQUU7SUFDbkQsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDbkMsSUFBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUc7S0FFL0I7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQWEsQ0FBRSxHQUFZLEVBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ25FLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQyxPQUFPO1FBQ0g7WUFDSSxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFO1lBQ2hCLElBQUksRUFBRSxHQUFHLE1BQU0sbUNBQW1DO1NBQ3JELEVBQUU7WUFDQyxvQkFBb0I7WUFDcEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxrQkFBa0I7WUFDaEMsSUFBSSxFQUFFLEdBQUcsTUFBTSwwQ0FBMEM7U0FDNUQsRUFBRTtZQUNDLG9CQUFvQjtZQUNwQixHQUFHLEVBQUUsR0FBRyxNQUFNLGdCQUFnQjtZQUM5QixJQUFJLEVBQUUsR0FBRyxNQUFNLHdDQUF3QztTQUMxRCxFQUFFO1lBQ0MsV0FBVztZQUNYLEdBQUcsRUFBRSxHQUFHLE1BQU0sYUFBYTtZQUMzQixJQUFJLEVBQUUsR0FBRyxNQUFNLGdDQUFnQztTQUNsRCxFQUFFO1lBQ0MsY0FBYztZQUNkLEdBQUcsRUFBRSxHQUFHLE1BQU0sZUFBZTtZQUM3QixJQUFJLEVBQUUsR0FBRyxNQUFNLDhCQUE4QjtTQUNoRCxFQUFFO1lBQ0MscUJBQXFCO1lBQ3JCLEdBQUcsRUFBRSxHQUFHLE1BQU0sU0FBUztZQUN2QixJQUFJLEVBQUUsR0FBRyxNQUFNLHVDQUF1QztTQUN6RCxFQUFFO1lBQ0MscUJBQXFCO1lBQ3JCLEdBQUcsRUFBRSxHQUFHLE1BQU0sZUFBZTtZQUM3QixJQUFJLEVBQUUsR0FBRyxNQUFNLHdDQUF3QztTQUMxRCxFQUFFO1lBQ0MsWUFBWTtZQUNaLEdBQUcsRUFBRSxHQUFHLE1BQU0sVUFBVTtZQUN4QixJQUFJLEVBQUUsR0FBRyxNQUFNLCtCQUErQjtTQUNqRCxFQUFFO1lBQ0MscUJBQXFCO1lBQ3JCLEdBQUcsRUFBRSxHQUFHLE1BQU0saUJBQWlCO1lBQy9CLElBQUksRUFBRSxHQUFHLE1BQU0sb0NBQW9DO1NBQ3RELEVBQUU7WUFDQyxxQkFBcUI7WUFDckIsR0FBRyxFQUFFLEdBQUcsTUFBTSxlQUFlO1lBQzdCLElBQUksRUFBRSxHQUFHLE1BQU0sOEJBQThCO1NBQ2hEO0tBQ0osQ0FBQTtBQUNMLENBQUMsQ0FBQyJ9