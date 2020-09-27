import * as ciac from '@cvte/ciac';
import { Context, Service } from 'egg';

export default class AccountService extends Service {

    constructor( ctx: Context ) {
        super( ctx );
    }

    /** 根据openid获取系统用户的信息 */
    async getSystemUser( openid, appid ) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/v1/wx_user?appId=${appid}&openId=${openid}`);
    }

    /** 根据openid获取系统用户的账号配置 */
    async getUserConfig( openid ) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/sign/v1/findUserConfig?wxOpenId=${openid}`);
    }

    /** 获取健康卡使用情况 */
    async getHealcardInfo( openid, cid ) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/v1/card/status?openId=${openid}&cardBatchId=${cid}`);
    }
}