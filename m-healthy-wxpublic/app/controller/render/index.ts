import { Controller } from 'egg';
import * as path from 'path';
import * as fs from 'fs';

const vueSSR = require('vue-server-renderer');

export default class RenderCtrl extends Controller {

  public async index( ) {

    try {

      const { ctx } = this;
      let matchedPath = '';
      const serverBundle = require( path.join( __dirname, '../../../public/dist/vue-ssr-server-bundle.json'));
      const clientManifest = require( path.join( __dirname, '../../../public/dist/vue-ssr-client-manifest.json'));

      const renderer = vueSSR.createBundleRenderer( serverBundle, {
        clientManifest,
        runInNewContext: false,
        template: fs.readFileSync( path.join( __dirname, '../../web/index.html'), 'utf-8'),
      });

      const extendsLinks = '';
        process.env.NODE_ENV === 'production' ?
        "<script src='https://myou.cvte.com/apm/sdk/reporter.js?appId=m-health-wxpublic'></script>" : ''

      const html = await renderer.renderToString({
        url: ctx.url,
        title: ctx.app.config.appTitle,
        links: extendsLinks,
        cb: matchedData => {
          matchedPath = matchedData;
        },
      });

      ctx.body = html;

    } catch ( e ) {
      console.log('.....', e );
      this.ctx.body = e;
    }
  }
}
