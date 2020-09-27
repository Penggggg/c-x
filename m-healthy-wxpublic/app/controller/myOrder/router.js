"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/my-order`;
/** 我的订单模块路由 */
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
            /** 我的订单列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/personal_appointments`
        }, {
            /** 我的订单详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/personal_appoint/:id`
        }, {
            /** 我的订单取消 */
            url: `${apiUrl}/cancel`,
            java: `${server}/api/v1/personal_appoint_cancel`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDO0FBRS9CLGVBQWU7QUFDRixRQUFBLGlCQUFpQixHQUFHLENBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ3BELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ25DLElBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFHO0tBRS9CO0lBQ0QsT0FBTztBQUNYLENBQUMsQ0FBQztBQUVXLFFBQUEsUUFBUSxHQUFhLENBQUUsR0FBWSxFQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNuRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbkMsT0FBTztRQUNIO1lBQ0ksYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRTtZQUNoQixJQUFJLEVBQUUsR0FBRyxNQUFNLCtCQUErQjtTQUNqRCxFQUFFO1lBQ0MsYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFHLE1BQU0sYUFBYTtZQUMzQixJQUFJLEVBQUUsR0FBRyxNQUFNLDhCQUE4QjtTQUNoRCxFQUFFO1lBQ0MsYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFHLE1BQU0sU0FBUztZQUN2QixJQUFJLEVBQUUsR0FBRyxNQUFNLGlDQUFpQztTQUNuRDtLQUNKLENBQUE7QUFDTCxDQUFDLENBQUEifQ==