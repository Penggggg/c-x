"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const path = require("path");
const fs = require("fs");
const vueSSR = require('vue-server-renderer');
class RenderCtrl extends egg_1.Controller {
    async index() {
        try {
            const { ctx } = this;
            let matchedPath = '';
            const serverBundle = require(path.join(__dirname, '../../../public/dist/vue-ssr-server-bundle.json'));
            const clientManifest = require(path.join(__dirname, '../../../public/dist/vue-ssr-client-manifest.json'));
            const renderer = vueSSR.createBundleRenderer(serverBundle, {
                clientManifest,
                runInNewContext: false,
                template: fs.readFileSync(path.join(__dirname, '../../web/index.html'), 'utf-8'),
            });
            const extendsLinks = '';
            process.env.NODE_ENV === 'production' ?
                "<script src='https://myou.cvte.com/apm/sdk/reporter.js?appId=m-health-wxpublic'></script>" : '';
            const html = await renderer.renderToString({
                url: ctx.url,
                title: ctx.app.config.appTitle,
                links: extendsLinks,
                cb: matchedData => {
                    matchedPath = matchedData;
                },
            });
            ctx.body = html;
        }
        catch (e) {
            console.log('.....', e);
            this.ctx.body = e;
        }
    }
}
exports.default = RenderCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUNqQyw2QkFBNkI7QUFDN0IseUJBQXlCO0FBRXpCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRTlDLE1BQXFCLFVBQVcsU0FBUSxnQkFBVTtJQUV6QyxLQUFLLENBQUMsS0FBSztRQUVoQixJQUFJO1lBRUYsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7WUFDckIsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLGlEQUFpRCxDQUFDLENBQUMsQ0FBQztZQUN4RyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUUsSUFBSSxDQUFDLElBQUksQ0FBRSxTQUFTLEVBQUUsbURBQW1ELENBQUMsQ0FBQyxDQUFDO1lBRTVHLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBRSxZQUFZLEVBQUU7Z0JBQzFELGNBQWM7Z0JBQ2QsZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFFBQVEsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFFLElBQUksQ0FBQyxJQUFJLENBQUUsU0FBUyxFQUFFLHNCQUFzQixDQUFDLEVBQUUsT0FBTyxDQUFDO2FBQ25GLENBQUMsQ0FBQztZQUVILE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLENBQUMsQ0FBQztnQkFDdkMsMkZBQTJGLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtZQUVsRyxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLENBQUM7Z0JBQ3pDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztnQkFDWixLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUTtnQkFDOUIsS0FBSyxFQUFFLFlBQVk7Z0JBQ25CLEVBQUUsRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDaEIsV0FBVyxHQUFHLFdBQVcsQ0FBQztnQkFDNUIsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBRWpCO1FBQUMsT0FBUSxDQUFDLEVBQUc7WUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7U0FDbkI7SUFDSCxDQUFDO0NBQ0Y7QUFyQ0QsNkJBcUNDIn0=