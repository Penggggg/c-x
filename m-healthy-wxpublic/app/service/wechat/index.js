"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
/** 微信服务 */
class WechatService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
    }
    /** 根据openid获取用户信息 */
    async getUserInfo(openid) {
        const ctx = this.ctx;
        const wmpConfig = ctx.app.config.wmp;
        const accessToken = await ctx.service.iac.index.getToken();
        const result = await ctx.curl(`${wmpConfig.host}/apis/${wmpConfig.appId}/user/${openid}`, {
            headers: {
                'access-token': accessToken,
            },
            dataType: 'json',
        });
        return result.data;
    }
    /** 获取用户（企业号） */
    async getQyUsername(code) {
        const ctx = this.ctx;
        const wmpConfig = ctx.app.config.wmp;
        const accessToken = await ctx.service.iac.index.getToken();
        const result = await ctx.curl(`${wmpConfig.host}/apis/${wmpConfig.appId}/qy_oauth_get_user`, {
            headers: {
                'access-token': accessToken,
            },
            data: { code },
            dataType: 'json',
        });
        return result.data;
    }
    /** 获取用户（公众号） */
    async getWxUserData(code) {
        const ctx = this.ctx;
        const wmpConfig = ctx.app.config.wmp;
        const accessToken = await ctx.service.iac.index.getToken();
        const result = await ctx.curl(`${wmpConfig.host}/apis/${wmpConfig.appId}/oauth_get_user`, {
            headers: {
                'access-token': accessToken,
            },
            data: { code },
            dataType: 'json',
        });
        return result.data;
    }
    /** 根据hcm的人员ID，获取对应的信息 */
    async getQyUserData(id) {
        const ctx = this.ctx;
        const { qiyeServer } = ctx.app.config.host;
        const accessToken = await ctx.service.iac.index.getToken();
        const result = await ctx.curl(`${qiyeServer}/wx-sync/user/search`, {
            headers: {
                'access-token': accessToken,
            },
            data: {
                data: id,
            },
            dataType: 'json',
        });
        return result.data;
    }
}
exports.default = WechatService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDZCQUF1QztBQUd2QyxXQUFXO0FBQ1gsTUFBcUIsYUFBYyxTQUFRLGFBQU87SUFFaEQsWUFBYSxHQUFZO1FBQ3ZCLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQztJQUNmLENBQUM7SUFFRCxxQkFBcUI7SUFDckIsS0FBSyxDQUFDLFdBQVcsQ0FBRSxNQUFNO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3JDLE1BQU0sV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDM0IsR0FBRyxTQUFTLENBQUMsSUFBSSxTQUFTLFNBQVMsQ0FBQyxLQUFLLFNBQVMsTUFBTSxFQUFFLEVBQzFEO1lBQ0UsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxXQUFXO2FBQzVCO1lBQ0QsUUFBUSxFQUFFLE1BQU07U0FDakIsQ0FDRixDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDckIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBRXJDLE1BQU0sV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTNELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDM0IsR0FBRyxTQUFTLENBQUMsSUFBSSxTQUFTLFNBQVMsQ0FBQyxLQUFLLG9CQUFvQixFQUM3RDtZQUNFLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsV0FBVzthQUM1QjtZQUNELElBQUksRUFBRSxFQUFFLElBQUksRUFBRTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQ0YsQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSTtRQUN0QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3JCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUVyQyxNQUFNLFdBQVcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUzRCxNQUFNLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQzNCLEdBQUcsU0FBUyxDQUFDLElBQUksU0FBUyxTQUFTLENBQUMsS0FBSyxpQkFBaUIsRUFDMUQ7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLFdBQVc7YUFDNUI7WUFDRCxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUU7WUFDZCxRQUFRLEVBQUUsTUFBTTtTQUNqQixDQUNGLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixLQUFLLENBQUMsYUFBYSxDQUFFLEVBQUU7UUFFckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNyQixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzNDLE1BQU0sV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRyxDQUFDO1FBRTVELE1BQU0sTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDM0IsR0FBRyxVQUFVLHNCQUFzQixFQUNuQztZQUNFLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsV0FBVzthQUM1QjtZQUNELElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsRUFBRTthQUNUO1lBQ0QsUUFBUSxFQUFFLE1BQU07U0FDakIsQ0FDRixDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBRXJCLENBQUM7Q0FJRjtBQTFGRCxnQ0EwRkMifQ==