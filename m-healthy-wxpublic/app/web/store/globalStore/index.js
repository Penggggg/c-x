import Store from './store';
/** 全局的store */
var GlobalStore = /** @class */ (function () {
    function GlobalStore() {
        /** 全局数据的store */
        this.Store = new Store();
    }
    return GlobalStore;
}());
export default new GlobalStore();
//# sourceMappingURL=index.js.map