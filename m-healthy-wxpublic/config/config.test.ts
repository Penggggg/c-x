import * as path from 'path';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  // 记得更改本地host:port
  config.wmp = {
    // 企业验证
    qyOauth: false,
    // 微信验证
    wxOauth: true,
    local: 'http://m-health-wx.cvteapi.com',
    host: 'https://wmp.cvte.com',
    appId: 'c4003c0c-f522-45b3-a2ce-8e0cd382c656',
  };

  // 各项域名
  config.host = {
    /** 本地域名+端口 */
    node: 'http://m-health-wx.cvteapi.com',
    /** jwt域名 */
    jwtServer: 'https://csb-api.gz.cvte.cn',
    /** 企业接口 */
    qiyeServer: 'http://10.10.16.187:8081',
    /** 验证码服务 */
    verify: 'https://itapis.cvte.com/verification-code',
    /** 后台地址 */
    server: 'https://hmstest-wx-api.gz.cvte.cn/hms-wx',
    // server: 'http://172.17.36.130:65003/hms-wx'
    localHost: 'http://m-health-wx.cvteapi.com'
  };

  return config;
};
