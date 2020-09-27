"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * 如果是想去体征设备入口页面，
 * 需要带上是否关注参数后继续走
 * */
exports.default = () => {
    return async (ctx, next) => {
        if (ctx.path.includes('/bodysign/device-bind-check')) {
            const { sc, dn } = ctx.query;
            const { host, wmp } = ctx.app.config;
            const openid = await ctx.service.jwt.index.getItem('account.openid');
            // 微信相关：是否已经关注
            const userInfo = await ctx.service.wechat.index.getUserInfo(openid);
            // 是否已经关注公众号
            const isSubscribe = !!Number(userInfo.data.subscribe);
            //日志
            ctx.logger.info(`【设备扫码啦】openid:  ${openid}，微信数据：${userInfo.data.subscribe}，回调：/body-sign/bind-guide?sc=${sc || 'xicoo'}&dn=${dn}&active=1&f=${isSubscribe ? 1 : 0}`);
            ctx.logger.info(`!!!!!!!!${ctx.url}`);
            return ctx.redirect(`/body-sign/bind-guide?sc=${sc || 'xicoo'}&dn=${dn}&active=1&f=${isSubscribe ? 1 : 0}`);
        }
        else {
            await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keXNpZ25fYmluZF9hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYm9keXNpZ25fYmluZF9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7Ozs7S0FJSztBQUNMLGtCQUFlLEdBQUksRUFBRTtJQUNqQixPQUFPLEtBQUssRUFBRSxHQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDaEMsSUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFO1lBRW5ELE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUM3QixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFBO1lBQ3BDLE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXJFLGNBQWM7WUFDZCxNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUUsTUFBTSxDQUFFLENBQUM7WUFDdEUsWUFBWTtZQUNaLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztZQUV4RCxJQUFJO1lBQ0osR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLE1BQU0sU0FBUyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsZ0NBQWdDLEVBQUUsSUFBRyxPQUFPLE9BQU8sRUFBRSxlQUFlLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BLLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdEMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLDRCQUE0QixFQUFFLElBQUksT0FBTyxPQUFPLEVBQUUsZUFBZSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUUvRzthQUFNO1lBQ0gsTUFBTSxJQUFJLEVBQUcsQ0FBQztTQUNqQjtJQUNMLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9