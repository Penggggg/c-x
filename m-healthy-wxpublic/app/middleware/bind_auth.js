"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * 如果是想去用户绑定页面
 * 需要校验是否已经绑定过了
 * 已绑定的 就不需要了
 * */
exports.default = () => {
    return async (ctx, next) => {
        if (ctx.path === '/account/bind') {
            const { host, wmp } = ctx.app.config;
            const openid = await ctx.service.jwt.index.getItem('account.openid');
            if (!openid) {
                await next();
            }
            else {
                const checkReq = await ctx.service.account.index.getSystemUser(openid, wmp.appId);
                if (checkReq.status === 200 && !!checkReq.data) {
                    return ctx.redirect('/account/has-bind');
                }
                else {
                    await next();
                }
            }
        }
        else {
            await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZF9hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmluZF9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7Ozs7O0tBS0s7QUFDTCxrQkFBZSxHQUFJLEVBQUU7SUFDakIsT0FBTyxLQUFLLEVBQUUsR0FBWSxFQUFFLElBQUksRUFBRSxFQUFFO1FBRWhDLElBQUssR0FBRyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7WUFFL0IsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQTtZQUNwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVyRSxJQUFLLENBQUMsTUFBTSxFQUFHO2dCQUNYLE1BQU0sSUFBSSxFQUFHLENBQUM7YUFDakI7aUJBQU07Z0JBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUE7Z0JBQ25GLElBQUssUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUc7b0JBQzlDLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2lCQUM1QztxQkFBTTtvQkFDSCxNQUFNLElBQUksRUFBRyxDQUFDO2lCQUNqQjthQUNKO1NBQ0o7YUFBTTtZQUNILE1BQU0sSUFBSSxFQUFHLENBQUM7U0FDakI7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMifQ==