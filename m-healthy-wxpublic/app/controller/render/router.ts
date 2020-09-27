import { Application, Context } from 'egg';

/** vue-ssr-render */
export const renderRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {
        router.get(/^(?!\/api).*$/, controller.render.index.index );
    }
    return;
}