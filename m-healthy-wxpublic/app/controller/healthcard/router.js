"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/health-card`;
/** 健康卡模块路由 */
exports.healthCardRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 健康卡列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/user_cards`
        }, {
            /** 添加健康卡 */
            url: `${apiUrl}/bind`,
            java: `${server}/api/v1/card_bind`
        }, {
            /** 详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/card/:id`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/package/:id`,
            java: `${server}/api/v1/card/:id/packages`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsa0JBQWtCLENBQUM7QUFFbEMsY0FBYztBQUNELFFBQUEsZ0JBQWdCLEdBQUcsQ0FBRSxHQUFnQixFQUFHLEVBQUU7SUFDbkQsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDbkMsSUFBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUc7S0FFL0I7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQWEsQ0FBRSxHQUFZLEVBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ25FLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNuQyxPQUFPO1FBQ0g7WUFDSSxZQUFZO1lBQ1osR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFO1lBQ2hCLElBQUksRUFBRSxHQUFHLE1BQU0sb0JBQW9CO1NBQ3RDLEVBQUU7WUFDQyxZQUFZO1lBQ1osR0FBRyxFQUFFLEdBQUcsTUFBTSxPQUFPO1lBQ3JCLElBQUksRUFBRSxHQUFHLE1BQU0sbUJBQW1CO1NBQ3JDLEVBQUU7WUFDQyxTQUFTO1lBQ1QsR0FBRyxFQUFFLEdBQUcsTUFBTSxhQUFhO1lBQzNCLElBQUksRUFBRSxHQUFHLE1BQU0sa0JBQWtCO1NBQ3BDLEVBQUU7WUFDQyxhQUFhO1lBQ2IsR0FBRyxFQUFFLEdBQUcsTUFBTSxjQUFjO1lBQzVCLElBQUksRUFBRSxHQUFHLE1BQU0sMkJBQTJCO1NBQzdDO0tBQ0osQ0FBQTtBQUNMLENBQUMsQ0FBQSJ9