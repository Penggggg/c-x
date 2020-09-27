import { Application, Context } from 'egg';

const apiUrl = `/api/health-card`;

/** 健康卡模块路由 */
export const healthCardRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {

    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
    const { server } = app.config.host;
    return [
        {
            /** 健康卡列表 */
            url: `${apiUrl}`,
            java: `${server}/api/v1/user_cards`
        }, {
            /** 添加健康卡 */
            url: `${apiUrl}/bind`,
            java: `${server}/api/v1/card_bind`
        }, {
            /** 详情 */
            url: `${apiUrl}/detail/:id`,
            java: `${server}/api/v1/card/:id`
        }, {
            /** 获取推荐套餐 */
            url: `${apiUrl}/package/:id`,
            java: `${server}/api/v1/card/:id/packages`
        }
    ]
}