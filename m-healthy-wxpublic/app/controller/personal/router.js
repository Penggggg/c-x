"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/personal`;
/** 个人页面模块路由 */
exports.personalRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.get(`${apiUrl}/test`, controller.personal.index.test);
    }
    return;
};
/**
 *
 * 个人页面模块转发
 * ! 支持多个params参数
 */
exports.transfer = (ctx, app) => {
    return [
        {
            url: `${apiUrl}/list`,
            java: `${app.config.host.node}/api/personal/test`,
        },
        {
            url: `${apiUrl}/detail/:id`,
            java: `${app.config.host.node}/p/:id/detail`,
        },
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDO0FBRS9CLGVBQWU7QUFDRixRQUFBLGNBQWMsR0FBRyxDQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNqRCxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRztRQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxPQUFPLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFFLENBQUE7S0FDaEU7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNVLFFBQUEsUUFBUSxHQUFhLENBQUUsR0FBWSxFQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNuRSxPQUFPO1FBQ0g7WUFDSSxHQUFHLEVBQUUsR0FBRyxNQUFNLE9BQU87WUFDckIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0I7U0FDcEQ7UUFDRDtZQUNJLEdBQUcsRUFBRSxHQUFHLE1BQU0sYUFBYTtZQUMzQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWU7U0FDL0M7S0FDSixDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=