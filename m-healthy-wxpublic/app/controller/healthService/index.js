"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
/** 体征模块 */
class AppointmentCtrl extends egg_1.Controller {
    /** 微信支付回调 */
    async wxPayNotify() {
        const xAuthToken = this.ctx.cookies.get("x-auth-token");
        const a = await new Promise(resolve => {
            let data = ``;
            let json = {};
            this.ctx.req.setEncoding('utf8');
            this.ctx.req.on('data', chunk => {
                data += chunk;
            });
            this.ctx.req.on('end', async () => {
                this.ctx.logger.info(`wxPay String-----${data}`);
                const iac = await this.ctx.service.common.index.getIAC();
                await this.ctx.helper.myReq(`${this.app.config.host.server}/api/v1/reserve/pay/notify`, {
                    data: {
                        responseXml: data
                    },
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'json',
                    timeout: '1000000',
                    headers: {
                        /** TODO:改正 */
                        'x-iac-token': iac,
                        'x-auth-token': xAuthToken,
                        'access-token': iac
                    },
                });
                resolve(`
                <xml>
                    <return_code><![CDATA[SUCCESS]]></return_code>
                    <return_msg><![CDATA[OK]]></return_msg>
                </xml>
            `);
            });
        });
        this.ctx.body = a;
    }
}
exports.default = AppointmentCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUVqQyxXQUFXO0FBQ1gsTUFBcUIsZUFBZ0IsU0FBUSxnQkFBVTtJQUN0RCxhQUFhO0lBQ2IsS0FBSyxDQUFDLFdBQVc7UUFDZCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBRSxPQUFPLENBQUMsRUFBRTtZQUNuQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLElBQUksR0FBRyxFQUFHLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxJQUFJLEtBQUssQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFLLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDakQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRyxDQUFDO2dCQUMxRCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDdkIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSw0QkFBNEIsRUFBRTtvQkFDeEQsSUFBSSxFQUFFO3dCQUNGLFdBQVcsRUFBRSxJQUFJO3FCQUNwQjtvQkFDRCxNQUFNLEVBQUUsTUFBTTtvQkFDZCxRQUFRLEVBQUUsTUFBTTtvQkFDaEIsV0FBVyxFQUFFLE1BQU07b0JBQ25CLE9BQU8sRUFBRSxTQUFTO29CQUNsQixPQUFPLEVBQUU7d0JBQ0wsY0FBYzt3QkFDZCxhQUFhLEVBQUUsR0FBRzt3QkFDbEIsY0FBYyxFQUFFLFVBQVU7d0JBQzFCLGNBQWMsRUFBRSxHQUFHO3FCQUN0QjtpQkFDUixDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDOzs7OzthQUtQLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFFdEIsQ0FBQztDQUNBO0FBekNELGtDQXlDQyJ9