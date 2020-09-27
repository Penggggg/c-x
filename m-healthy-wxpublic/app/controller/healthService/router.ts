import { Application, Context } from 'egg';
import xmlParse from '../../middleware/xmlparse';

const apiUrl = `/api/service`;

/** 体征模块路由 */
export const healthServiceRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        // router.post(`${apiUrl}/notify`, xmlParse , controller.appointment.index.wxPayNotify);
    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
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
    ]
}