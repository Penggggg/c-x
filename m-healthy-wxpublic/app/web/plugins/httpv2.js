import { httpv2 } from '../service/httpv2';
export var HttpPluginV2 = {
    install: function (vue, opts) {
        vue.prototype.http$ = httpv2;
    },
};
//# sourceMappingURL=httpv2.js.map