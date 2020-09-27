import { Application, Context } from 'egg';
import xmlParse from '../../middleware/xmlparse';

const apiUrl = `/api/common`;

/** 通用模块路由 */
export const commonRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        router.post(`${apiUrl}/verifycode`, controller.common.index.getVerifyCode );
        router.get(`${apiUrl}/sms-country`, controller.common.index.getSmsCountry );
        router.post(`${apiUrl}/check-verifycode`, controller.common.index.checkVerifyCode );
        router.get(`${apiUrl}/iac`, controller.common.index.getIAC );
        router.post(`${apiUrl}/client-error`, controller.common.index.getClientError );
        router.get(`${apiUrl}/client-ip`, controller.common.index.getClientIp );
        router.get(`${apiUrl}/client-xauthtoken`, controller.common.index.getClientXauthToken );
        router.post(`${apiUrl}/wxpay-notify`, xmlParse, controller.common.index.wxPayNotify );
        router.get(`${apiUrl}/wx-follow`, xmlParse, controller.common.index.wxFollowAuth );
        router.post(`${apiUrl}/wx-follow`, xmlParse, controller.common.index.wxFollowCB );
        router.get(`${apiUrl}/wx-qrcode`, controller.common.index.wxQrcode );
        router.get(`${apiUrl}/has-token`, controller.common.index.hasToken );
    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
    const { server } = app.config.host;
    return [
        {
            /** 数据字典 */
            url: `${apiUrl}/dic`,
            java: `${server}/api/v1/dictionary_item_ref`
        }, {
            /** 公众号参数配置 */
            url: `${apiUrl}/jssdk`,
            java: `${app.config.wmp.host}/apis/${app.config.wmp.appId}/jsconfig`
        }
    ]
};