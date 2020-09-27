"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
/** 体征模块 */
class AppointmentCtrl extends egg_1.Controller {
    /** 微信支付回调 */
    async wxPayNotify() {
        const a = await new Promise(resolve => {
            const xAuthToken = this.ctx.cookies.get("x-auth-token");
            let data = ``;
            let json = {};
            this.ctx.req.setEncoding('utf8');
            this.ctx.req.on('data', chunk => {
                data += chunk;
            });
            this.ctx.req.on('end', async () => {
                this.ctx.logger.info(`wxPay String-----${data}`);
                const iac = await this.ctx.service.common.index.getIAC();
                const payRes = await this.ctx.helper.myReq(`${this.app.config.host.server}/api/v1/reserve/pay/notify`, {
                    data: {
                        responseXml: data
                    },
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'json',
                    timeout: '1000000',
                    headers: {
                        /** 改正 */
                        'x-iac-token': iac,
                        'x-auth-token': xAuthToken,
                        'access-token': iac
                    },
                });
                if (payRes.status === 200) {
                    this.ctx.logger.info(`支付回调成功，返回微信-----SUCCESS`);
                    resolve(`
                <xml>
                    <return_code><![CDATA[SUCCESS]]></return_code>
                    <return_msg><![CDATA[OK]]></return_msg>
                </xml>
            `);
                }
                else {
                    this.ctx.logger.info(`支付回调失败，返回微信-----FAIL，预约订单生成失败`);
                    resolve(`
                <xml>
                    <return_code><![CDATA[FAIL]]></return_code>
                    <return_msg><![CDATA[预约订单生成失败]]></return_msg>
                </xml>
            `);
                }
            });
        });
        this.ctx.body = a;
    }
    /** 获取文件中心图片 */
    async getPhoto() {
        const prefix = this.app.config.photoPath;
        const res = await this.ctx.curl(`${prefix}${this.ctx.request.url.split('/')[this.ctx.request.url.split('/').length - 1]}`, {});
        this.ctx.set({
            'Access-Control-Allow-Origin': this.ctx.app.config.host.localHost,
        });
        this.ctx.set('content-disposition', res.headers['content-disposition']);
        this.ctx.body = res.data;
    }
    /** 获取预约订单 */
    async reserveOrder() {
        const iac = await this.ctx.service.common.index.getIAC();
        const xAuthToken = await this.ctx.cookies.get("x-auth-token");
        const id = this.ctx.req.url.split('/').pop();
        const fetchRes = await this.ctx.helper.myReq(`${this.app.config.host.server}/api/v1/reserve/order/${id}`, {
            method: 'GET',
            contentType: 'json',
            timeout: '1000000',
            headers: {
                /** 改正 */
                'x-iac-token': iac,
                'x-auth-token': xAuthToken,
                'access-token': iac
            },
        });
        if (fetchRes.status !== 200) {
            this.ctx.body = fetchRes;
        }
        else {
            const finalData = fetchRes.data;
            // 处理公司挂账类型的数据
            if (fetchRes.data.orderInfoDTO.payMethodCode === '3') {
                fetchRes.data.orderInfoDTO.discountPrice = fetchRes.data.orderInfoDTO.totalPrice;
                fetchRes.data.orderInfoDTO.actualPrice = 0;
            }
            this.ctx.body = {
                status: 200,
                message: 'success',
                data: finalData
            };
        }
    }
    /** 更改预约订单状态 */
    async updateReserveOrder() {
        const iac = await this.ctx.service.common.index.getIAC();
        const xAuthToken = await this.ctx.cookies.get("x-auth-token");
        const fetchRes = await this.ctx.helper.myReq(`${this.app.config.host.server}${this.ctx.req.url}`, {
            method: 'PUT',
            contentType: 'json',
            timeout: '1000000',
            headers: {
                /** 改正 */
                'x-iac-token': iac,
                'x-auth-token': xAuthToken,
                'access-token': iac
            },
        });
        this.ctx.body = fetchRes;
    }
}
exports.default = AppointmentCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUVqQyxXQUFXO0FBQ1gsTUFBcUIsZUFBZ0IsU0FBUSxnQkFBVTtJQUN0RCxhQUFhO0lBQ2IsS0FBSyxDQUFDLFdBQVc7UUFDZCxNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN4RCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLElBQUksR0FBRyxFQUFHLENBQUM7WUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxJQUFJLEtBQUssQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFLLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDakQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRyxDQUFDO2dCQUMxRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDdEMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFB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