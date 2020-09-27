var MuseUIToast = require('muse-ui-toast').default;
var MyToast = /** @class */ (function () {
    function MyToast() {
    }
    MyToast.prototype.message = function (msg) {
        this.origin('message', msg);
    };
    MyToast.prototype.success = function (msg) {
        this.origin('success', msg);
    };
    MyToast.prototype.info = function (msg) {
        this.origin('info', msg);
    };
    MyToast.prototype.warning = function (msg) {
        this.origin('warning', msg);
    };
    MyToast.prototype.error = function (msg) {
        this.origin('error', msg);
    };
    MyToast.prototype.origin = function (type, msg) {
        MuseUIToast.config({
            position: 'top',
        });
        MuseUIToast[type](msg);
    };
    return MyToast;
}());
export var $toast = new MyToast();
//# sourceMappingURL=toast.js.map