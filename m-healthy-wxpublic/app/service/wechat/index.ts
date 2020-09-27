

import { Context, Service } from 'egg';
import * as ciac from '@cvte/ciac';

/** 微信服务 */
export default class WechatService extends Service {

  constructor( ctx: Context ) {
    super( ctx );
  }

  /** 根据openid获取用户信息 */
  async getUserInfo( openid ) {
    const ctx = this.ctx;
    const wmpConfig = ctx.app.config.wmp;
    const accessToken = await ctx.service.iac.index.getToken();
    const result = await ctx.curl(
      `${wmpConfig.host}/apis/${wmpConfig.appId}/user/${openid}`,
      {
        headers: {
          'access-token': accessToken,
        },
        dataType: 'json',
      },
    );
    return result.data;
  }

  /** 获取用户（企业号） */
  async getQyUsername(code) {
    const ctx = this.ctx;
    const wmpConfig = ctx.app.config.wmp;

    const accessToken = await ctx.service.iac.index.getToken();

    const result = await ctx.curl(
      `${wmpConfig.host}/apis/${wmpConfig.appId}/qy_oauth_get_user`,
      {
        headers: {
          'access-token': accessToken,
        },
        data: { code },
        dataType: 'json',
      },
    );

    return result.data;
  }

  /** 获取用户（公众号） */
  async getWxUserData(code) {
    const ctx = this.ctx;
    const wmpConfig = ctx.app.config.wmp;

    const accessToken = await ctx.service.iac.index.getToken();

    const result = await ctx.curl(
      `${wmpConfig.host}/apis/${wmpConfig.appId}/oauth_get_user`,
      {
        headers: {
          'access-token': accessToken,
        },
        data: { code },
        dataType: 'json',
      },
    );

    return result.data;
  }

  /** 根据hcm的人员ID，获取对应的信息 */
  async getQyUserData( id ) {

    const ctx = this.ctx;
    const { qiyeServer } = ctx.app.config.host;
    const accessToken = await ctx.service.iac.index.getToken( );

    const result = await ctx.curl(
      `${qiyeServer}/wx-sync/user/search`,
      {
        headers: {
          'access-token': accessToken,
        },
        data: {
          data: id,
        },
        dataType: 'json',
      },
    );
    return result.data;

  }

  

}
