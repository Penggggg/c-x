"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/health-check`;
/** 健康体检模块路由 */
exports.healthCheckRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 线上套餐列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/online_package_list`
        }, {
            /** 套餐详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/online_package/:id`
        }, {
            /** 添加健康体检 */
            url: `${apiUrl}/bind`,
            java: `${server}/api/v1/personal/test`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/package/:id`,
            java: `${server}/api/v1/online_package/:id/packages`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/item/list`,
            java: `${server}/api/v1/item/list`
        }, {
            /** 健康卡激活 */
            url: `${apiUrl}/active`,
            java: `${server}/api/v1/card/active_by_mobile`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUM7QUFFbkMsZUFBZTtBQUNGLFFBQUEsaUJBQWlCLEdBQUcsQ0FBRSxHQUFnQixFQUFHLEVBQUU7SUFDcEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDbkMsSUFBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUc7S0FFL0I7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQWEsQ0FBRSxHQUFZLEVBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ25FLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQyxPQUFPO1FBQ0g7WUFDSSxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFO1lBQ2hCLElBQUksRUFBRSxHQUFHLE1BQU0sNkJBQTZCO1NBQy9DLEVBQUU7WUFDQyxXQUFXO1lBQ1gsR0FBRyxFQUFFLEdBQUcsTUFBTSxhQUFhO1lBQzNCLElBQUksRUFBRSxHQUFHLE1BQU0sNEJBQTRCO1NBQzlDLEVBQUU7WUFDQyxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxPQUFPO1lBQ3JCLElBQUksRUFBRSxHQUFHLE1BQU0sdUJBQXVCO1NBQ3pDLEVBQUU7WUFDQyxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxjQUFjO1lBQzVCLElBQUksRUFBRSxHQUFHLE1BQU0scUNBQXFDO1NBQ3ZELEVBQUU7WUFDQyxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxZQUFZO1lBQzFCLElBQUksRUFBRSxHQUFHLE1BQU0sbUJBQW1CO1NBQ3JDLEVBQUU7WUFDQyxZQUFZO1lBQ1osR0FBRyxFQUFFLEdBQUcsTUFBTSxTQUFTO1lBQ3ZCLElBQUksRUFBRSxHQUFHLE1BQU0sK0JBQStCO1NBQ2pEO0tBQ0osQ0FBQTtBQUNMLENBQUMsQ0FBQSJ9