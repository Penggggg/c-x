"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var watch_1 = require("../../utils/watch");
var cloudHttp_1 = require("../../utils/cloudHttp");
var index_1 = require("../../config/index");
var constant_1 = require("../../utils/constant");
var Auth = (function () {
    function Auth() {
        this.openid = '';
        this.isIPhoneX = false;
        this.isUserAuth = false;
        this.isMarkerExpand = false;
        this.isDistributor = false;
        this.wxUserDeviceInfo = null;
        this.sysUserInfo = null;
    }
    Auth.prototype.init = function () {
        var _this = this;
        wx.getSetting({
            success: function (res) {
                console.log('【授权状态】', res.authSetting);
                var isUserAuth = res.authSetting['scope.userInfo'];
                _this.isUserAuth = isUserAuth === undefined ? false : isUserAuth;
            }
        });
    };
    Auth.prototype.getSystemInfo = function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                console.log('结果啊 ', res);
                _this.wxUserDeviceInfo = res;
                res.model.indexOf('iPhone X') >= 0 && (_this.isIPhoneX = true);
            }
        });
    };
    Auth.prototype.getUserAuth = function () {
        var _this = this;
        return new Promise(function (r) {
            wx.getUserInfo({
                success: function (res) {
                    _this.isUserAuth = true;
                    _this.wxUserInfo = res.userInfo;
                }
            });
        });
    };
    Auth.prototype.getSystemUser = function (openid, appid) {
        var _this = this;
        if (openid === void 0) { openid = this.openid; }
        if (appid === void 0) { appid = index_1.default.app.appId; }
        return http_1.http({
            path: "/apis/member/node/find-visitor?wxAppId=" + appid + "&wxOpenId=" + openid
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return false;
            }
            _this.sysUserInfo = data;
            wx.setStorageSync(constant_1.StorageKey.SYSTEM_USER_INFO, JSON.stringify(data));
            return true;
        });
    };
    ;
    Auth.prototype.getUserPhoneAndRegister = function (e, register, code) {
        var _this = this;
        if (register === void 0) { register = false; }
        if (code === void 0) { code = ''; }
        return new Promise(function (r, j) {
            if (!e.detail.encryptedData) {
                return j();
            }
            var _a = e.detail, encryptedData = _a.encryptedData, iv = _a.iv;
            return _this.sysRegister({
                iv: iv,
                code: code,
                encryptedData: encryptedData
            })
                .then(function (e) {
                if (!!e) {
                    r(e);
                }
                else {
                    j();
                }
            });
        });
    };
    Auth.prototype.sysRegister = function (data) {
        var _this = this;
        var inviterId = wx.getStorageSync(constant_1.StorageKey.REGISTER_INVITER);
        var inviterSourceType = wx.getStorageSync(constant_1.StorageKey.REGISTER_INVITER_TYPE);
        var reqData = __assign({}, data, { sourceSys: 'SYS', sourceType: 'WX', inviterId: inviterId || '', inviterSourceType: inviterSourceType || '', name: "CV" + (Math.random() * 9999).toFixed(0), memberWxRel: {
                wxOpenId: this.openid,
                wxAppId: index_1.default.app.appId
            } });
        return http_1.http({
            data: reqData,
            method: 'post',
            path: "/apis/member/node/register"
        }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var status, data;
            return __generator(this, function (_a) {
                status = res.status, data = res.data;
                if (status !== 200) {
                    return [2, null];
                }
                this.sysUserInfo = data;
                return [2, data];
            });
        }); });
    };
    Auth.prototype.getOpenid = function () {
        var _this = this;
        return cloudHttp_1.cloudHttp({
            url: 'auth_login',
            success: function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                _this.openid = data;
            }
        });
    };
    Auth.prototype.bindVisitor = function () {
        var _this = this;
        setTimeout(function () {
            var inviterId = wx.getStorageSync(constant_1.StorageKey.REGISTER_INVITER);
            if (!inviterId) {
                return;
            }
            http_1.http({
                data: {
                    inviterId: inviterId,
                    wxOpenId: _this.openid,
                    wxAppId: index_1.default.app.appId
                },
                method: 'POST',
                path: "/apis/member/bind-visitor"
            }).then(function (res) {
                var data = res.data, status = res.status;
                if (status !== 200) {
                    return;
                }
            });
        }, 5000);
    };
    Auth.prototype.judgeMarkerExpand = function () {
        var _this = this;
        var id = this.sysUserInfo.id;
        if (!id) {
            return;
        }
        return http_1.http({
            path: "/apis/partner/is-market-expand-user"
        }).then(function (res) {
            var data = res.data, status = res.status;
            if (status !== 200) {
                return;
            }
            _this.isMarkerExpand = data;
        });
    };
    Auth.prototype.judgeDistributor = function () {
        var _this = this;
        var id = this.sysUserInfo.id;
        if (!id) {
            return;
        }
        return http_1.http({
            path: "/apis/distributor/checkIsDistributor"
        }).then(function (res) {
            var data = res.data, status = res.status;
            if (status !== 200) {
                return;
            }
            _this.isDistributor = data;
        });
    };
    return Auth;
}());
exports.default = watch_1.watch('Auth', new Auth());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5Q0FBd0M7QUFDeEMsMkNBQTBDO0FBQzFDLG1EQUFrRDtBQUNsRCw0Q0FBd0M7QUFDeEMsaURBQWtEO0FBUWxEO0lBQUE7UUFHVyxXQUFNLEdBQUcsRUFBRSxDQUFDO1FBR1osY0FBUyxHQUFHLEtBQUssQ0FBQztRQUdsQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBR25CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBR3ZCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBTXRCLHFCQUFnQixHQUFRLElBQUksQ0FBQztRQUc3QixnQkFBVyxHQUFRLElBQUksQ0FBQztJQXlPbkMsQ0FBQztJQXRPVSxtQkFBSSxHQUFYO1FBQUEsaUJBU0M7UUFSRyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1YsT0FBTyxFQUFFLFVBQUEsR0FBRztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFFLENBQUM7Z0JBRXhDLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDckQsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUNwRSxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdNLDRCQUFhLEdBQXBCO1FBQUEsaUJBUUM7UUFQRyxFQUFFLENBQUMsYUFBYSxDQUFDO1lBQ2IsT0FBTyxFQUFFLFVBQUMsR0FBRztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDekIsS0FBSSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FB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QUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVMLFdBQUM7QUFBRCxDQUFDLEFBalFELElBaVFDO0FBRUQsa0JBQWUsYUFBSyxDQUFRLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyB3YXRjaCB9IGZyb20gJy4uLy4uL3V0aWxzL3dhdGNoJztcbmltcG9ydCB7IGNsb3VkSHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2Nsb3VkSHR0cCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleCc7XG5pbXBvcnQgeyBTdG9yYWdlS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnQnO1xuXG5cbi8qKlxuICogQGRlcHJlY2F0ZWRcbiAqIOeZu+mZhueahOaVtOS9k+a1geeoi1xuICogXG4gKi9cbmNsYXNzIEF1dGgge1xuXG4gICAgLyoqIOW9k+WJjeeZu+mZhuS6uueahG9wZW5pZCAqL1xuICAgIHB1YmxpYyBvcGVuaWQgPSAnJztcblxuICAgIC8qKiDmmK/lkKbkuLppUG9uZVggKi9cbiAgICBwdWJsaWMgaXNJUGhvbmVYID0gZmFsc2U7XG5cbiAgICAvKiog5piv5ZCm55So5oi35o6I5p2D5LqGICovXG4gICAgcHVibGljIGlzVXNlckF1dGggPSBmYWxzZTtcblxuICAgIC8qKiDmmK/lkKbkuLrluILlnLrmi5PlsZXlkZggKi9cbiAgICBwdWJsaWMgaXNNYXJrZXJFeHBhbmQgPSBmYWxzZTtcblxuICAgIC8qKiDmmK/lkKbkuLrliIbplIDlkZggKi9cbiAgICBwdWJsaWMgaXNEaXN0cmlidXRvciA9IGZhbHNlO1xuXG4gICAgLyoqIOW+ruS/oeeUqOaIt+S/oeaBryAqL1xuICAgIHB1YmxpYyB3eFVzZXJJbmZvITogd3guVXNlckluZm87XG5cbiAgICAvKiog5b6u5L+h55So5oi36K6+5aSH5L+h5oGvICovXG4gICAgcHVibGljIHd4VXNlckRldmljZUluZm86IGFueSA9IG51bGw7XG5cbiAgICAvKiog5ZCO5Y+w55So5oi35L+h5oGvICovXG4gICAgcHVibGljIHN5c1VzZXJJbmZvOiBhbnkgPSBudWxsO1xuXG4gICAgLyoqIOWIneWni+WMluaOiOadg+eKtuaAgSAqL1xuICAgIHB1YmxpYyBpbml0KCApIHtcbiAgICAgICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfjgJDmjojmnYPnirbmgIHjgJEnLCByZXMuYXV0aFNldHRpbmcgKTtcbiAgICAgICAgICAgICAgICAvLyDmmK/lkKblt7Lnu4/mjojmnYNcbiAgICAgICAgICAgICAgICBjb25zdCBpc1VzZXJBdXRoID0gcmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVc2VyQXV0aCA9IGlzVXNlckF1dGggPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogaXNVc2VyQXV0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOiOt+WPlueUqOaIt+iuvuWkh+S/oeaBryAqLyBcbiAgICBwdWJsaWMgZ2V0U3lzdGVtSW5mbyggKXtcbiAgICAgICAgd3guZ2V0U3lzdGVtSW5mbyh7XG4gICAgICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnu5PmnpzllYogJywgcmVzKTtcbiAgICAgICAgICAgICAgdGhpcy53eFVzZXJEZXZpY2VJbmZvID0gcmVzO1xuICAgICAgICAgICAgICByZXMubW9kZWwuaW5kZXhPZignaVBob25lIFgnKSA+PSAwICYmICh0aGlzLmlzSVBob25lWCA9IHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqIOiOt+WPlueUqOaIt+aOiOadg+OAgeW+ruS/oeeUqOaIt+S/oeaBryAqL1xuICAgIHB1YmxpYyBnZXRVc2VyQXV0aCggKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggciA9PiB7XG4gICAgICAgICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VzZXJBdXRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53eFVzZXJJbmZvID0gcmVzLnVzZXJJbmZvO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiog6I635Y+W5ZCO5Y+w55qE55So5oi35L+h5oGvICovXG4gICAgcHVibGljIGdldFN5c3RlbVVzZXIoIG9wZW5pZCA9IHRoaXMub3BlbmlkLCBhcHBpZCA9IGNvbmZpZy5hcHAuYXBwSWQgKSB7XG4gICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9tZW1iZXIvbm9kZS9maW5kLXZpc2l0b3I/d3hBcHBJZD0ke2FwcGlkfSZ3eE9wZW5JZD0ke29wZW5pZH1gXG4gICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCAgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICAgICAgICB0aGlzLnN5c1VzZXJJbmZvID0gZGF0YTtcblxuICAgICAgICAgICAgLy8gMeOAgei/mOmcgOimgeWtmOi1t+adpe+8jOS7peS+v2h0dHDmqKHlnZforr/pl65cbiAgICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKCBTdG9yYWdlS2V5LlNZU1RFTV9VU0VSX0lORk8sIEpTT04uc3RyaW5naWZ5KCBkYXRhICkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICF0b2RvXG4gICAgICAgICAgICAgKiAy44CB5YaN6LCD5LiA5LiL77yMbWVtYmVyaWQg57uR5a6aIOiuv+WuoueahOaOpeWPo1xuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KVxuICAgIH07XG5cbiAgICAvKiogXG4gICAgICog6I635Y+W55So5oi35omL5py65o6I5p2DXG4gICAgICog5bm26L+b6KGM5rOo5YaMXG4gICAgICovXG4gICAgcHVibGljIGdldFVzZXJQaG9uZUFuZFJlZ2lzdGVyKCBlLCByZWdpc3RlciA9IGZhbHNlLCBjb2RlID0gJycgKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoIHIsIGogKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICggIWUuZGV0YWlsLmVuY3J5cHRlZERhdGEgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGooICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHsgZW5jcnlwdGVkRGF0YSwgaXYgfSA9IGUuZGV0YWlsO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zeXNSZWdpc3Rlcih7XG4gICAgICAgICAgICAgICAgaXYsXG4gICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICBlbmNyeXB0ZWREYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oIGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggISFlICkge1xuICAgICAgICAgICAgICAgICAgICByKCBlICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaiggKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBjbG91ZEh0dHAoe1xuICAgICAgICAgICAgLy8gICAgIHVybDogJ2F1dGhfanNsb2dpbicsXG4gICAgICAgICAgICAvLyAgICAgZGF0YToge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb2RlXG4gICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgIC8vICAgICBzdWNjZXNzOiByZXMgPT4ge1xuXG4gICAgICAgICAgICAvLyAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm4gaiggKTt9XG5cbiAgICAgICAgICAgIC8vICAgICAgICAgY29uc3Qgc2Vzc2lvbktleSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCB7IGVuY3J5cHRlZERhdGEsIGl2IH0gPSBlLmRldGFpbDtcblxuICAgICAgICAgICAgLy8gICAgICAgICBjbG91ZEh0dHAoe1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgdXJsOiAnYXV0aF9kZWNyeXBQaG9uZScsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgaXYsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2Vzc2lvbktleSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBlbmNyeXB0ZWREYXRhXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcblxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmICggcmVzLnN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm4gaiggKTt9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBjb25zdCB7IGNvdW50cnlDb2RlLCBwaG9uZU51bWJlciwgcHVyZVBob25lTnVtYmVyIH0gPSByZXMuZGF0YTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBpZiAoICFyZWdpc3RlciApIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIoIHJlcy5kYXRhICk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeXNSZWdpc3Rlcih7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB0ZWxlcGhvbmU6IHBob25lTnVtYmVyLFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgYXJlYUNvZGU6IGNvdW50cnlDb2RlXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC50aGVuKCBlID0+IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggISFlICkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHIoIGUgKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaiggKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGVycm9yOiAoICkgPT4geyBqKCApO31cbiAgICAgICAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAgICAgfSxcbiAgICAgICAgICAgIC8vICAgICBlcnJvcjogKCApID0+IHsgaiggKTt9XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOS8muWRmOazqOWGjCAqL1xuICAgIHB1YmxpYyBzeXNSZWdpc3RlciggZGF0YSApIHsgXG5cbiAgICAgICAgLy8g5ou/5Yiw5YWo5bGA55qE6YKA6K+35Lq6bWVtYmVySWRcbiAgICAgICAgY29uc3QgaW52aXRlcklkID0gd3guZ2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUiApO1xuICAgICAgICBjb25zdCBpbnZpdGVyU291cmNlVHlwZSA9IHd4LmdldFN0b3JhZ2VTeW5jKCBTdG9yYWdlS2V5LlJFR0lTVEVSX0lOVklURVJfVFlQRSApO1xuXG4gICAgICAgIGNvbnN0IHJlcURhdGEgPSB7XG4gICAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgICAgc291cmNlU3lzOiAnU1lTJyxcbiAgICAgICAgICAgIHNvdXJjZVR5cGU6ICdXWCcsXG4gICAgICAgICAgICBpbnZpdGVySWQ6IGludml0ZXJJZCB8fCAnJyxcbiAgICAgICAgICAgIGludml0ZXJTb3VyY2VUeXBlOiBpbnZpdGVyU291cmNlVHlwZSB8fCAnJyxcbiAgICAgICAgICAgIG5hbWU6IGBDViR7KE1hdGgucmFuZG9tKCApICogOTk5OSkudG9GaXhlZCggMCApfWAsXG4gICAgICAgICAgICBtZW1iZXJXeFJlbDoge1xuICAgICAgICAgICAgICAgIHd4T3BlbklkOiB0aGlzLm9wZW5pZCxcbiAgICAgICAgICAgICAgICB3eEFwcElkOiBjb25maWcuYXBwLmFwcElkXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9tZW1iZXIvbm9kZS9yZWdpc3RlcmBcbiAgICAgICAgfSkudGhlbiggYXN5bmMgcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgICAgICAgdGhpcy5zeXNVc2VySW5mbyA9IGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6I635Y+Wb3BlbmlkXG4gICAgICog5bm26L+b6KGM5Li05pe26K6/5a6i55qE5Yib5bu6XG4gICAgICovXG4gICAgcHVibGljIGdldE9wZW5pZCggKSB7XG4gICAgICAgIHJldHVybiBjbG91ZEh0dHAoe1xuICAgICAgICAgICAgdXJsOiAnYXV0aF9sb2dpbicsXG4gICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICAgICAgdGhpcy5vcGVuaWQgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiog57uR5a6a6K6/5a6i6LefbWVtYmVyaWQgKi9cbiAgICBwdWJsaWMgYmluZFZpc2l0b3IoICkge1xuICAgICAgICAvLyDov5nph4zliqBzZXRUaW1lb3V077yM5piv5Zug5Li6IGludml0ZXJJZCDnlLHlkITpobXpnaLojrflj5blubblrZjliLAgc3RvcmFnZSDkuK3vvIzogIzmraTmlrnms5XmmK/lnKjlsI/nqIvluo/miZPlvIDpgqPkuIDliLvlsLHmiafooYzkuoZcbiAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW52aXRlcklkID0gd3guZ2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUiApO1xuICAgICAgICAgICAgaWYgKCAhaW52aXRlcklkICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpbnZpdGVySWQsXG4gICAgICAgICAgICAgICAgICAgIHd4T3BlbklkOiB0aGlzLm9wZW5pZCxcbiAgICAgICAgICAgICAgICAgICAgd3hBcHBJZDogY29uZmlnLmFwcC5hcHBJZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL21lbWJlci9iaW5kLXZpc2l0b3JgXG4gICAgICAgICAgICB9KS50aGVuKCByZXMgPT4ge1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHsgZGF0YSwgc3RhdHVzIH0gPSByZXM7XG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgNTAwMCApO1xuICAgIH1cblxuICAgIC8qKiDliKTmlq3mmK/lkKbkuLrluILlnLrmi5PlsZXlkZggKi9cbiAgICBwdWJsaWMganVkZ2VNYXJrZXJFeHBhbmQoICkge1xuICAgICAgICBjb25zdCB7IGlkIH0gPSB0aGlzLnN5c1VzZXJJbmZvO1xuICAgICAgICBpZiAoICFpZCApIHsgcmV0dXJuOyB9XG4gICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9wYXJ0bmVyL2lzLW1hcmtldC1leHBhbmQtdXNlcmBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcblxuICAgICAgICAgICAgY29uc3QgeyBkYXRhLCBzdGF0dXMgfSA9IHJlcztcbiAgICAgICAgICAgIGlmICggc3RhdHVzICE9PSAyMDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICB0aGlzLmlzTWFya2VyRXhwYW5kID0gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIOWIpOaWreaYr+WQpuS4uuWQiOS8meS6uiAqL1xuICAgIHB1YmxpYyBqdWRnZURpc3RyaWJ1dG9yKCApIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gdGhpcy5zeXNVc2VySW5mbztcbiAgICAgICAgaWYgKCAhaWQgKSB7IHJldHVybjsgfVxuICAgICAgICByZXR1cm4gaHR0cCh7XG4gICAgICAgICAgICBwYXRoOiBgL2FwaXMvZGlzdHJpYnV0b3IvY2hlY2tJc0Rpc3RyaWJ1dG9yYFxuICAgICAgICB9KS50aGVuKCByZXMgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCB7IGRhdGEsIHN0YXR1cyB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIHRoaXMuaXNEaXN0cmlidXRvciA9IGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCB3YXRjaDxBdXRoPiggJ0F1dGgnLCBuZXcgQXV0aCggKSk7XG4gIl19