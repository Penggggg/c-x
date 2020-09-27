"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.default = (appInfo) => {
    const config = {};
    // app special config
    config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;
    config.static = {
        prefix: '/public/',
        dir: path.join(appInfo.baseDir, 'public')
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
        'qyAuth',
        'bodysignBindAuth',
        'bodysignEntry',
        'active',
        'javaAuth',
        'bindAuth',
        'transfer',
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
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQVc3QixrQkFBZSxDQUFDLE9BQW1CLEVBQUUsRUFBRTtJQUNyQyxNQUFNLE1BQU0sR0FBRyxFQUE0QyxDQUFDO0lBRTVELHFCQUFxQjtJQUNyQixNQUFNLENBQUMsU0FBUyxHQUFHLGlEQUFpRCxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFbkYsTUFBTSxDQUFDLE1BQU0sR0FBRztRQUNkLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO0tBQzNDLENBQUM7SUFDRiwwQ0FBMEM7SUFDMUMsdUVBQXVFO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQztJQUVsRCxNQUFNLENBQUMsU0FBUyxHQUFHLGlGQUFpRixDQUFDO0lBRXJHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBRTVCLHVCQUF1QjtJQUN2QixNQUFNLENBQUMsVUFBVSxHQUFHO1FBQ2xCLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLGtCQUFrQjtRQUNsQixlQUFlO1FBQ2YsUUFBUTtRQUNSLFVBQVU7UUFDVixVQUFVO1FBQ1YsVUFBVTtLQUNYLENBQUM7SUFFRixrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUNYLE9BQU87UUFDUCxPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU87UUFDUCxPQUFPLEVBQUUsS0FBSztRQUNkLEtBQUssRUFBRSwyQkFBMkI7UUFDbEMsSUFBSSxFQUFFLHNCQUFzQjtRQUM1QixLQUFLLEVBQUUsc0NBQXNDO0tBQzlDLENBQUM7SUFFRixPQUFPO0lBQ1AsTUFBTSxDQUFDLElBQUksR0FBRztRQUNaLGNBQWM7UUFDZCxJQUFJLEVBQUUsMkJBQTJCO1FBQ2pDLFlBQVk7UUFDWixTQUFTLEVBQUUsNEJBQTRCO1FBQ3ZDLFdBQVc7UUFDWCxVQUFVLEVBQUUsMEJBQTBCO1FBQ3RDLFlBQVk7UUFDWixNQUFNLEVBQUUsMkNBQTJDO1FBQ25ELGFBQWE7UUFDYixJQUFJLEVBQUUseUNBQXlDO1FBQy9DLFdBQVc7UUFDWCxNQUFNLEVBQUUsMENBQTBDO1FBQ2xELDhDQUE4QztRQUM5QyxTQUFTLEVBQUUsd0JBQXdCO0tBQ3BDLENBQUM7SUFFRixRQUFRO0lBQ1IsTUFBTSxDQUFDLEdBQUcsR0FBRztRQUNYLEtBQUssRUFBRSxzQ0FBc0M7UUFDN0MsTUFBTSxFQUFFLHNDQUFzQztLQUMvQyxDQUFDO0lBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNoQixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsS0FBSztTQUNkO0tBQ0YsQ0FBQTtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9