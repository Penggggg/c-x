"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whiteList = [
    '/wx_o',
    '/clear_cookies',
    '/api/common/wx-follow',
    '/api/common/wxpay-notify',
    '/api/order/notify',
    '/api/record/download',
    '/body-sign/bind-guide'
];
/**
 * @description
 * 登陆：微信授权
 * redirect到wmp，并获取openid
 * 可配置白名单
 */
exports.default = () => {
    return async (ctx, next) => {
        const wmpConfig = ctx.app.config.wmp;
        const authToken = ctx.cookies.get('auth');
        if (wmpConfig.qyOauth || wmpConfig.wxOauth) {
            if (whiteList.some(x => ctx.url.indexOf(x) !== -1) || ctx.request.url === '/') {
                await next();
            }
            else {
                if (!authToken) {
                    const redirectUrl = `${wmpConfig.local}/wx_o?n=${encodeURIComponent(ctx.url)}`;
                    ctx.redirect(`${wmpConfig.host}/${wmpConfig.appId}/oauth?url=${encodeURIComponent(redirectUrl)}&type=1`);
                }
                else {
                    await next();
                }
            }
        }
        else {
            /** mock */
            await ctx.service.jwt.index.setItem('account.openid', 'o8t9E0UQ_V7xO2_8aKQLfKwXW6Gg');
            ctx.cookies.set('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7InN5c2lkIjoiIiwib3BlbmlkIjoibzh0OUUwVVFfVjd4TzJfOGFLUUxmS3dYVzZHZyIsIm5pY2tuYW1lIjoi7oGU7pSg7oCZ7pSiIiwic2V4IjoxLCJsYW5ndWFnZSI6IiIsImNpdHkiOiIiLCJwcm92aW5jZSI6IiIsImNvdW50cnkiOiIiLCJoZWFkaW1ndXJsIjoiaHR0cDovL3RoaXJkd3gucWxvZ28uY24vbW1vcGVuL3ZpXzMyL1JmWERHendOdWRLdUM4UUhQMXNpYzg2aWE1UFlCSDhRcmNuaWJ3b1E4eGhkU0FmNG5pYmlhMUZ4RzI1SDlpY3IxejBwUmpLZWd2ZFZpYTNRNVlxMGQ1dXNmWHpydy8xMzIiLCJwcml2aWxlZ2UiOltdfSwiaWF0IjoxNTM3MzI5NjMwfQ.465YuWVk2nrxGUIfjtSMajZ25vYuSr5C8UOPLoqMaiI');
            await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXlfYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF5X2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLFNBQVMsR0FBRztJQUNoQixPQUFPO0lBQ1AsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtJQUN2QiwwQkFBMEI7SUFDMUIsbUJBQW1CO0lBQ25CLHNCQUFzQjtJQUN0Qix1QkFBdUI7Q0FDeEIsQ0FBQztBQUVGOzs7OztHQUtHO0FBQ0gsa0JBQWUsR0FBSSxFQUFFO0lBQ2pCLE9BQU8sS0FBSyxFQUFFLEdBQVksRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUVsQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMsSUFBSyxTQUFTLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUc7WUFFNUMsSUFBSyxTQUFTLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFFLEtBQUssQ0FBQyxDQUFDLENBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUc7Z0JBQ25GLE1BQU0sSUFBSSxFQUFHLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxJQUFLLENBQUMsU0FBUyxFQUFHO29CQUNoQixNQUFNLFdBQVcsR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLFdBQVcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7b0JBQy9FLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxLQUFLLGNBQWMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUMxRztxQkFBTTtvQkFDTCxNQUFNLElBQUksRUFBRyxDQUFDO2lCQUNmO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsV0FBVztZQUNYLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBRSxnQkFBZ0IsRUFBRSw4QkFBOEIsQ0FBRSxDQUFDO1lBQ3hGLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSw2Z0JBQTZnQixDQUFDLENBQUM7WUFDdmlCLE1BQU0sSUFBSSxFQUFHLENBQUM7U0FDZjtJQUVILENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9