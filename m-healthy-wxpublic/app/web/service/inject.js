import { Observer } from 'mobx-vue';
import { mappingStore } from '../store';
export var inject = function (injectOpt) {
    return function (view) {
        if (Array.isArray(injectOpt.selector)) {
            injectOpt.selector.map(function (storeName) {
                view.prototype[storeName] = mappingStore[storeName];
            });
        }
        return Observer(view);
    };
};
//# sourceMappingURL=inject.js.map