"use strict";
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
var index_1 = require("../../lib/vuefy/index");
var route_1 = require("../../utils/route");
var util_1 = require("../../utils/util");
var index_2 = require("../../store/index");
var constant_1 = require("../../utils/constant");
var app = getApp();
Page({
    data: {
        items: [
            { name: 'yes', checked: false }
        ],
        hasRead: false,
        useful: -1,
        distributorId: '',
        sk: ''
    },
    enterTime: 0,
    runComputed: function () {
        index_1.computed(this, {});
    },
    onCheckboxChange: function (e) {
        if (e.detail.value.length === 0) {
            this.setData({
                hasRead: false
            });
        }
        else {
            this.setData({
                hasRead: true
            });
        }
    },
    onInvite: function (e) {
        app.dataBury$([{
                "$code": "invite",
                "$ts": new Date().getTime()
            }]);
        route_1.navTo("/pages/qrcode-create/index?p=" + encodeURIComponent('pages/partner/index') + "&s=" + encodeURIComponent('fs=1'));
    },
    onBack: function (e) {
        app.dataBury$([{
                "$code": "refuseInvite",
                "$ts": new Date().getTime()
            }]);
        wx.redirectTo({
            url: '/pages/main-page/index'
        });
    },
    toAgree: function (e) {
        route_1.navTo("/pages/agreement/index?p=" + e.currentTarget.dataset.page);
    },
    onConfirm: function (e) {
        var _this = this;
        if (!app.store.Auth.sysUserInfo.id) {
            route_1.navTo('/pages/login/index');
        }
        else {
            app.dataBury$([{
                    "$code": "acceptInvite",
                    "$ts": new Date().getTime()
                }]);
            if (!this.data.hasRead) {
                wx.showToast({
                    mask: true,
                    title: '请确认用户协议',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            else {
                http_1.http({
                    method: 'GET',
                    path: "/apis/partner/agree?distributorId=" + this.data.distributorId + "&sk=" + this.data.sk,
                }).then(function (val) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (val.status !== 200) {
                                    wx.showToast({
                                        mask: true,
                                        title: '请求出错，请重试',
                                        icon: 'none'
                                    });
                                    return [2];
                                }
                                return [4, index_2.store$.Auth.judgeMarkerExpand()];
                            case 1:
                                _a.sent();
                                return [4, index_2.store$.Auth.judgeDistributor()];
                            case 2:
                                _a.sent();
                                wx.redirectTo({
                                    url: "/pages/main-page/index",
                                });
                                return [2];
                        }
                    });
                }); }).catch(function (e) {
                    console.error('出错了55:', e);
                });
            }
        }
    },
    onLoad: function (q) {
        this.watchApp(q);
        this.onConfirm = util_1.debounce(this.onConfirm, 500);
    },
    onShow: function () {
        this.enterTime = new Date().getTime();
    },
    onHide: function () {
        app.dataBury$([{
                "$code": this.data.useful === 1 ? "selectBecomePartner" : 'invitePartner',
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
        this.enterTime = 0;
    },
    watchApp: function (q) {
        var _this = this;
        var this_ = this;
        var _a = q.scene ? util_1.serialize(decodeURIComponent(q.scene)) : q, sk = _a.sk, fs = _a.fs;
        this.setData({
            sk: sk
        });
        app.watch$('Auth.sysUserInfo', function (vuser) {
            app.watch$('Auth.isMarkerExpand', function (vexpand) {
                app.watch$('Auth.isDistributor', function (vdis) {
                    if (!!vuser) {
                        console.log('解析页面query参数', q, sk, fs);
                        console.log('监听参数', fs === '0', vuser, vexpand, vdis);
                        if (fs === '0' && vuser.id && vexpand) {
                            _this.setData({
                                useful: 0
                            });
                        }
                        if (fs === '1') {
                            vdis ?
                                _this.setData({
                                    useful: 2
                                }) :
                                http_1.http({
                                    method: 'GET',
                                    path: "/apis/partner/checkShare?sk=" + sk,
                                    errMsg: '分享链接已过期'
                                }).then(function (val) {
                                    console.log('我的结果', val);
                                    if (val.status !== 200 || val.data.result === false) {
                                        _this.setData({
                                            useful: -1
                                        });
                                        wx.showToast({
                                            mask: true,
                                            title: '二维码已过期',
                                            icon: 'none'
                                        });
                                        return;
                                    }
                                    var _a = util_1.serialize(val.data.data.params), distributorId = _a.distributorId, memberId = _a.memberId;
                                    wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER, memberId);
                                    wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER_TYPE, constant_1.InviteType.SHARE_QRCODE);
                                    console.log('根据sk获取优惠券', val.data);
                                    _this.setData({
                                        useful: 1,
                                        distributorId: distributorId,
                                    });
                                }).catch(function (e) {
                                    console.error('出错了66:', e);
                                });
                        }
                    }
                });
            });
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUNqRCwyQ0FBMEM7QUFDMUMseUNBQXVEO0FBQ3ZELDJDQUEyQztBQUMzQyxpREFBOEQ7QUFFOUQsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFRLENBQUM7QUFFM0IsSUFBSSxDQUFDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsS0FBSyxFQUFFO1lBQ0gsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7U0FDbEM7UUFDRCxPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDVixhQUFhLEVBQUUsRUFBRTtRQUNqQixFQUFFLEVBQUUsRUFBRTtLQUNUO0lBQ0QsU0FBUyxFQUFFLENBQUM7SUFFWixXQUFXO1FBQ1AsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsRUFHZCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsZ0JBQWdCLFlBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxLQUFLO2FBQ2pCLENBQUMsQ0FBQTtTQUNMO2FBQU07WUFDSCxJQUFJLENBQUMsT0FBUSxDQUFDO2dCQUNWLE9BQU8sRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQTtTQUNMO0lBQ0wsQ0FBQztJQUdELFFBQVEsWUFBQyxDQUFDO1FBQ04sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixLQUFLLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7YUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDSixhQUFLLENB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QUMsVUFBQSxDQUFDO29DQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dDQUMvQixDQUFDLENBQUMsQ0FBQTt5QkFDVDtxQkFDSjtnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgSUFwcCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIjtcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4JztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUnO1xuaW1wb3J0IHsgc2VyaWFsaXplLCBkZWJvdW5jZSB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWwnO1xuaW1wb3J0IHsgc3RvcmUkIH0gZnJvbSAnLi4vLi4vc3RvcmUvaW5kZXgnO1xuaW1wb3J0IHsgU3RvcmFnZUtleSwgSW52aXRlVHlwZSB9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnN0YW50JztcblxuY29uc3QgYXBwID0gZ2V0QXBwPElBcHA+KCk7XG5cblBhZ2Uoe1xuICAgIGRhdGE6IHtcbiAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ3llcycsIGNoZWNrZWQ6IGZhbHNlIH1cbiAgICAgICAgXSxcbiAgICAgICAgaGFzUmVhZDogZmFsc2UsXG4gICAgICAgIHVzZWZ1bDogLTEsIC8vIOaYr+WQpuWxleekuuaMiemSrlxuICAgICAgICBkaXN0cmlidXRvcklkOiAnJywgLy8g5YiG6ZSA5ZGYaWRcbiAgICAgICAgc2s6ICcnIC8vIOWIhuS6q+eahOWPguaVsFxuICAgIH0sXG4gICAgZW50ZXJUaW1lOiAwLFxuXG4gICAgcnVuQ29tcHV0ZWQoKSB7XG4gICAgICAgIGNvbXB1dGVkKHRoaXMsIHtcblxuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkNoZWNrYm94Q2hhbmdlKGUpIHtcbiAgICAgICAgaWYgKGUuZGV0YWlsLnZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaGFzUmVhZDogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBoYXNSZWFkOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWPkei1t+mCgOivt1xuICAgIG9uSW52aXRlKGUpIHtcbiAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgXCIkY29kZVwiOiBcImludml0ZVwiLFxuICAgICAgICAgICAgXCIkdHNcIjogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfV0pO1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL3FyY29kZS1jcmVhdGUvaW5kZXg/cD0ke2VuY29kZVVSSUNvbXBvbmVudCgncGFnZXMvcGFydG5lci9pbmRleCcpfSZzPSR7ZW5jb2RlVVJJQ29tcG9uZW50KCdmcz0xJyl9YClcbiAgICB9LFxuXG4gICAgLy8g6L+U5Zue6aaW6aG1XG4gICAgb25CYWNrKGUpIHtcbiAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgXCIkY29kZVwiOiBcInJlZnVzZUludml0ZVwiLFxuICAgICAgICAgICAgXCIkdHNcIjogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfV0pO1xuICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgIHVybDogJy9wYWdlcy9tYWluLXBhZ2UvaW5kZXgnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDot7PovazliLDljY/orq5cbiAgICB0b0FncmVlKGUpe1xuICAgICAgICBuYXZUbyhgL3BhZ2VzL2FncmVlbWVudC9pbmRleD9wPSR7ZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQucGFnZX1gKTtcbiAgICB9LFxuXG4gICAgLy8g5o6l5Y+X5oiQ5Li65ZCI5LyZ5Lq66YKA6K+3XG4gICAgb25Db25maXJtKGUpIHtcbiAgICAgICAgaWYgKCFhcHAuc3RvcmUuQXV0aC5zeXNVc2VySW5mby5pZCkge1xuICAgICAgICAgICAgbmF2VG8oJy9wYWdlcy9sb2dpbi9pbmRleCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6IFwiYWNjZXB0SW52aXRlXCIsXG4gICAgICAgICAgICBcIiR0c1wiOiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9XSk7XG4gICAgICAgIGlmICghdGhpcy5kYXRhLmhhc1JlYWQpIHtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgbWFzazogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+ehruiupOeUqOaIt+WNj+iuricsXG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBgL2FwaXMvcGFydG5lci9hZ3JlZT9kaXN0cmlidXRvcklkPSR7dGhpcy5kYXRhLmRpc3RyaWJ1dG9ySWR9JnNrPSR7dGhpcy5kYXRhLnNrfWAsXG4gICAgICAgICAgICB9KS50aGVuKGFzeW5jICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7fmsYLlh7rplJnvvIzor7fph43or5UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vIOivt+axgui/h+eoi+Wksei0pVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOmHjeaWsOWIt+aWsOeUqOaIt+inkuiJslxuICAgICAgICAgICAgICAgIGF3YWl0IHN0b3JlJC5BdXRoLmp1ZGdlTWFya2VyRXhwYW5kKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgc3RvcmUkLkF1dGguanVkZ2VEaXN0cmlidXRvcigpO1xuICAgICAgICAgICAgICAgIC8vIOWQjOaEj+eahOi3s+i9rFxuICAgICAgICAgICAgICAgIHd4LnJlZGlyZWN0VG8oe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGAvcGFnZXMvbWFpbi1wYWdlL2luZGV4YCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcign5Ye66ZSZ5LqGNTU6JywgZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IH1cbiAgICB9LFxuXG4gICAgb25Mb2FkKHE6IGFueSkge1xuICAgICAgICB0aGlzLndhdGNoQXBwKHEpO1xuICAgICAgICB0aGlzLm9uQ29uZmlybSA9IGRlYm91bmNlKHRoaXMub25Db25maXJtLCA1MDApO1xuICAgIH0sXG5cbiAgICBvblNob3coKSB7XG4gICAgICAgIHRoaXMuZW50ZXJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfSxcblxuICAgIG9uSGlkZSgpIHtcbiAgICAgICAgLy8g6aKG5Y+W5LyY5oOg5Yi4UFbln4vngrlcbiAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgXCIkY29kZVwiOiB0aGlzLmRhdGEudXNlZnVsID09PSAxID8gXCJzZWxlY3RCZWNvbWVQYXJ0bmVyXCIgOiAnaW52aXRlUGFydG5lcicsXG4gICAgICAgICAgICBcIiR0c1wiOiB0aGlzLmVudGVyVGltZSxcbiAgICAgICAgICAgIFwiZW50ZXJUaW1lXCI6IHRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJsZWF2ZVRpbWVcIjogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfV0pO1xuICAgICAgICB0aGlzLmVudGVyVGltZSA9IDA7XG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKwgKi9cbiAgICB3YXRjaEFwcChxKSB7XG5cbiAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgc2ssIGZzIH0gPSBxLnNjZW5lID8gKHNlcmlhbGl6ZShkZWNvZGVVUklDb21wb25lbnQocS5zY2VuZSkpIGFzIGFueSkgOiBxOy8vIOiOt+WPlnF1ZXJ55Y+C5pWwXG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2tcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXBwLndhdGNoJCgnQXV0aC5zeXNVc2VySW5mbycsIHZ1c2VyID0+IHtcbiAgICAgICAgICAgIGFwcC53YXRjaCQoJ0F1dGguaXNNYXJrZXJFeHBhbmQnLCB2ZXhwYW5kID0+IHtcbiAgICAgICAgICAgICAgICBhcHAud2F0Y2gkKCdBdXRoLmlzRGlzdHJpYnV0b3InLCB2ZGlzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhdnVzZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZz77yIZnJvbVNoYXJl77yJ5Yik5pat5piv5ZCm5omr56CB6L+b5YWl6K+l6aG16Z2iXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn6Kej5p6Q6aG16Z2icXVlcnnlj4LmlbAnLCBxLCBzaywgZnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+ebkeWQrOWPguaVsCcsIGZzID09PSAnMCcsIHZ1c2VyLCB2ZXhwYW5kLCB2ZGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcyA9PT0gJzAnICYmIHZ1c2VyLmlkICYmIHZleHBhbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZnVsOiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcyA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6aaW5YWI5Y+R6K+35rGC5qCh6aqM5LqM57u056CB5piv5ZCm6L+H5pyfXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5aaC5p6c55So5oi35bey57uP5piv5YiG6ZSA5ZGY5YiZ5LiN5YWB6K645YaN5qyh56Gu6K6k77yM5ZCm5YiZ5Y+v5Lul56Gu6K6kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmRpcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZnVsOiAyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL3BhcnRuZXIvY2hlY2tTaGFyZT9zaz0ke3NrfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJNc2c6ICfliIbkuqvpk77mjqXlt7Lov4fmnJ8nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+aIkeeahOe7k+aenCcsIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwIHx8IHZhbC5kYXRhLnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDor7fmsYLlpLHotKVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZnVsOiAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5LqM57u056CB5bey6L+H5pyfJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRpc3RyaWJ1dG9ySWQsIG1lbWJlcklkIH0gPSAoc2VyaWFsaXplKHZhbC5kYXRhLmRhdGEucGFyYW1zKSBhcyBhbnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUiwgbWVtYmVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUl9UWVBFLCBJbnZpdGVUeXBlLlNIQVJFX1FSQ09ERSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn5qC55o2uc2vojrflj5bkvJjmg6DliLgnLCB2YWwuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VmdWw6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdHJpYnV0b3JJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+WHuumUmeS6hjY2OicsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbn0pIl19