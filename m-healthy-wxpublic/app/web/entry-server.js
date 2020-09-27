import { createApp } from './app';
/**
 * @argument context { cb: matchedPath => // ... }
 */
export default (function (context) {
    return new Promise(function (resolve, reject) {
        var _a = createApp(), app = _a.app, router = _a.router;
        router.push(context.url);
        router.onReady(function () {
            var matchedComponents = router.getMatchedComponents();
            if (!matchedComponents.length) {
                context.cb(null);
                return reject(404);
            }
            var matches = router.currentRoute.matched;
            var matchedPath = matches[matches.length - 1].path;
            Promise.all(matchedComponents.map(function (Component) {
                if (Component.asyncData) {
                    return Component.asyncData({
                        route: router.currentRoute,
                    });
                }
            })).then(function () {
                context.cb(matchedPath);
                resolve(app);
            }).catch(reject);
        }, reject);
    });
});
//# sourceMappingURL=entry-server.js.map