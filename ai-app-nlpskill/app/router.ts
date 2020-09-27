import fs from 'fs';
import path from 'path';
import KoaRouter from 'koa-router';

const router = new KoaRouter( );

fs.readdirSync( path.join( __dirname + '/controller' ))
    .map( moduleName => {
        const modulePath = `${path.join( __dirname, `/controller/${moduleName}/router` )}`;
        if ( fs.existsSync(`${modulePath}.js`)) {
            import( modulePath )
                .then( m => {
                    // 注册node路由
                    !!m.default && typeof m.default === 'function' && m.default( router )
                });
        }
    });

export default router