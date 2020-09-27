import { Controller } from 'egg';

export default class AccountCrl extends Controller {

    /** 账号绑定-保存个人账号信息 */
    async accountBind( ) {

        const { ctx } = this;
        const { phone, verifyCode } = this.ctx.request.body;

        /**
         * 1. 验证码校验
         */
        const checkout = await ctx.service.common.index.checkVerifyCode( phone, verifyCode );
        if ( checkout.status !== 200 ) {
            return ctx.body = checkout;
        }

        ctx.body = {
            status: 200
        }
    }

    /** 获取微信的个人头像 */
    async getWxAvatar( ) {
        const { ctx } = this;
        return ctx.body = {
            status: 200,
            data: await ctx.service.jwt.index.getItem('account.headimgurl')
        }
    }

    /** 获取当前微信账号的相关信息 */
    async getWxData( ) {
        const { ctx } = this;
        return ctx.body = {
            status: 200,
            data: {
                appid: this.app.config.wmp.appId,
                openid: await ctx.service.jwt.index.getItem('account.openid'),
                avatar: await ctx.service.jwt.index.getItem('account.headimgurl')
            }
        }
    }

}