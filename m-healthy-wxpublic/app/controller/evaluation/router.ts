import { Application, Context } from 'egg';

const apiUrl = `/api/evaluation`;

/** 问卷模块路由 */
export const evaluationRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {

    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
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
    ]
};