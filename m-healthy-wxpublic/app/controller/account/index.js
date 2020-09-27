"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
class AccountCrl extends egg_1.Controller {
    /** 账号绑定-保存个人账号信息 */
    async accountBind() {
        const { ctx } = this;
        const { phone, verifyCode } = this.ctx.request.body;
        /**
         * 1. 验证码校验
         */
        const checkout = await ctx.service.common.index.checkVerifyCode(phone, verifyCode);
        if (checkout.status !== 200) {
            return ctx.body = checkout;
        }
        ctx.body = {
            status: 200
        };
    }
    /** 获取微信的个人头像 */
    async getWxAvatar() {
        const { ctx } = this;
        return ctx.body = {
            status: 200,
            data: await ctx.service.jwt.index.getItem('account.headimgurl')
        };
    }
    /** 获取当前微信账号的相关信息 */
    async getWxData() {
        const { ctx } = this;
        return ctx.body = {
            status: 200,
            data: {
                appid: this.app.config.wmp.appId,
                openid: await ctx.service.jwt.index.getItem('account.openid'),
                avatar: await ctx.service.jwt.index.getItem('account.headimgurl')
            }
        };
    }
}
exports.default = AccountCrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUVqQyxNQUFxQixVQUFXLFNBQVEsZ0JBQVU7SUFFOUMsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBQyxXQUFXO1FBRWIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUVwRDs7V0FFRztRQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBRSxLQUFLLEVBQUUsVUFBVSxDQUFFLENBQUM7UUFDckYsSUFBSyxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRztZQUMzQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1NBQzlCO1FBRUQsR0FBRyxDQUFDLElBQUksR0FBRztZQUNQLE1BQU0sRUFBRSxHQUFHO1NBQ2QsQ0FBQTtJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLFdBQVc7UUFDYixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRztZQUNkLE1BQU0sRUFBRSxHQUFHO1lBQ1gsSUFBSSxFQUFFLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztTQUNsRSxDQUFBO0lBQ0wsQ0FBQztJQUVELG9CQUFvQjtJQUNwQixLQUFLLENBQUMsU0FBUztRQUNYLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDckIsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHO1lBQ2QsTUFBTSxFQUFFLEdBQUc7WUFDWCxJQUFJLEVBQUU7Z0JBQ0YsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLO2dCQUNoQyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO2dCQUM3RCxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQ3BFO1NBQ0osQ0FBQTtJQUNMLENBQUM7Q0FFSjtBQTNDRCw2QkEyQ0MifQ==