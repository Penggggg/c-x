"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
class AuthCtrl extends egg_1.Controller {
    constructor() {
        super(...arguments);
        /** 设置 cookie 过期时间，默认为一天 */
        this.maxAge = 24 * 60 * 60 * 1000;
        /** 与后台校验的头部字段 */
        this.javaHeader = 'x-auth-token';
        /** 企业验证时的用户名头部字段 */
        this.userNameHeader = 'x-username';
    }
    async qyOauth() {
        let reqResult;
        const { ctx } = this;
        const next = ctx.query.n;
        const code = ctx.query.code;
        const wmpConfig = ctx.app.config.wmp;
        const iacToken = await ctx.service.iac.index.getToken();
        // 企业验证
        if (wmpConfig.qyOauth) {
            reqResult = await ctx.service.wechat.index.getQyUsername(code);
            // 公众号验证
        }
        else if (wmpConfig.wxOauth) {
            reqResult = await ctx.service.wechat.index.getWxUserData(code);
        }
        if (reqResult.status === 200) {
            let token = '';
            // 企业验证
            if (wmpConfig.qyOauth) {
                const userDataReq = await ctx.service.wechat.index.getQyUserData(reqResult.data);
                const userData = userDataReq.data.data;
                token = userData.alias;
                // 公众号验证
            }
            else if (wmpConfig.wxOauth) {
                token = reqResult.data.openid;
            }
            if (wmpConfig.qyOauth) {
                ctx.cookies.set(this.userNameHeader, token, { maxAge: this.maxAge });
            }
            if (wmpConfig.wxOauth) {
                const { openid, sex, nickname, headimgurl } = reqResult.data;
                await ctx.service.jwt.index.setItem('account.sex', sex);
                await ctx.service.jwt.index.setItem('account.openid', openid);
                await ctx.service.jwt.index.setItem('account.nickname', nickname);
                await ctx.service.jwt.index.setItem('account.headimgurl', headimgurl);
            }
            ctx.redirect(decodeURIComponent(next));
        }
        else {
            ctx.redirect('/error');
        }
    }
    async ck() {
        const { ctx } = this;
        ctx.cookies.set('auth', '', { maxAge: 1 });
        ctx.cookies.set('sys-uid', '', { maxAge: 1 });
        ctx.cookies.set('x-username', '', { maxAge: 1 });
        ctx.cookies.set('x-auth-token', '', { maxAge: 1 });
        return this.ctx.body = 'ok';
    }
    async getJWT(url, data, headers) {
        return await this.ctx.curl(url, {
            data,
            headers,
            method: 'POST',
            dataType: 'json',
            contentType: 'json',
        });
    }
}
exports.default = AuthCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUVqQyxNQUFxQixRQUFTLFNBQVEsZ0JBQVU7SUFBaEQ7O1FBRUksMkJBQTJCO1FBQ1YsV0FBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUU5QyxpQkFBaUI7UUFDQSxlQUFVLEdBQUcsY0FBYyxDQUFDO1FBRTdDLG9CQUFvQjtRQUNILG1CQUFjLEdBQUcsWUFBWSxDQUFDO0lBMEVuRCxDQUFDO0lBeEVHLEtBQUssQ0FBQyxPQUFPO1FBRVQsSUFBSSxTQUFjLENBQUM7UUFFbkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM1QixNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFFckMsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFHLENBQUM7UUFFekQsT0FBTztRQUNQLElBQUssU0FBUyxDQUFDLE9BQU8sRUFBRztZQUNyQixTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFFLElBQUksQ0FBRSxDQUFDO1lBQ3JFLFFBQVE7U0FDUDthQUFNLElBQUssU0FBUyxDQUFDLE9BQU8sRUFBRztZQUM1QixTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFFLElBQUksQ0FBRSxDQUFDO1NBQ3BFO1FBRUQsSUFBSyxT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