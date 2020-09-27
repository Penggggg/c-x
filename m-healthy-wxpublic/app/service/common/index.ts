import * as ciac from '@cvte/ciac';
import { Context, Service } from 'egg';

export default class CommonService extends Service {

    constructor( ctx: Context ) {
        super( ctx );
    }

    /** 获取IAC */
    public async getIAC( ) {
        const { appid, secret } = this.app.config.iac;
        return await ciac.getToken( appid, secret );
    }

    /** 获取验证码 */
    public async getVerifyCode( phone: string | number, internationalType = '86' ) {
        const iac = await this.getIAC( );
        return await this.ctx.helper.myReq(
            `${this.app.config.host.verify}/sms/send?phone=${internationalType}${phone}&smsType=2530`, {
                method: 'POST',
                contentType: 'form',
                headers: {
                    'access-token': iac
                },
        });
    }

    /** 获取国际区号 */
    public async getSmsCountry( ) {
        const iac = await this.getIAC( );
        return await this.ctx.helper.myReq(
            `${this.app.config.host.push}/international_sms/country`, {
                method: 'GET',
                // contentType: 'form',
                headers: {
                    'access-token': iac
                },
        });
    }

    /** 验证码校验 */
    async checkVerifyCode( phone: string | number, verifyCode: string | number, internationalType = '86' ) {
        const iac = await this.getIAC( );
        return await this.ctx.helper.myReq(
            `${this.app.config.host.verify}/sms/verify?phone=${internationalType}${phone}&verificationCode=${verifyCode}`, {
                method: 'POST',
                contentType: 'form',
                headers: {
                    'access-token': iac
                },
        });
    }

    /** 调取健康后台的微信模板推送功能 */
    async healthPush( data ) {
        return await this.ctx.helper.myReq(
            `${this.app.config.host.server}/api/sign/v1/user/bindNotice`, {
                data,
                method: 'POST'
            }
        )
    }

    /** 调取健康后台的「关注自动回复」 */
    async followPush( data ) {
        return await this.ctx.helper.myReq(
            `${this.app.config.host.server}/api/v1/message/by_open_id_and_content`, {
                data,
                method: 'POST'
            }
        )
    }

}