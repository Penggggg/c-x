"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlparse_1 = require("../../middleware/xmlparse");
const apiUrl = `/api/common`;
/** 通用模块路由 */
exports.commonRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.post(`${apiUrl}/verifycode`, controller.common.index.getVerifyCode);
        router.get(`${apiUrl}/sms-country`, controller.common.index.getSmsCountry);
        router.post(`${apiUrl}/check-verifycode`, controller.common.index.checkVerifyCode);
        router.get(`${apiUrl}/iac`, controller.common.index.getIAC);
        router.post(`${apiUrl}/client-error`, controller.common.index.getClientError);
        router.get(`${apiUrl}/client-ip`, controller.common.index.getClientIp);
        router.get(`${apiUrl}/client-xauthtoken`, controller.common.index.getClientXauthToken);
        router.post(`${apiUrl}/wxpay-notify`, xmlparse_1.default, controller.common.index.wxPayNotify);
        router.get(`${apiUrl}/wx-follow`, xmlparse_1.default, controller.common.index.wxFollowAuth);
        router.post(`${apiUrl}/wx-follow`, xmlparse_1.default, controller.common.index.wxFollowCB);
        router.get(`${apiUrl}/wx-qrcode`, controller.common.index.wxQrcode);
        router.get(`${apiUrl}/has-token`, controller.common.index.hasToken);
    }
    return;
};
exports.transfer = (ctx, app) => {
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
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esd0RBQWlEO0FBRWpELE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQztBQUU3QixhQUFhO0FBQ0EsUUFBQSxZQUFZLEdBQUcsQ0FBRSxHQUFnQixFQUFHLEVBQUU7SUFDL0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDbkMsSUFBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUc7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sYUFBYSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBRSxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLGNBQWMsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUUsQ0FBQztRQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUUsQ0FBQztRQUNwRixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFFLENBQUM7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sZUFBZSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBRSxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUUsQ0FBQztRQUN4RSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxvQkFBb0IsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBRSxDQUFDO1FBQ3hGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLGVBQWUsRUFBRSxrQkFBUSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBRSxDQUFDO1FBQ3RGLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLFlBQVksRUFBRSxrQkFBUSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBRSxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLFlBQVksRUFBRSxrQkFBUSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBQ2xGLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLFlBQVksRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUNyRSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxZQUFZLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFFLENBQUM7S0FDeEU7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQWEsQ0FBRSxHQUFZLEVBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ25FLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQyxPQUFPO1FBQ0g7WUFDSSxXQUFXO1lBQ1gsR0FBRyxFQUFFLEdBQUcsTUFBTSxNQUFNO1lBQ3BCLElBQUksRUFBRSxHQUFHLE1BQU0sNkJBQTZCO1NBQy9DLEVBQUU7WUFDQyxjQUFjO1lBQ2QsR0FBRyxFQUFFLEdBQUcsTUFBTSxRQUFRO1lBQ3RCLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVc7U0FDdkU7S0FDSixDQUFBO0FBQ0wsQ0FBQyxDQUFDIn0=