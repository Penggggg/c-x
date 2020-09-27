"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const whiteList = [
    '/api',
    '/wx_o',
    '/clear_cookies',
    '/account/bind',
    '/account/has-bind',
    '/account/register',
    '/body-sign/account-bind'
];
/**
 * @description
 * 登陆：校验后台用户绑定，生成jwt
 */
exports.default = () => {
    return async (ctx, next) => {
        const javaHeader = 'x-auth-token';
        const maxAge = 24 * 60 * 60 * 1000;
        const wmpConfig = ctx.app.config.wmp;
        const authToken = ctx.cookies.get(javaHeader);
        const getJWT = async (url, data, headers) => {
            return await ctx.curl(url, {
                data,
                headers,
                method: 'POST',
                dataType: 'json',
                contentType: 'json',
            });
        };
        // 白名单
        if (whiteList.some(x => ctx.url.indexOf(x) !== -1) || ctx.request.url === '/') {
            await next();
            // 如果是已经进来过这个middlware了 那就next，否则引起死循环
        }
        else if (!!ctx.query.n_next) {
            await next();
            // 登陆
        }
        else if (!authToken) {
            /** 这里应该用系统用户id生成jwt */
            const { wmp } = ctx.app.config;
            const iacToken = await ctx.service.iac.index.getToken();
            const openid = await ctx.service.jwt.index.getItem('account.openid');
            if (!openid) {
                return ctx.redirect(`/account/bind?n=${ctx.url}`);
            }
            const systemUser = await ctx.service.account.index.getSystemUser(openid, wmp.appId);
            ctx.logger.info(`.....【后台系统登陆】${JSON.stringify(systemUser)}`);
            if (!!systemUser.data && systemUser.status === 200) {
                const jwtData = await getJWT(`${ctx.app.config.host.jwtServer}/csb-jwt/v1/token`, {
                    sub: systemUser.data.id,
                    timeout: maxAge,
                    map: {
                        openId: openid,
                        account: systemUser.data.id,
                        appId: ctx.app.config.wmp.appId,
                    },
                }, {
                    'x-iac-token': iacToken,
                });
                ctx.cookies.set(javaHeader, jwtData.data.data, { maxAge });
                await ctx.service.jwt.index.setItem('account.sysid', systemUser.data.id);
            }
            else {
                if (ctx.url.indexOf('/body-sign/bind-guide') !== -1) {
                    const query = Object.assign({}, ctx.query);
                    return ctx.redirect(`/body-sign/bind-guide?${querystring.stringify(query)}&active=1&n_next=1`);
                }
                else if (ctx.url.includes('/activity/gys')) {
                    const query = Object.assign({}, ctx.query);
                    delete query['u'];
                    return ctx.redirect(`/activity/gys?${querystring.stringify(query)}&u=0&n_next=1`);
                }
                return ctx.redirect(`/account/bind?n=${ctx.url}`);
            }
            const query = Object.assign({}, ctx.query);
            delete query['u'];
            return ctx.redirect(`${ctx.path}?${querystring.stringify(query)}&u=1&n_next=1`);
            // next
        }
        else if (!!authToken) {
            const query = Object.assign({}, ctx.query);
            delete query['u'];
            return ctx.redirect(`${ctx.path}?${querystring.stringify(query)}&u=1&n_next=1`);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YV9hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiamF2YV9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkNBQTJDO0FBRTNDLE1BQU0sU0FBUyxHQUFHO0lBQ2QsTUFBTTtJQUNOLE9BQU87SUFDUCxnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIseUJBQXlCO0NBQzVCLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxrQkFBZSxHQUFJLEVBQUU7SUFDakIsT0FBTyxLQUFLLEVBQUUsR0FBWSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRWhDLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDbkMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3JDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLFVBQVUsQ0FBRSxDQUFDO1FBRWhELE1BQU0sTUFBTSxHQUFHLEtBQUssRUFBRyxHQUFHLEVBQUUsSUFBWSxFQUFFLE9BQU8sRUFBRyxFQUFFO1lBQ2xELE9BQU8sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFFLEdBQUcsRUFBRTtnQkFDeEIsSUFBSTtnQkFDSixPQUFPO2dCQUNQLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixXQUFXLEVBQUUsTUFBTTthQUN0QixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUE7UUFFRCxNQUFNO1FBQ04sSUFBSyxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUc7WUFDakYsTUFBTSxJQUFJLEVBQUcsQ0FBQztZQUVsQixzQ0FBc0M7U0FDckM7YUFBTSxJQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRztZQUM3QixNQUFNLElBQUksRUFBRyxDQUFDO1lBRWxCLEtBQUs7U0FDSjthQUFNLElBQUssQ0FBQyxTQUFTLEVBQUc7WUFFckIsdUJBQXVCO1lBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUMvQixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUcsQ0FBQztZQUN6RCxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVyRSxJQUFLLENBQUMsTUFBTSxFQUFHO2dCQUNYLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDckQ7WUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQTtZQUVyRixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBRSxVQUFVLENBQUUsRUFBRSxDQUFDLENBQUM7WUFFaEUsSUFBSyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztnQkFFbEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxtQkFBbUIsRUFBRTtvQkFDOUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDdkIsT0FBTyxFQUFFLE1BQU07b0JBQ2YsR0FBRyxFQUFFO3dCQUNELE1BQU0sRUFBRSxNQUFNO3dCQUNkLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzNCLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSztxQkFDbEM7aUJBQ0EsRUFBRTtvQkFDSCxhQUFhLEVBQUUsUUFBUTtpQkFDMUIsQ0FBQyxDQUFDO2dCQUVILEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBQzVELE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxlQUFlLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUUsQ0FBQzthQUU5RTtpQkFBTTtnQkFFSCxJQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUc7b0JBRW5ELE1BQU0sS0FBSyxxQkFBUSxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7b0JBQy9CLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsV0FBVyxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUUsb0JBQW9CLENBQUMsQ0FBQztpQkFFcEc7cUJBQU0sSUFBSyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFFM0MsTUFBTSxLQUFLLHFCQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQztvQkFDL0IsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsV0FBVyxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUUsZUFBZSxDQUFDLENBQUM7aUJBQ3ZGO2dCQUVELE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDckQ7WUFFRCxNQUFNLEtBQUsscUJBQVEsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDO1lBQy9CLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUUsZUFBZSxDQUFDLENBQUM7WUFFdEYsT0FBTztTQUNOO2FBQU0sSUFBSyxDQUFDLENBQUMsU0FBUyxFQUFHO1lBQ3RCLE1BQU0sS0FBSyxxQkFBUSxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7WUFDL0IsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFFLEtBQUssQ0FBRSxlQUFlLENBQUMsQ0FBQztTQUNyRjtJQUNMLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9