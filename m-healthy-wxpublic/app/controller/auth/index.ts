import { Controller } from 'egg';

export default class AuthCtrl extends Controller {

    /** 设置 cookie 过期时间，默认为一天 */
    private readonly maxAge = 24 * 60 * 60 * 1000;

    /** 与后台校验的头部字段 */
    private readonly javaHeader = 'x-auth-token';

    /** 企业验证时的用户名头部字段 */
    private readonly userNameHeader = 'x-username';

    async qyOauth( ) {

        let reqResult: any;

        const { ctx } = this;
        const next = ctx.query.n;
        const code = ctx.query.code;
        const wmpConfig = ctx.app.config.wmp;

        const iacToken = await ctx.service.iac.index.getToken( );
        
        // 企业验证
        if ( wmpConfig.qyOauth ) {
            reqResult = await ctx.service.wechat.index.getQyUsername( code );
        // 公众号验证
        } else if ( wmpConfig.wxOauth ) {
            reqResult = await ctx.service.wechat.index.getWxUserData( code );
        }

        if ( reqResult.status === 200 ) {

            let token = '';

            // 企业验证
            if ( wmpConfig.qyOauth ) {
                const userDataReq = await ctx.service.wechat.index.getQyUserData( reqResult.data );
                const userData = userDataReq.data.data;
                token = userData.alias;
            // 公众号验证
            } else if ( wmpConfig.wxOauth ) {
                token = reqResult.data.openid;
            }

            if ( wmpConfig.qyOauth ) {
                ctx.cookies.set( this.userNameHeader, token, { maxAge: this.maxAge });
            }

            if ( wmpConfig.wxOauth ) {
                const { openid, sex, nickname, headimgurl } = reqResult.data;
                await ctx.service.jwt.index.setItem( 'account.sex', sex );
                await ctx.service.jwt.index.setItem( 'account.openid', openid  );
                await ctx.service.jwt.index.setItem( 'account.nickname', nickname  );
                await ctx.service.jwt.index.setItem( 'account.headimgurl', headimgurl );
            }

            ctx.redirect( decodeURIComponent( next ));

        } else {
            ctx.redirect('/error');
        }

    }

    async ck( ) {
        const { ctx } = this;
        ctx.cookies.set('auth', '', { maxAge: 1 });
        ctx.cookies.set('sys-uid', '', { maxAge: 1 });
        ctx.cookies.set('x-username', '', { maxAge: 1 });
        ctx.cookies.set('x-auth-token', '', { maxAge: 1 });
        return this.ctx.body = 'ok';
    }

    private async getJWT( url, data: object, headers ) {
        return await this.ctx.curl( url, {
            data,
            headers,
            method: 'POST',
            dataType: 'json',
            contentType: 'json',
        });
    }

}