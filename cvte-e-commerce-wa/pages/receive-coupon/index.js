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
var constant_1 = require("../../utils/constant");
var app = getApp();
Page({
    data: {
        coupons: [],
        distributorId: '',
        skuId: '',
        emptyTips: '空空如也 ',
        sk: ''
    },
    enterTime: 0,
    runComputed: function () {
        index_1.computed(this, {});
    },
    onReceive: function (e) {
        var _this = this;
        app.dataBury$([{
                "$code": "receive",
                "$ts": new Date().getTime()
            }]);
        console.log('可领取的优惠券列表', this.data.coupons);
        console.log('领取优惠券实体', this.data.coupons.map(function (v) {
            return {
                channel: '小程序',
                couponTemplateId: v.id,
                receiveNum: 1,
                sourceId: _this.data.distributorId,
                sourceType: 0,
                sk: _this.data.sk
            };
        }));
        if (app.store.Auth.sysUserInfo.id) {
            http_1.http({
                method: 'POST',
                path: '/apis/coupons/batch_receive',
                data: this.data.coupons.map(function (v) {
                    return {
                        channel: '小程序',
                        couponTemplateId: v.id,
                        receiveNum: 1,
                        sourceId: _this.data.distributorId,
                        sourceType: 0,
                        sk: _this.data.sk
                    };
                })
            }).then(function (val) {
                console.log('领取优惠券', val);
                if (val.status !== 200) {
                    wx.showToast({
                        title: val.msg,
                        icon: 'none',
                        mask: true
                    });
                    return;
                }
                wx.showToast({
                    title: '领取成功',
                    icon: 'success',
                    mask: true
                });
                wx.redirectTo({
                    url: "/pages/good-detail/index?skuid=" + _this.data.skuId,
                });
            }).catch(function (e) {
                console.error('77s:', e);
            });
        }
        else {
            route_1.navTo("/pages/login/index");
        }
    },
    goHome: function () {
        route_1.navTo("/pages/main-page/index");
    },
    onLoad: function (q) {
        return __awaiter(this, void 0, void 0, function () {
            var sk, dedupKey;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.onBack = util_1.debounce(this.onBack, 500);
                        this.onReceive = util_1.debounce(this.onReceive, 500);
                        sk = q.sk;
                        console.log('分享二维码参数', q);
                        return [4, util_1.getUuid()];
                    case 1:
                        dedupKey = _a.sent();
                        http_1.http({
                            method: 'GET',
                            path: "/apis/partner/checkShare?sk=" + sk + "&shareDedupKey=" + dedupKey.data
                        }).then(function (val) {
                            if (val.status !== 200) {
                                _this.setData({
                                    emptyTips: '该链接已过期'
                                });
                                return;
                            }
                            var _a = util_1.serialize(val.data.data.params), distributorId = _a.distributorId, skuId = _a.skuId, memberId = _a.memberId;
                            console.log('根据sk获取优惠券', val.data);
                            wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER, memberId);
                            wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER_TYPE, constant_1.InviteType.SHARE_COUPON);
                            _this.setData({
                                distributorId: distributorId,
                                skuId: skuId,
                                sk: sk
                            });
                            http_1.http({
                                method: 'GET',
                                path: "/apis/distributor/getShareCoupon?distributorId=" + distributorId + "&skuId=" + skuId + "&sk=" + sk,
                            }).then(function (val) {
                                if (val.status !== 200) {
                                    return;
                                }
                                _this.setData({
                                    coupons: val.data.map(function (item) {
                                        return {
                                            limitReceiveNum: item.limitReceiveNum,
                                            id: item.id,
                                            type: item.type,
                                            typeLabel: '会员券',
                                            discountType: '',
                                            value: item.calculateRule.fullReduceNum,
                                            used: false,
                                            tips: "\u6EE1" + item.calculateRule.fullReduceMinPrice + "\u5143,\u51CF" + item.calculateRule.fullReduceNum + "\u5143",
                                            title: item.name,
                                            start: item.expirationInterval ? new Date(item.effectiveTime).getTime() : null,
                                            end: item.expirationInterval ? new Date(item.expiredTime).getTime() : null,
                                            useTips: item.remark
                                        };
                                    })
                                });
                            }).catch(function (e) {
                                console.error('出错了88:', e);
                            });
                        }).catch(function (e) {
                            console.error('出错了99:', e);
                        });
                        return [2];
                }
            });
        });
    },
    onBack: function () {
        wx.redirectTo({
            url: "/pages/main-page/index",
        });
    },
    onShow: function () {
        this.enterTime = new Date().getTime();
    },
    onHide: function () {
        app.dataBury$([{
                "$code": "visitReceiveCoupon",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUNqRCwyQ0FBMEM7QUFFMUMseUNBQWdFO0FBQ2hFLGlEQUE4RDtBQUU5RCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVEsQ0FBQztBQUUzQixJQUFJLENBQUM7SUFDRCxJQUFJLEVBQUU7UUFDRixPQUFPLEVBQUUsRUFlUjtRQUVELGFBQWEsRUFBRSxFQUFFO1FBRWpCLEtBQUssRUFBRSxFQUFFO1FBRVQsU0FBUyxFQUFFLE9BQU87UUFFbEIsRUFBRSxFQUFFLEVBQUU7S0FDVDtJQUVELFNBQVMsRUFBRSxDQUFDO0lBSVosV0FBVztRQUNQLGdCQUFRLENBQUMsSUFBSSxFQUFFLEVBR2QsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdELFNBQVMsWUFBQyxDQUFDO1FBQVgsaUJBeURDO1FBeERPLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDWCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsS0FBSyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFO2FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFNO1lBQ2hELE9BQU87Z0JBQ0gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3RCLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFFBQVEsRUFBRSxLQUFJLENBQUMsSUFBSSxDQUFDLGFBQWE7Z0JBQ2pDLFVBQVUsRUFB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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleCc7XG5pbXBvcnQgeyBJQXBwIH0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXgnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZSc7XG5pbXBvcnQgRGF0YU1vZGFsIGZyb20gJy4uLy4uL3V0aWxzL2RhdGFNb2RhbCc7XG5pbXBvcnQgeyBnZXRVdWlkLCBzZXJpYWxpemUsIGRlYm91bmNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCc7XG5pbXBvcnQgeyBTdG9yYWdlS2V5LCBJbnZpdGVUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnQnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SUFwcD4oKTtcblxuUGFnZSh7XG4gICAgZGF0YToge1xuICAgICAgICBjb3Vwb25zOiBbXG4gICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAvLyAgICAgaWQ6ICcxMjMnLFxuICAgICAgICAgICAgLy8gICAgIHR5cGU6ICcnLFxuICAgICAgICAgICAgLy8gICAgIHR5cGVMYWJlbDogJ+S8muWRmOWIuCcsXG4gICAgICAgICAgICAvLyAgICAgZGlzY291bnRUeXBlOiAnJyxcbiAgICAgICAgICAgIC8vICAgICB2YWx1ZTogNTEyMyxcbiAgICAgICAgICAgIC8vICAgICB1c2VkOiBmYWxzZSxcbiAgICAgICAgICAgIC8vICAgICB0aXBzOiAn5ruhMzk55YWDLOWHjzUwMOWFgycsXG4gICAgICAgICAgICAvLyAgICAgdGl0bGU6ICdDVlRPVUNIIOS8muiuruW5s+adv+aMh+WumuS8mOaDoOWIuCcsXG4gICAgICAgICAgICAvLyAgICAgc3RhcnQ6IDE1NjY5OTYxNDE4MTEsXG4gICAgICAgICAgICAvLyAgICAgZW5kOiAxNTY2OTk2MTQxODExLFxuICAgICAgICAgICAgLy8gICAgIHVzZVRpcHM6ICfkvb/nlKjor7TmmI7vvJrlsI/nqIvluo/kuJPkuqvvvIzkuIvljZXljbPlj6/kvb/nlKjjgIInXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBdXG4gICAgICAgIF0sXG4gICAgICAgIC8vIOWIhumUgOWRmGlkXG4gICAgICAgIGRpc3RyaWJ1dG9ySWQ6ICcnLFxuICAgICAgICAvLyDllYblk4FpZFxuICAgICAgICBza3VJZDogJycsXG4gICAgICAgIC8vIGVtcHR5VGlwczonXGJcYlxiXGJcYlxiXGLnqbrnqbrlpoLkuZ8gICAnIFxuICAgICAgICBlbXB0eVRpcHM6ICfnqbrnqbrlpoLkuZ8gJyxcbiAgICAgICAgLy8gc2hhcmVLZXks5a6J5YWo5L+d6K+Ba2V5XG4gICAgICAgIHNrOiAnJ1xuICAgIH0sXG5cbiAgICBlbnRlclRpbWU6IDAsXG5cbiAgICAvLyBvbkJhY2soKSB7fSxcblxuICAgIHJ1bkNvbXB1dGVkKCkge1xuICAgICAgICBjb21wdXRlZCh0aGlzLCB7XG5cblxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLy8g6aKG5Y+W5LyY5oOg5Yi4XG4gICAgb25SZWNlaXZlKGUpIHtcbiAgICAgICAgICAgIGFwcC5kYXRhQnVyeSQoW3tcbiAgICAgICAgICAgICAgICBcIiRjb2RlXCI6IFwicmVjZWl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiJHRzXCI6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5Y+v6aKG5Y+W55qE5LyY5oOg5Yi45YiX6KGoJywgdGhpcy5kYXRhLmNvdXBvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+mihuWPluS8mOaDoOWIuOWunuS9kycsIHRoaXMuZGF0YS5jb3Vwb25zLm1hcCgodjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbDogJ+Wwj+eoi+W6jycsXG4gICAgICAgICAgICAgICAgICAgIGNvdXBvblRlbXBsYXRlSWQ6IHYuaWQsXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVOdW06IDEsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUlkOiB0aGlzLmRhdGEuZGlzdHJpYnV0b3JJZCxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVHlwZTogMCxcbiAgICAgICAgICAgICAgICAgICAgc2s6IHRoaXMuZGF0YS5za1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGlmIChhcHAuc3RvcmUuQXV0aC5zeXNVc2VySW5mby5pZCkge1xuICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogJy9hcGlzL2NvdXBvbnMvYmF0Y2hfcmVjZWl2ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YS5jb3Vwb25zLm1hcCgodjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWw6ICflsI/nqIvluo8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdXBvblRlbXBsYXRlSWQ6IHYuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU51bTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VJZDogdGhpcy5kYXRhLmRpc3RyaWJ1dG9ySWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlVHlwZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzazogdGhpcy5kYXRhLnNrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSkudGhlbigodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfpooblj5bkvJjmg6DliLgnLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDor7fmsYLlpLHotKVcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHZhbC5tc2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+mihuWPluaIkOWKnycsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYC9wYWdlcy9nb29kLWRldGFpbC9pbmRleD9za3VpZD0ke3RoaXMuZGF0YS5za3VJZH1gLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCc3N3M6JywgZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygn5LiA6ZSu6aKG5Y+WJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOi3s+i9rOWIsOazqOWGjOmhtemdolxuICAgICAgICAgICAgICAgIG5hdlRvKGAvcGFnZXMvbG9naW4vaW5kZXhgKTtcbiAgICAgICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ29Ib21lKCApIHtcbiAgICAgICAgbmF2VG8oYC9wYWdlcy9tYWluLXBhZ2UvaW5kZXhgKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgb25Mb2FkKHE6IGFueSkge1xuICAgICAgICAvLyDmjInpkq7lop7liqDpmLLmipbliqhcbiAgICAgICAgdGhpcy5vbkJhY2sgPSBkZWJvdW5jZSh0aGlzLm9uQmFjaywgNTAwKTtcbiAgICAgICAgdGhpcy5vblJlY2VpdmUgPSBkZWJvdW5jZSh0aGlzLm9uUmVjZWl2ZSwgNTAwKTtcbiAgICAgICAgLy8g6aaW5YWI5piv5Y675qCh6aqM5LyY5oOg5Yi45piv5ZCm5Y+v55SoXG4gICAgICAgIGNvbnN0IHsgc2sgfSA9IHE7XG4gICAgICAgIGNvbnNvbGUubG9nKCfliIbkuqvkuoznu7TnoIHlj4LmlbAnLCBxKTtcbiAgICAgICAgY29uc3QgZGVkdXBLZXkgPSBhd2FpdCBnZXRVdWlkKCk7XG4gICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9wYXJ0bmVyL2NoZWNrU2hhcmU/c2s9JHtza30mc2hhcmVEZWR1cEtleT0ke2RlZHVwS2V5LmRhdGF9YFxuICAgICAgICB9KS50aGVuKCh2YWwpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfmiJHnmoTnu5PmnpwnLHZhbCk7XG4gICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8g6K+35rGC5aSx6LSlXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgICAgIGVtcHR5VGlwczogJ+ivpemTvuaOpeW3sui/h+acnydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgZGlzdHJpYnV0b3JJZCwgc2t1SWQsIG1lbWJlcklkIH0gPSAoc2VyaWFsaXplKHZhbC5kYXRhLmRhdGEucGFyYW1zKSBhcyBhbnkpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+agueaNrnNr6I635Y+W5LyY5oOg5Yi4JywgdmFsLmRhdGEpO1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUiwgbWVtYmVySWQpO1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUl9UWVBFLCBJbnZpdGVUeXBlLlNIQVJFX0NPVVBPTik7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBkaXN0cmlidXRvcklkLFxuICAgICAgICAgICAgICAgIHNrdUlkLFxuICAgICAgICAgICAgICAgIHNrXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBgL2FwaXMvZGlzdHJpYnV0b3IvZ2V0U2hhcmVDb3Vwb24/ZGlzdHJpYnV0b3JJZD0ke2Rpc3RyaWJ1dG9ySWR9JnNrdUlkPSR7c2t1SWR9JnNrPSR7c2t9YCxcbiAgICAgICAgICAgIH0pLnRoZW4oKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCfmiJHnmoTnu5PmnpwnLHZhbCk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiB2YWwuZGF0YS5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0UmVjZWl2ZU51bTogaXRlbS5saW1pdFJlY2VpdmVOdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogaXRlbS50eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVMYWJlbDogJ+S8muWRmOWIuCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzY291bnRUeXBlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5jYWxjdWxhdGVSdWxlLmZ1bGxSZWR1Y2VOdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlwczogYOa7oSR7aXRlbS5jYWxjdWxhdGVSdWxlLmZ1bGxSZWR1Y2VNaW5QcmljZX3lhYMs5YePJHtpdGVtLmNhbGN1bGF0ZVJ1bGUuZnVsbFJlZHVjZU51bX3lhYNgLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBpdGVtLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGl0ZW0uZXhwaXJhdGlvbkludGVydmFsID8gbmV3IERhdGUoaXRlbS5lZmZlY3RpdmVUaW1lKS5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZDogaXRlbS5leHBpcmF0aW9uSW50ZXJ2YWwgPyBuZXcgRGF0ZShpdGVtLmV4cGlyZWRUaW1lKS5nZXRUaW1lKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZVRpcHM6IGl0ZW0ucmVtYXJrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcign5Ye66ZSZ5LqGODg6JywgZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ+WHuumUmeS6hjk5OicsIGUpO1xuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBvbkJhY2soKSB7XG4gICAgICAgIHd4LnJlZGlyZWN0VG8oe1xuICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL21haW4tcGFnZS9pbmRleGAsXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIG9uU2hvdygpIHtcbiAgICAgICAgdGhpcy5lbnRlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuXG4gICAgb25IaWRlKCkge1xuICAgICAgICAvLyDpooblj5bkvJjmg6DliLhQVuWfi+eCuVxuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6IFwidmlzaXRSZWNlaXZlQ291cG9uXCIsXG4gICAgICAgICAgICBcIiR0c1wiOiB0aGlzLmVudGVyVGltZSxcbiAgICAgICAgICAgIFwiZW50ZXJUaW1lXCI6IHRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJsZWF2ZVRpbWVcIjogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfV0pO1xuICAgIH1cbn0pIl19