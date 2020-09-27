import { Controller } from 'egg';

/** 体征模块 */
export default class AppointmentCtrl extends Controller {
 /** 微信支付回调 */
 async wxPayNotify( ) {
    const xAuthToken = this.ctx.cookies.get("x-auth-token");
    const a = await new Promise( resolve => {
        let data = ``;
        let json = { };
        this.ctx.req.setEncoding('utf8');
        this.ctx.req.on('data', chunk => {
            data += chunk;
        });
        this.ctx.req.on('end', async ( ) => {
            this.ctx.logger.info(`wxPay String-----${data}`);
            const iac = await this.ctx.service.common.index.getIAC( );
            await this.ctx.helper.myReq(
                `${this.app.config.host.server}/api/v1/reserve/pay/notify`, {
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