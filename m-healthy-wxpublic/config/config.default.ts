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

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;

  config.static = {
    prefix: '/public/',
    dir: path.join( appInfo.baseDir, 'public')
  };
  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1533611606396_228';

  config.photoPath = 'https://itapis.cvte.com/cfile/c69e6168-d231-4e2a-b0e1-580263f3f77b/v1/download/';

  config.appTitle = "视源健康公众号";

  // add your config here
  config.middleware = [
    // 'ua',
    'access',
    'qyAuth', // 登陆：微信授权，获取openid
    'bodysignBindAuth', // 体征：指定的页面 - 带上是否关注参数
    'bodysignEntry', // 体征：指定页面 - 分流
    'active', // 活动：页面 - 带上是否关注参数
    'javaAuth', // 登陆：校验用户是否绑定、生成jwt - 分流
    'bindAuth', // 账号：指定页面 - 校验
    'transfer', // 公共：转发
  ];

  // 记得更改本地host:port
  config.wmp = {
    // 企业验证
    qyOauth: false,
    // 微信验证
    wxOauth: false,
    local: 'http://192.168.0.113:7001',
    host: 'https://wmp.cvte.com',
    appId: 'c4003c0c-f522-45b3-a2ce-8e0cd382c656',
  };

  // 各项域名
  config.host = {
    /** 本地域名+端口 */
    node: 'http://192.168.0.113:7001',
    /** jwt域名 */
    jwtServer: 'https://csb-api.gz.cvte.cn',
    /** 企业接口 */
    qiyeServer: 'http://10.10.16.187:8081',
    /** 验证码服务 */
    verify: 'https://itapis.cvte.com/verification-code',
    /** 推送平台服务 */
    push: 'https://itapis.cvte.com/wopush-platform',
    /** 后台地址 */
    server: 'https://hmstest-wx-api.gz.cvte.cn/hms-wx',
    // server: 'http://172.17.36.130:65003/hms-wx'
    localHost: 'http://localhost:7001/'
  };

  // iac配置
  config.iac = {
    appid: '8c956ded-2d18-436b-98bc-6477be2a5c9e',
    secret: '7c22adcb-0d2f-4ca0-b9eb-fb52d5fc4e86'
  };

  config.security = {
    csrf: {
      enable: false
    }
  }

  return config;
};
