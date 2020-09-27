import * as tslib_1 from "tslib";
import { httpv2 } from '../../service/httpv2';
import { observable, action } from 'mobx';
/** 微信数据的store */
var Wx = /** @class */ (function () {
    function Wx() {
        /** 加载中 */
        this.loading = true;
        /** 是否已经绑定过 */
        this.hasBeenBound = false;
        /** 微信相关账号信 */
        this.data = {
            appid: '',
            openid: '',
            avatar: ''
        };
        /** 系统账号相关信息 */
        this.systemUser = {
            id: '',
            name: '',
            birthday: '',
            domainName: '',
            gender: '',
            userType: '',
            email: '',
            telephone: '',
            maritalStatus: null,
            identityCard: '',
            company: ''
        };
    }
    /** 获取微信相关账号信息 */
    Wx.prototype.getData = function () {
        var _this = this;
        httpv2.get({
            url: '/api/account/wx'
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            var appid = data.appid, openid = data.openid;
            _this.data = data;
            _this.getSysData(appid, openid);
        });
    };
    /** 获取系统相关账号信息 */
    Wx.prototype.getSysData = function (appId, openId) {
        var _this = this;
        return httpv2.get({
            url: "/api/account/system?appId=" + appId + "&openId=" + openId
        }, {
            loadMsg: '加载中...'
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return _this.hasBeenBound = false;
            }
            _this.loading = false;
            _this.systemUser = data;
            _this.hasBeenBound = !!data ? true : false;
            return data;
        });
    };
    tslib_1.__decorate([
        observable
    ], Wx.prototype, "loading", void 0);
    tslib_1.__decorate([
        observable
    ], Wx.prototype, "hasBeenBound", void 0);
    tslib_1.__decorate([
        observable
    ], Wx.prototype, "data", void 0);
    tslib_1.__decorate([
        observable
    ], Wx.prototype, "systemUser", void 0);
    tslib_1.__decorate([
        action.bound
    ], Wx.prototype, "getData", null);
    tslib_1.__decorate([
        action.bound
    ], Wx.prototype, "getSysData", null);
    return Wx;
}());
export default Wx;
//# sourceMappingURL=wx.js.map