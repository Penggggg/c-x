import { Application, Context } from 'egg';

const apiUrl = `/api/booking`;

/** 预约模块路由 */
export const bookingRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {

    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
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
    ]
}