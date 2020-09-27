var Loading = require('muse-ui-loading').default;
var Loading$ = /** @class */ (function () {
    function Loading$() {
    }
    Loading$.prototype.msg = function (msg) {
        return Loading({
            size: 30,
            text: msg,
            color: '#fff',
            className: 'decorate-loading',
            overlayColor: 'rgba( 0, 0, 0, 0.6)',
        });
    };
    return Loading$;
}());
export var loading = new Loading$();
//# sourceMappingURL=loading.js.map