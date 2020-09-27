import { Controller } from "egg";
import { resolve } from "path";
import * as fs from "fs";
import * as xml2js from "xml2js";
import * as querystring from "querystring";
import { customize } from "power-assert";

const axios = require("axios");
const fxp = require("fast-xml-parser");
const FormStream = require("formstream");
const FormData = require("form-data");

export default class CommonCrl extends Controller {
  async getSw(){
    const sw = fs.readFileSync( resolve( __dirname, '../../../public/service-worker/service-worker.js'), 'utf-8' );
    this.ctx.set('Content-Type', 'application/javascript; charset=utf-8');
    this.ctx.body = sw;
  }
  /** 获取验证码 */
  async getVerifyCode() {
    const { phone, internationalType } = this.ctx.request.body;
    const meta = await this.ctx.service.common.index.getVerifyCode(
      phone,
      internationalType
    );
    this.ctx.body = meta;
  }
  /** 获取国际区号 */
  async getSmsCountry() {
    const { phone, internationalType } = this.ctx.request.body;
    const meta = await this.ctx.service.common.index.getSmsCountry( );
    this.ctx.body = meta;
  }
  /** 是否需要跳转拿取token */
  async hasToken() {
    const { ctx } = this;
    const authToken = ctx.cookies.get('auth') 
    this.ctx.body = {
      message: 'success',
      data: {token:!!authToken},
      status: 200
    };
  
  }

  /** 校验验证码 */
  async checkVerifyCode() {
    const { ctx } = this;
    const { phone, verifycode, internationalType } = ctx.request.body;
    const result = await ctx.service.common.index.checkVerifyCode(
      phone,
      verifycode,
      internationalType
    );
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
        await this.ctx.helper.myReq(
          `${this.app.config.host.server}/api/v1/personal_appoint_pay_notice`,
          {
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
          }
        );
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
        let json = { };

        this.ctx.req.setEncoding("utf8");
        this.ctx.req.on("data", chunk => {
          data += chunk;
        });
    
        this.ctx.req.on("end", async ( ) => {

          const json = fxp.parse( data ).xml;
          this.ctx.logger.info(`wx subscribe -----${JSON.stringify(json)}`);

          // FromUserName 就是openid
          const MsgType = json.MsgType; // 消息类型（event，text等）
          const Content = json.Content; // MsgType为text类型的值
          const eventName = json.Event;
          const openid = json.FromUserName;
          const qrCodeParam = json.hasOwnProperty('EventKey') ? json.EventKey.split("qrscene_")[ 1 ] : '';
          const iac = await this.ctx.service.common.index.getIAC();

          const domain =
            process.env.NODE_ENV === "production"
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
              if( !qrCodeParam ) {
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

                await this.ctx.service.common.index.healthPush(
                  Object.assign( reqData, {
                    url: `${domain}/body-sign/account-bind?${UrlQuery}`
                  })
                );
                return resolve("");

                // 跳到设备绑定页面
              } else if (params.tt === "2") {
                delete params.tt;
                const UrlQuery = querystring.stringify(params);

                await this.ctx.service.common.index.healthPush(
                  Object.assign( reqData, {
                    url: `${domain}/body-sign/bind-guide?${UrlQuery}`
                  })
                );
                return resolve("");
              } else if (params.tt === "3") {
                await this.ctx.service.common.index.followPush({
                  openId: openid,
                  content: '尊敬的客户，您好！\n欢迎关注视源健康yibicom\n预约体检可点击下方菜单栏「供应商预约」入口\n也可点击以下链接进行预约：https://m-health-wx.cvte.com/health-card/my'
                });
                return resolve("");
              }
            }
            return resolve("");
          } else {
            // 收到公众号消息
            this.ctx.logger.info(`收到公众号消息 ----- MsgType: ${MsgType},content: ${Content}`);
            this.ctx.helper.myReq(
              encodeURI(`${this.app.config.host.server}/api/v1/message?openId=${openid}&msg=${MsgType === "text" ? Content : ""}`),
              {
                method: "POST",
                contentType: "json",
                timeout: "1000000",
                headers: {
                  "x-iac-token": iac,
                  "access-token": iac
                }
              }
            );
            return resolve("");
          }
        });
      });

      this.ctx.body = a;
    } catch ( e ) {
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
