"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (appInfo) => {
    const config = {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLGtCQUFlLENBQUMsT0FBbUIsRUFBRSxFQUFFO0lBQ3JDLE1BQU0sTUFBTSxHQUFHLEVBQTRDLENBQUM7SUFFNUQsa0JBQWtCO0lBQ2xCLE1BQU0sQ0FBQyxHQUFHLEdBQUc7UUFDWCxPQUFPO1FBQ1AsT0FBTyxFQUFFLEtBQUs7UUFDZCxPQUFPO1FBQ1AsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsZ0NBQWdDO1FBQ3ZDLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsS0FBSyxFQUFFLHNDQUFzQztLQUM5QyxDQUFDO0lBRUYsT0FBTztJQUNQLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDWixjQUFjO1FBQ2QsSUFBSSxFQUFFLGdDQUFnQztRQUN0QyxZQUFZO1FBQ1osU0FBUyxFQUFFLDRCQUE0QjtRQUN2QyxXQUFXO1FBQ1gsVUFBVSxFQUFFLDBCQUEwQjtRQUN0QyxZQUFZO1FBQ1osTUFBTSxFQUFFLDJDQUEyQztRQUNuRCxXQUFXO1FBQ1gsTUFBTSxFQUFFLDBDQUEwQztRQUNsRCw4Q0FBOEM7UUFDOUMsU0FBUyxFQUFFLGdDQUFnQztLQUM1QyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDIn0=