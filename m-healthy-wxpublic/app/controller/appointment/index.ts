import { Controller } from 'egg';

/** 体征模块 */
export default class AppointmentCtrl extends Controller {
 /** 微信支付回调 */
 async wxPayNotify( ) {
    const a = await new Promise( resolve => {
        const xAuthToken = this.ctx.cookies.get("x-auth-token");
        let data = ``;
        let json = { };
        this.ctx.req.setEncoding('utf8');
        this.ctx.req.on('data', chunk => {
            data += chunk;
        });
        this.ctx.req.on('end', async ( ) => {
            this.ctx.logger.info(`wxPay String-----${data}`);
            const iac = await this.ctx.service.common.index.getIAC( );
            const payRes = await this.ctx.helper.myReq(
                `${this.app.config.host.server}/api/v1/reserve/pay/notify`, {
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
            if(payRes.status === 200 ) {
                this.ctx.logger.info(`支付回调成功，返回微信-----SUCCESS`);
                resolve(`
                <xml>
                    <return_code><![CDATA[SUCCESS]]></return_code>
                    <return_msg><![CDATA[OK]]></return_msg>
                </xml>
            `);
            }else{
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
    const res  =  await this.ctx.curl( `${prefix}${this.ctx.request.url.split('/')[this.ctx.request.url.split('/').length-1]}`, {});
    this.ctx.set({
        'Access-Control-Allow-Origin': this.ctx.app.config.host.localHost,
    })
    this.ctx.set('content-disposition', res.headers['content-disposition']);
    this.ctx.body = res.data;
}
 /** 获取预约订单 */
 async reserveOrder( ) {
    const iac = await this.ctx.service.common.index.getIAC( );
    const xAuthToken = await this.ctx.cookies.get("x-auth-token");
    const id = (this.ctx.req.url as string).split('/').pop();
    const fetchRes = await this.ctx.helper.myReq(
        `${this.app.config.host.server}/api/v1/reserve/order/${id}`, {
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
    if(fetchRes.status !== 200 ) {
        this.ctx.body = fetchRes;
    }
    else {
        const finalData = fetchRes.data;
        // 处理公司挂账类型的数据
        if(fetchRes.data.orderInfoDTO.payMethodCode === '3'){
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
 async updateReserveOrder( ) {
    const iac = await this.ctx.service.common.index.getIAC( );
    const xAuthToken = await this.ctx.cookies.get("x-auth-token");
    const fetchRes = await this.ctx.helper.myReq(
        `${this.app.config.host.server}${this.ctx.req.url}`, {
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