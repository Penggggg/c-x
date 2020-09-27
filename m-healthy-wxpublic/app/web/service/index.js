import Wx from './wx';
/** 账号相关的store */
var Account = /** @class */ (function () {
    function Account() {
        /** 微信数据的store */
        this.wx = new Wx();
    }
    return Account;
}());
export default new Account();
//# sourceMappingURL=index.js.map