import { Application, Context } from 'egg';

const apiUrl = `/api/record`;

/** 报告模块路由 */
export const recordRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        router.get(`${apiUrl}/download`, controller.record.index.downloadRecord );
    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
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
    ]
}