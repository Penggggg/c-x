"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const path_1 = require("path");
const fs = require("fs");
const querystring = require("querystring");
const axios = require("axios");
const fxp = require("fast-xml-parser");
const FormStream = require("formstream");
const FormData = require("form-data");
class CommonCrl extends egg_1.Controller {
    async getSw() {
        const sw = fs.readFileSync(path_1.resolve(__dirname, '../../../public/service-worker/service-worker.js'), 'utf-8');
        this.ctx.set('Content-Type', 'application/javascript; charset=utf-8');
        this.ctx.body = sw;
    }
    /** 获取验证码 */
    async getVerifyCode() {
        const { phone, internationalType } = this.ctx.request.body;
        const meta = await this.ctx.service.common.index.getVerifyCode(phone, internationalType);
        this.ctx.body = meta;
    }
    /** 获取国际区号 */
    async getSmsCountry() {
        const { phone, internationalType } = this.ctx.request.body;
        const meta = await this.ctx.service.common.index.getSmsCountry();
        this.ctx.body = meta;
    }
    /** 是否需要跳转拿取token */
    async hasToken() {
        const { ctx } = this;
        const authToken = ctx.cookies.get('auth');
        this.ctx.body = {
            message: 'success',
            data: { token: !!authToken },
            status: 200
        };
    }
    /** 校验验证码 */
    async checkVerifyCode() {
        const { ctx } = this;
        const { phone, verifycode, internationalType } = ctx.request.body;
        const result = await ctx.service.common.index.checkVerifyCode(phone, verifycode, internationalType);
        ctx.body = result;
    }
    /** 获取IAC */
    async getIAC() {
        const { ctx } = this;
        ctx.body = await ctx.service.common.index.getIAC();
    }
    /** 客户端错误日志处理 */
    async getClientError() {
        const { ctx } = this;
        const d = new Date();
        ctx.logger
            .error(`[Client] error: ${d.getTime()} - ${d.getFullYear()}年${d.getMonth() +
            1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分
            ${JSON.stringify(ctx.request.body)}`);
        ctx.body = {
            status: 200
        };
    }
    /** 获取客户端IP */
    async getClientIp() {
        const { ctx } = this;
        return (ctx.body = ctx.request.ip);
    }
    /** 获取客户端token */
    async getClientXauthToken() {
        const { ctx } = this;
        return (ctx.body = ctx.cookies.get("x-auth-token"));
    }
    /** 微信支付回调 */
    async wxPayNotify() {
        const a = await new Promise(resolve => {
            let data = ``;
            let json = {};
            const xAuthToken = this.ctx.cookies.get("x-auth-token");
            this.ctx.req.setEncoding("utf8");
            this.ctx.req.on("data", chunk => {
                data += chunk;
            });
            this.ctx.req.on("end", async () => {
                const json = fxp.parse(data);
                this.ctx.logger.info(`wxPay String-----${data}`);
                const iac = await this.ctx.service.common.index.getIAC();
                await this.ctx.helper.myReq(`${this.app.config.host.server}/api/v1/personal_appoint_pay_notice`, {
                    data: {
                        responseXml: data
                    },
                    method: "POST",
                    dataType: "json",
                    contentType: "json",
                    timeout: "1000000",
                    headers: {
                        "x-iac-token": iac,
                        "access-token": iac,
                        "x-auth-token": xAuthToken,
                    }
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
    /** 微信关注回调 - 校验 */
    async wxFollowAuth() {
        this.ctx.body = this.ctx.request.query.echostr || true;
    }
    /**
     * 微信回调（含关注等）
     * 根据关注“场景”，调用推送接口，推到不同页面
     * 需要返回一个空字符串给微信
     */
    async wxFollowCB() {
        try {
            const a = await new Promise(resolve => {
                let data = ``;
                let json = {};
                this.ctx.req.setEncoding("utf8");
                this.ctx.req.on("data", chunk => {
                    data += chunk;
                });
                this.ctx.req.on("end", async () => {
                    const json = fxp.parse(data).xml;
                    this.ctx.logger.info(`wx subscribe -----${JSON.stringify(json)}`);
                    // FromUserName 就是openid
                    const MsgType = json.MsgType; // 消息类型（event，text等）
                    const Content = json.Content; // MsgType为text类型的值
                    const eventName = json.Event;
                    const openid = json.FromUserName;
                    const qrCodeParam = json.hasOwnProperty('EventKey') ? json.EventKey.split("qrscene_")[1] : '';
                    const iac = await this.ctx.service.common.index.getIAC();
                    const domain = process.env.NODE_ENV === "production"
                        ? "https://m-health-wx.cvte.com"
                        : "http://m-health-wx.cvteapi.com";
                    // 关注类型
                    if (MsgType === "event") {
                        // 关注类型
                        if (eventName === "subscribe") {
                            // 提取二维码参数回调
                            // 必须是 1=1&b=2 的回调参数
                            const params = querystring.parse(qrCodeParam);
                            this.ctx.logger.info("?????", qrCodeParam);
                            const reqData = {
                                openId: openid,
                                dn: params.dn
                            };
                            // 用户直接关注、扫不带参数二维码关注
                            if (!qrCodeParam) {
                                // this.ctx.logger.info(
                                //   "用户关注，openID为",openid
                                // );
                                // this.ctx.helper.myReq(
                                //   encodeURI(`${this.app.config.host.server}/api/v1/message/follow?openId=${openid}`),
                                //   {
                                //     method: "POST",
                                //     contentType: "json",
                                //     timeout: "1000000",
                                //     headers: {
                                //       "x-iac-token": iac,
                                //       "access-token": iac
                                //     }
                                //   }
                                // );
                                // return resolve("");
                                await this.ctx.service.common.index.followPush({
                                    openId: openid,
                                    content: '尊敬的客户，您好！\n欢迎关注视源健康公众号，为能给您提供更好的健康管理服务，请点击链接绑定用户信息：https://m-health-wx.cvte.com/account/bind\n目前账号可以实现：\n1.在线门诊预约；\n2.在线体检（含肺癌早筛、胃肠镜检查）预约视源员工福利体检预约请通过OA系统）\n3.体检卡预约（已采购或拥有体检卡的客户可使用）'
                                });
                                return resolve("");
                            }
                            // 跳到账号绑定/注册页面
                            if (params.tt === "1") {
                                delete params.tt;
                                const UrlQuery = querystring.stringify(params);
                                await this.ctx.service.common.index.healthPush(Object.assign(reqData, {
                                    url: `${domain}/body-sign/account-bind?${UrlQuery}`
                                }));
                                return resolve("");
                                // 跳到设备绑定页面
                            }
                            else if (params.tt === "2") {
                                delete params.tt;
                                const UrlQuery = querystring.stringify(params);
                                await this.ctx.service.common.index.healthPush(Object.assign(reqData, {
                                    url: `${domain}/body-sign/bind-guide?${UrlQuery}`
                                }));
                                return resolve("");
                            }
                            else if (params.tt === "3") {
                                await this.ctx.service.common.index.followPush({
                                    openId: openid,
                                    content: '尊敬的客户，您好！\n欢迎关注视源健康yibicom\n预约体检可点击下方菜单栏「供应商预约」入口\n也可点击以下链接进行预约：https://m-health-wx.cvte.com/health-card/my'
                                });
                                return resolve("");
                            }
                        }
                        return resolve("");
                    }
                    else {
                        // 收到公众号消息
                        this.ctx.logger.info(`收到公众号消息 ----- MsgType: ${MsgType},content: ${Content}`);
                        this.ctx.helper.myReq(encodeURI(`${this.app.config.host.server}/api/v1/message?openId=${openid}&msg=${MsgType === "text" ? Content : ""}`), {
                            method: "POST",
                            contentType: "json",
                            timeout: "1000000",
                            headers: {
                                "x-iac-token": iac,
                                "access-token": iac
                            }
                        });
                        return resolve("");
                    }
                });
            });
            this.ctx.body = a;
        }
        catch (e) {
            this.ctx.body = "";
        }
    }
    /** 根据参数生成带参数二维码的tick */
    async wxQrcode() {
        const { ctx } = this;
        const wmpConfig = ctx.app.config.wmp;
        const accessToken = await ctx.service.iac.index.getToken();
        const form = new FormData();
        form.append("sceneId", ctx.request.query.q);
        const result = await axios({
            method: "post",
            data: form,
            contentType: "multipart/form-data",
            url: `${wmpConfig.host}/apis/${wmpConfig.appId}/create_tmp_qr_code`,
            headers: Object.assign({}, form.getHeaders(), {
                "access-token": accessToken
            })
        });
        ctx.body = result.data;
    }
}
exports.default = CommonCrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUNqQywrQkFBK0I7QUFDL0IseUJBQXlCO0FBRXpCLDJDQUEyQztBQUczQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUV0QyxNQUFxQixTQUFVLFNBQVEsZ0JBQVU7SUFDL0MsS0FBSyxDQUFDLEtBQUs7UUFDVCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFFLGNBQU8sQ0FBRSxTQUFTLEVBQUUsa0RBQWtELENBQUMsRUFBRSxPQUFPLENBQUUsQ0FBQztRQUMvRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsdUNBQXVDLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNELFlBQVk7SUFDWixLQUFLLENBQUMsYUFBYTtRQUNqQixNQUFNLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzNELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQzVELEtBQUssRUFDTCxpQkFBaUIsQ0FDbEIsQ0FBQztRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBQ0QsYUFBYTtJQUNiLEtBQUssQ0FB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