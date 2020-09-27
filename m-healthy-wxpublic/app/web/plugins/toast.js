import { $toast } from '../service/toast';
export var ToastPlugin = {
    install: function (vue, opts) {
        vue.prototype.$toast = $toast;
    },
};
//# sourceMappingURL=toast.js.map