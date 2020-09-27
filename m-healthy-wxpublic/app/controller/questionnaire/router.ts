import { Application, Context } from 'egg';

const apiUrl = `/api/q`;

/** 报告模块路由 */
export const questionnaireRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        // router.get(`${apiUrl}/download`, controller.record.index.downloadRecord );
    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
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
    ]
}