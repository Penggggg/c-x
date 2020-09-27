import { http } from '../service/http';
export var HttpPlugin = {
    install: function (vue, opts) {
        vue.prototype._http = http;
    },
};
//# sourceMappingURL=http.js.map