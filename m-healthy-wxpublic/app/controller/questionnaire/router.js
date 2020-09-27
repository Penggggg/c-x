"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/q`;
/** 报告模块路由 */
exports.questionnaireRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        // router.get(`${apiUrl}/download`, controller.record.index.downloadRecord );
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 获取肿瘤早筛问卷结果 */
            url: `${apiUrl}/tumors_result`,
            java: `${server}/api/questionnaire/v1/tumors_result`
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
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBRXhCLGFBQWE7QUFDQSxRQUFBLG1CQUFtQixHQUFHLENBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ3RELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ25DLElBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFHO1FBQzVCLDZFQUE2RTtLQUNoRjtJQUNELE9BQU87QUFDWCxDQUFDLENBQUM7QUFFVyxRQUFBLFFBQVEsR0FBYSxDQUFFLEdBQVksRUFBRSxHQUFnQixFQUFHLEVBQUU7SUFDbkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DLE9BQU87UUFDSDtZQUNJLGlCQUFpQjtZQUNqQixHQUFHLEVBQUUsR0FBRyxNQUFNLGdCQUFnQjtZQUM5QixJQUFJLEVBQUUsR0FBRyxNQUFNLHFDQUFxQztTQUN2RCxFQUFFO1lBQ0MsbUJBQW1CO1lBQ25CLEdBQUcsRUFBRSxHQUFHLE1BQU0sc0JBQXNCO1lBQ3BDLElBQUksRUFBRSxHQUFHLE1BQU0sc0JBQXNCO1NBQ3hDLEVBQUU7WUFDQyxnQkFBZ0I7WUFDaEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxhQUFhO1lBQzNCLElBQUksRUFBRSxHQUFHLE1BQU0sb0JBQW9CO1NBQ3RDO1FBQ0Q7WUFDSSxlQUFlO1lBQ2YsR0FBRyxFQUFFLEdBQUcsTUFBTSxXQUFXO1lBQ3pCLElBQUksRUFBRSxHQUFHLE1BQU0seUJBQXlCO1NBQzNDO0tBQ0osQ0FBQTtBQUNMLENBQUMsQ0FBQSJ9