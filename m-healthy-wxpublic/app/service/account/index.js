"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
class AccountService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
    }
    /** 根据openid获取系统用户的信息 */
    async getSystemUser(openid, appid) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/v1/wx_user?appId=${appid}&openId=${openid}`);
    }
    /** 根据openid获取系统用户的账号配置 */
    async getUserConfig(openid) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/sign/v1/findUserConfig?wxOpenId=${openid}`);
    }
    /** 获取健康卡使用情况 */
    async getHealcardInfo(openid, cid) {
        const { ctx } = this;
        const { host } = ctx.app.config;
        return await this.ctx.helper.myReq(`${host.server}/api/v1/card/status?openId=${openid}&cardBatchId=${cid}`);
    }
}
exports.default = AccountService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZCQUF1QztBQUV2QyxNQUFxQixjQUFlLFNBQVEsYUFBTztJQUUvQyxZQUFhLEdBQVk7UUFDckIsS0FBSyxDQUFFLEdBQUcsQ0FBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsS0FBSyxDQUFDLGFBQWEsQ0FBRSxNQUFNLEVBQUUsS0FBSztRQUM5QixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxPQUFPLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0seUJBQXlCLEtBQUssV0FBVyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsS0FBSyxDQUFDLGFBQWEsQ0FBRSxNQUFNO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDckIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSx3Q0FBd0MsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN2RyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLEtBQUssQ0FBQyxlQUFlLENBQUUsTUFBTSxFQUFFLEdBQUc7UUFDOUIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEMsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLDhCQUE4QixNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hILENBQUM7Q0FDSjtBQTFCRCxpQ0EwQkMifQ==