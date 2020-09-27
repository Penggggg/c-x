import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
}


export default () => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  // 记得更改本地host:port
  config.wmp = {
    // 企业验证
    qyOauth: false,
    // 微信验证
    wxOauth: true,
    local: 'https://m-health-wx.cvte.com',
    host: 'https://wmp.cvte.com',
    appId: '303741c5-bc48-45fc-9bd4-6a0631b214ee',
  };

  // 各项域名
  config.host = {
    /** 本地域名+端口 */
    node: 'https://m-health-wx.cvte.com',
    /** jwt域名 */
    jwtServer: 'https://csb-api.gz.cvte.cn',
    /** 企业接口 */
    qiyeServer: 'http://10.10.16.187:8081',
    /** 验证码服务 */
    verify: 'https://itapis.cvte.com/verification-code',
    /** 后台地址 */
    server: 'https://hms-wx-api.gz.cvte.cn/hms-wx',

    localHost: 'https://m-health-wx.cvte.com'
  };

  return config;
};
