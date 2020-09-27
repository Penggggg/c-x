"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    const config = {};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLnByb2QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcucHJvZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVlBLGtCQUFlLEdBQUcsRUFBRTtJQUNsQixNQUFNLE1BQU0sR0FBRyxFQUE0QyxDQUFDO0lBRTVELGtCQUFrQjtJQUNsQixNQUFNLENBQUMsR0FBRyxHQUFHO1FBQ1gsT0FBTztRQUNQLE9BQU8sRUFBRSxLQUFLO1FBQ2QsT0FBTztRQUNQLE9BQU8sRUFBRSxJQUFJO1FBQ2IsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxJQUFJLEVBQUUsc0JBQXNCO1FBQzVCLEtBQUssRUFBRSxzQ0FBc0M7S0FDOUMsQ0FBQztJQUVGLE9BQU87SUFDUCxNQUFNLENBQUMsSUFBSSxHQUFHO1FBQ1osY0FBYztRQUNkLElBQUksRUFBRSw4QkFBOEI7UUFDcEMsWUFBWTtRQUNaLFNBQVMsRUFBRSw0QkFBNEI7UUFDdkMsV0FBVztRQUNYLFVBQVUsRUFBRSwwQkFBMEI7UUFDdEMsWUFBWTtRQUNaLE1BQU0sRUFBRSwyQ0FBMkM7UUFDbkQsV0FBVztRQUNYLE1BQU0sRUFBRSxzQ0FBc0M7UUFFOUMsU0FBUyxFQUFFLDhCQUE4QjtLQUMxQyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDIn0=