"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ciac = require("@cvte/ciac");
const egg_1 = require("egg");
class CommonService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
    }
    /** 获取IAC */
    async getIAC() {
        const { appid, secret } = this.app.config.iac;
        return await ciac.getToken(appid, secret);
    }
    /** 获取验证码 */
    async getVerifyCode(phone, internationalType = '86') {
        const iac = await this.getIAC();
        return await this.ctx.helper.myReq(`${this.app.config.host.verify}/sms/send?phone=${internationalType}${phone}&smsType=2530`, {
            method: 'POST',
            contentType: 'form',
            headers: {
                'access-token': iac
            },
        });
    }
    /** 获取国际区号 */
    async getSmsCountry() {
        const iac = await this.getIAC();
        return await this.ctx.helper.myReq(`${this.app.config.host.push}/international_sms/country`, {
            method: 'GET',
            // contentType: 'form',
            headers: {
                'access-token': iac
            },
        });
    }
    /** 验证码校验 */
    async checkVerifyCode(phone, verifyCode, internationalType = '86') {
        const iac = await this.getIAC();
        return await this.ctx.helper.myReq(`${this.app.config.host.verify}/sms/verify?phone=${internationalType}${phone}&verificationCode=${verifyCode}`, {
            method: 'POST',
            contentType: 'form',
            headers: {
                'access-token': iac
            },
        });
    }
    /** 调取健康后台的微信模板推送功能 */
    async healthPush(data) {
        return await this.ctx.helper.myReq(`${this.app.config.host.server}/api/sign/v1/user/bindNotice`, {
            data,
            method: 'POST'
        });
    }
    /** 调取健康后台的「关注自动回复」 */
    async followPush(data) {
        return await this.ctx.helper.myReq(`${this.app.config.host.server}/api/v1/message/by_open_id_and_content`, {
            data,
            method: 'POST'
        });
    }
}
exports.default = CommonService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyw2QkFBdUM7QUFFdkMsTUFBcUIsYUFBYyxTQUFRLGFBQU87SUFFOUMsWUFBYSxHQUFZO1FBQ3JCLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsWUFBWTtJQUNMLEtBQUssQ0FBQyxNQUFNO1FBQ2YsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDOUMsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCxZQUFZO0lBQ0wsS0FBSyxDQUFDLGFBQWEsQ0FBRSxLQUFzQixFQUFFLGlCQUFpQixHQUFHLElBQUk7UUFDeEUsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFHLENBQUM7UUFDakMsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDOUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxtQkFBbUIsaUJBQWlCLEdBQUcsS0FBSyxlQUFlLEVBQUU7WUFDdkYsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUUsTUFBTTtZQUNuQixPQUFPLEVBQUU7Z0JBQ0wsY0FBYyxFQUFFLEdBQUc7YUFDdEI7U0FDUixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsYUFBYTtJQUNOLEtBQUssQ0FBQyxhQUFhO1FBQ3RCLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRyxDQUFDO1FBQ2pDLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQzlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksNEJBQTRCLEVBQUU7WUFDdEQsTUFBTSxFQUFFLEtBQUs7WUFDYix1QkFBdUI7WUFDdkIsT0FBTyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxHQUFHO2FBQ3RCO1NBQ1IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFlBQVk7SUFDWixLQUFLLENBQUMsZUFBZSxDQUFFLEtBQXNCLEVBQUUsVUFBMkIsRUFBRSxpQkFBaUIsR0FBRyxJQUFJO1FBQ2hHLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRyxDQUFDO1FBQ2pDLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQzlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0scUJBQXFCLGlCQUFpQixHQUFHLEtBQUsscUJBQXFCLFVBQVUsRUFBRSxFQUFFO1lBQzNHLE1BQU0sRUFBRSxNQUFNO1lBQ2QsV0FBVyxFQUFFLE1BQU07WUFDbkIsT0FBTyxFQUFFO2dCQUNMLGNBQWMsRUFBRSxHQUFHO2FBQ3RCO1NBQ1IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixLQUFLLENBQUMsVUFBVSxDQUFFLElBQUk7UUFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDOUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSw4QkFBOEIsRUFBRTtZQUMxRCxJQUFJO1lBQ0osTUFBTSxFQUFFLE1BQU07U0FDakIsQ0FDSixDQUFBO0lBQ0wsQ0FBQztJQUVELHNCQUFzQjtJQUN0QixLQUFLLENBQUMsVUFBVSxDQUFFLElBQUk7UUFDbEIsT0FBTyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDOUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSx3Q0FBd0MsRUFBRTtZQUNwRSxJQUFJO1lBQ0osTUFBTSxFQUFFLE1BQU07U0FDakIsQ0FDSixDQUFBO0lBQ0wsQ0FBQztDQUVKO0FBdkVELGdDQXVFQyJ9