"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/account`;
/** 账号模块路由 */
exports.accountRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.post(`${apiUrl}/bind`, controller.account.index.accountBind);
        router.get(`${apiUrl}/avatar`, controller.account.index.getWxAvatar);
        router.get(`${apiUrl}/wx`, controller.account.index.getWxData);
    }
    return;
};
exports.transfer = (ctx, app) => {
    const { server } = app.config.host;
    return [
        {
            /** 绑定 / 注册接口 */
            url: `${apiUrl}/bind_or_create`,
            java: `${server}/api/v1/wx_user/bind_or_create`
        },
        {
            /** 注册 */
            url: `${apiUrl}/register`,
            java: `${server}/api/v1/user/register`
        },
        {
            /** 通过姓名+号码关联并绑定用户 */
            url: `${apiUrl}/bind/name`,
            java: `${server}/api/v1/wx_user/name_bind`
        },
        {
            /** 通过身份证+号码关联并绑定用户 */
            url: `${apiUrl}/bind/idcard`,
            java: `${server}/api/v1/wx_user/card_bind`
        },
        {
            /** 获取系统上的用户信息 */
            url: `${apiUrl}/system`,
            java: `${server}/api/v1/wx_user`,
            cb: ctx => {
                if (ctx.request.method.toLocaleUpperCase() === "DELETE") {
                    ctx.cookies.set("x-username", "", { maxAge: 1 });
                    ctx.cookies.set("x-auth-token", "", { maxAge: 1 });
                    ctx.cookies.set("auth", "", { maxAge: 1 });
                }
            }
        },
        {
            /** 系统用户信息更新 */
            url: `${apiUrl}/system/:id`,
            java: `${server}/api/v1/wx_user/:id`
        },
        {
            /** 姓名手机号码校验家属信息 */
            url: `${apiUrl}/validate`,
            java: `${server}/api/v1/validate_user`
        },
        {
            /** 添加家属成员 */
            url: `${apiUrl}/addMembers`,
            java: `${server}/api/v1/add_to_family`
        },
        {
            /** 家属成员列表 */
            url: `${apiUrl}/membersList`,
            java: `${server}/api/v1/family_list`
        },
        {
            /** 删除成员 */
            url: `${apiUrl}/deleteMember`,
            java: `${server}/api/v1/family_user`
        }
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBRTlCLGFBQWE7QUFDQSxRQUFBLGFBQWEsR0FBRyxDQUFDLEdBQWdCLEVBQUUsRUFBRTtJQUNoRCxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUNuQyxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRTtRQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sU0FBUyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNoRTtJQUNELE9BQU87QUFDVCxDQUFDLENBQUM7QUFFVyxRQUFBLFFBQVEsR0FBYSxDQUFDLEdBQVksRUFBRSxHQUFnQixFQUFFLEVBQUU7SUFDbkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DLE9BQU87UUFDTDtZQUNFLGdCQUFnQjtZQUNoQixHQUFHLEVBQUUsR0FBRyxNQUFNLGlCQUFpQjtZQUMvQixJQUFJLEVBQUUsR0FBRyxNQUFNLGdDQUFnQztTQUNoRDtRQUNEO1lBQ0UsU0FBUztZQUNULEdBQUcsRUFBRSxHQUFHLE1BQU0sV0FBVztZQUN6QixJQUFJLEVBQUUsR0FBRyxNQUFNLHVCQUF1QjtTQUN2QztRQUNEO1lBQ0UscUJBQXFCO1lBQ3JCLEdBQUcsRUFBRSxHQUFHLE1BQU0sWUFBWTtZQUMxQixJQUFJLEVBQUUsR0FBRyxNQUFNLDJCQUEyQjtTQUMzQztRQUNEO1lBQ0Usc0JBQXNCO1lBQ3RCLEdBQUcsRUFBRSxHQUFHLE1BQU0sY0FBYztZQUM1QixJQUFJLEVBQUUsR0FBRyxNQUFNLDJCQUEyQjtTQUMzQztRQUNEO1lBQ0UsaUJBQWlCO1lBQ2pCLEdBQUcsRUFBRSxHQUFHLE1BQU0sU0FBUztZQUN2QixJQUFJLEVBQUUsR0FBRyxNQUFNLGlCQUFpQjtZQUNoQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1IsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLFFBQVEsRUFBRTtvQkFDdkQsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNqRCxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25ELEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDNUM7WUFDSCxDQUFDO1NBQ0Y7UUFDRDtZQUNFLGVBQWU7WUFDZixHQUFHLEVBQUUsR0FBRyxNQUFNLGFBQWE7WUFDM0IsSUFBSSxFQUFFLEdBQUcsTUFBTSxxQkFBcUI7U0FDckM7UUFDRDtZQUNFLG1CQUFtQjtZQUNuQixHQUFHLEVBQUUsR0FBRyxNQUFNLFdBQVc7WUFDekIsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBdUI7U0FDdkM7UUFDRDtZQUNFLGFBQWE7WUFDYixHQUFHLEVBQUUsR0FBRyxNQUFNLGFBQWE7WUFDM0IsSUFBSSxFQUFFLEdBQUcsTUFBTSx1QkFBdUI7U0FDdkM7UUFDRDtZQUNFLGFBQWE7WUFDYixHQUFHLEVBQUUsR0FBRyxNQUFNLGNBQWM7WUFDNUIsSUFBSSxFQUFFLEdBQUcsTUFBTSxxQkFBcUI7U0FDckM7UUFDRDtZQUNFLFdBQVc7WUFDWCxHQUFHLEVBQUUsR0FBRyxNQUFNLGVBQWU7WUFDN0IsSUFBSSxFQUFFLEdBQUcsTUFBTSxxQkFBcUI7U0FDckM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=