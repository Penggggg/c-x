import { loading } from '../service/loading';
export var LoadingPlugin = {
    install: function (vue, opts) {
        vue.prototype.loading$ = loading;
    },
};
//# sourceMappingURL=loading.js.map