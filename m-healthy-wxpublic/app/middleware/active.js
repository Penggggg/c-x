"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description
 * 活动页面专用中间件
 * */
exports.default = () => {
    return async (ctx, next) => {
        /**
         * @description
         * 如果是想去「供应商领券页」/active-check/gys
         * 需要校验：是否已关注公众号、是否已经激活
         */
        if (ctx.path.includes('/active-check/gys')) {
            const { cid } = ctx.query;
            const { host, wmp } = ctx.app.config;
            const openid = await ctx.service.jwt.index.getItem('account.openid');
            // 微信相关：是否已经关注
            const userInfo = await ctx.service.wechat.index.getUserInfo(openid);
            // 是否已经关注公众号
            const isSubscribe = !!Number(userInfo.data.subscribe);
            try {
                /** 检查此用户、此卡：是否已激活、已预约 */
                const cardInfo = await ctx.service.account.index.getHealcardInfo(openid, cid);
                const { isActive, isUsed } = cardInfo.data;
                //日志
                return ctx.redirect(`/activity/gys?f=${isSubscribe ? 1 : 0}&a=${isActive}&r=${isUsed}&cid=${cid}`);
            }
            catch (e) {
                // 当前用户没有任何可用的健康卡
                return ctx.redirect(`/activity/gys?e=1&f=${isSubscribe ? 1 : 0}&a=0&r=0&cid=${cid}`);
            }
        }
        else {
            await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7OztLQUdLO0FBQ0wsa0JBQWUsR0FBSSxFQUFFO0lBQ2pCLE9BQU8sS0FBSyxFQUFFLEdBQVksRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUVoQzs7OztXQUlHO1FBQ0gsSUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1lBRXpDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzFCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUE7WUFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFckUsY0FBYztZQUNkLE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBRSxNQUFNLENBQUUsQ0FBQztZQUN0RSxZQUFZO1lBQ1osTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDO1lBRXhELElBQUk7Z0JBQ0EseUJBQXlCO2dCQUN6QixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBRSxDQUFDO2dCQUNoRixNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBRTNDLElBQUk7Z0JBQ0osT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFtQixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLFFBQVEsTUFBTSxNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUN0RztZQUFDLE9BQVEsQ0FBQyxFQUFHO2dCQUNWLGlCQUFpQjtnQkFDakIsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLHVCQUF1QixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUN4RjtTQUNKO2FBQU07WUFDSCxNQUFNLElBQUksRUFBRyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=