import * as tslib_1 from "tslib";
import { observable, action } from 'mobx';
/** 一个VM的mobx store */
var VM = /** @class */ (function () {
    function VM() {
        this.age = 11;
    }
    VM.prototype.setAge = function (age) {
        this.age = age;
    };
    tslib_1.__decorate([
        observable
    ], VM.prototype, "age", void 0);
    tslib_1.__decorate([
        action.bound
    ], VM.prototype, "setAge", null);
    return VM;
}());
export default new VM();
//# sourceMappingURL=vm.js.map