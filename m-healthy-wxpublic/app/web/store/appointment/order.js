import * as tslib_1 from "tslib";
import { httpv2 } from "../../service/httpv2";
import { observable, action, toJS } from "mobx";
/** 判断字典值是否存在 */
var checkDicExist = function (code, dic) {
    var _code = code.split(",");
    var res = [];
    _code.map(function (item) {
        if (toJS(dic[item]).length === 0)
            res.push(item);
    });
    return res.join(",");
};
/** 预约整合 */
var Order = /** @class */ (function () {
    function Order() {
        var _a;
        /** 健康中心Id */
        this.hospitalId = "";
        this.HMS_CLINIC_FIRST_DEPT = "HMS_CLINIC_FIRST_DEPT"; // 一级科室
        this.HMS_DOCTOR_POSITION = "HMS_DOCTOR_POSITION"; // 医生职级
        this.dictionary = (_a = {},
            _a[this.HMS_CLINIC_FIRST_DEPT] = [],
            _a[this.HMS_DOCTOR_POSITION] = [],
            _a);
        /** 当前健康中心 */
        this.currentHospital = {
            id: "",
            name: ""
        };
        // /** 获取客户端ip */
        // @action.bound getClientIp( ) {
        //     httpv2.get({
        //         url: `/api/common/client-ip`
        //     }).then(( res: any ) => {
        //         this.ip = res;
        //     });
        // }
        // /** 获取系统相关账号信息 */
        // @action.bound getSysData( appId, openId ) {
        //     return httpv2.get<normalResult<App.systemUser>>({
        //         url: `/api/account/system?appId=${appId}&openId=${openId}`
        //     }, {
        //         loadMsg: '加载中...'
        //     }).then( res => {
        //         const { status, data } = res;
        //         if ( status !== 200 ) {
        //             return this.hasBeenBound = false;
        //         }
        //         this.loading = false;
        //         this.systemUser = data;
        //         this.hasBeenBound = !!data ? true : false;
        //         localStorage.setItem( 'username$', data.name );
        //         localStorage.setItem( 'telephone$', data.telephone );
        //         localStorage.setItem( 'sysid$', data.id );
        //         return data;
        //     });
        // }
    }
    /** 获取常规数据字典 */
    Order.prototype.loadCommonDic = function () {
        var _this = this;
        var code = "HMS_CLINIC_FIRST_DEPT,HMS_DOCTOR_POSITION";
        code = checkDicExist(code, this.dictionary);
        code &&
            httpv2
                .get({
                url: "/api/common/dic?typeCode= " + code
            })
                .then(function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.dictionary = Object.assign(_this.dictionary, data);
            });
    };
    tslib_1.__decorate([
        observable
    ], Order.prototype, "hospitalId", void 0);
    tslib_1.__decorate([
        observable
    ], Order.prototype, "HMS_CLINIC_FIRST_DEPT", void 0);
    tslib_1.__decorate([
        observable
    ], Order.prototype, "HMS_DOCTOR_POSITION", void 0);
    tslib_1.__decorate([
        observable
    ], Order.prototype, "dictionary", void 0);
    tslib_1.__decorate([
        observable
    ], Order.prototype, "currentHospital", void 0);
    tslib_1.__decorate([
        action.bound
    ], Order.prototype, "loadCommonDic", null);
    return Order;
}());
export default Order;
//# sourceMappingURL=order.js.map