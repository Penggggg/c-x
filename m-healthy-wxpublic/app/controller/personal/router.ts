import { Application, Context } from 'egg';

const apiUrl = `/api/personal`;

/** 个人页面模块路由 */
export const personalRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        router.get(`${apiUrl}/test`, controller.personal.index.test )
    }
    return;
};

/**
 *
 * 个人页面模块转发
 * ! 支持多个params参数
 */
export const transfer: transfer = ( ctx: Context, app: Application ) => {
    return [
        {
            url: `${apiUrl}/list`,
            java: `${app.config.host.node}/api/personal/test`,
        },
        {
            url: `${apiUrl}/detail/:id`,
            java: `${app.config.host.node}/p/:id/detail`,
        },
    ];
};