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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("../../utils/http");
var index_1 = require("../../lib/vuefy/index");
var route_1 = require("../../utils/route");
var util_1 = require("../../utils/util");
var constant_1 = require("../../utils/constant");
var app = getApp();
Page({
    data: {
        canShareConpons: false,
        id: '',
        skuid: '',
        isIPhoneX: false,
        shareCouponParams: '',
        isMarkerExpand: false,
        isDistributor: false,
        detail: null,
        banner: [],
        skus: [],
        selectedSku: null,
        comfirmSku: null,
        coupons: [],
        showHome: false
    },
    enterTime: 0,
    runComputed: function () {
        index_1.computed(this, {
            smallCoupons$: function () {
                var coupons = this.data.coupons;
                var result = coupons.map(function (c, k) {
                    var _a = c.meta, fullReduceMinPrice = _a.fullReduceMinPrice, fullReduceNum = _a.fullReduceNum;
                    var meta = {
                        bg: k % 2 === 1 ? '#444' : '',
                        label: c.smallTips
                    };
                    return meta;
                });
                return result;
            }
        });
    },
    watchApp: function () {
        var _this = this;
        app.watch$('Auth.isMarkerExpand', function (v) {
            _this.setData({
                isMarkerExpand: v
            });
        });
        app.watch$('Auth.isDistributor', function (v) {
            _this.setData({
                isDistributor: v
            });
        });
        app.watch$('Auth.sysUserInfo', function (v) {
            !!v && _this.fetchGood();
        });
        app.watch$('Common.isIPhoneX', function (v) {
            _this.setData({
                isIPhoneX: v
            });
        });
    },
    fetchGood: function (id) {
        var _this = this;
        var skuid = this.data.skuid;
        var gid = typeof id === 'string' ? id : this.data.id;
        http_1.http({
            path: "/apis/goods/detail/" + gid
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            var sortSku = [];
            var skus = data.skus;
            var targetSku = skus.find(function (x) { return x.id === skuid; });
            var targetSkuIndex = skus.findIndex(function (x) { return x.id === skuid; });
            if (!!targetSku) {
                skus.splice(targetSkuIndex, 1);
                sortSku = [
                    targetSku
                ].concat(skus);
            }
            else {
                sortSku = skus.filter(function (x) { return Array.isArray(x.myCoupons) && x.myCoupons.length > 0; }).concat(skus.filter(function (x) { return !(Array.isArray(x.myCoupons) && x.myCoupons.length > 0); }));
            }
            _this.setData({
                detail: data,
                skus: sortSku
            });
            try {
                _this.getUserCoupons(data.skuId);
                wx.stopPullDownRefresh({});
            }
            catch (e) { }
        });
    },
    fetchCouonShareKey: function (skuId) {
        var _this = this;
        if (!skuId) {
            return;
        }
        http_1.http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: "/apis/partner/share-sku-url?skuId=" + skuId
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            var shareCouponParams = data.split('?')[1];
            _this.setData({
                shareCouponParams: shareCouponParams
            });
        });
    },
    initShowHome: function () {
        this.setData({
            showHome: getCurrentPages().length === 1
        });
    },
    onShowSku: function () {
        var this_ = this;
        var detail = this.data.detail;
        var sku = this_.selectComponent('#sku');
        if (!!detail && detail.disabled) {
            return;
        }
        sku.open();
    },
    onShowCoupon: function () {
        var this_ = this;
        var sku = this_.selectComponent('#coupon');
        sku.open();
    },
    onChangeSku: function (_a) {
        var detail = _a.detail;
        var myCoupons = detail.myCoupons || [];
        this.setData({
            selectedSku: detail,
            coupons: myCoupons.map(util_1.couponToFront),
            banner: detail.bannerImgs
        });
        this.fetchCouonShareKey(detail.id);
    },
    previewImg: function (_a) {
        var currentTarget = _a.currentTarget;
        return;
        var _b = currentTarget.dataset, img = _b.img, imgs = _b.imgs;
        wx.previewImage({
            current: img,
            urls: imgs
        });
    },
    onConfirmSku: function (_a) {
        var detail = _a.detail;
        var sku = detail.sku;
        this.setData({
            comfirmSku: sku
        });
        if (!app.store.Auth.sysUserInfo.id) {
            route_1.navTo('/pages/login/index');
        }
        else {
            route_1.navTo("/pages/fill-order/index?skuIds=" + sku.id + "&counts=" + sku.count$);
        }
    },
    goHome: function () {
        wx.redirectTo({
            url: '/pages/main-page/index'
        });
    },
    onLoad: function (query) {
        if (query.im) {
            wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER, query.im);
            wx.setStorageSync(constant_1.StorageKey.REGISTER_INVITER_TYPE, constant_1.InviteType.SHARE_GOODS);
        }
        this.setData({
            skuid: query.skuid || '',
            id: query.id || query.skuid || 'good001'
        });
        this.watchApp();
        this.runComputed();
        this.initShowHome();
    },
    onShow: function () {
        this.enterTime = new Date().getTime();
    },
    onHide: function () {
        app.dataBury$([{
                "$code": "orderDetailPage",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime(),
                "goodsId": this.data.id
            }]);
    },
    onPullDownRefresh: function () {
        this.fetchGood();
    },
    getUserCoupons: function (id) {
        var _this = this;
        http_1.http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: "/apis/distributor/current_user_coupon?skuId=" + id
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200) {
                return;
            }
            data.length > 0 && _this.setData({
                canShareConpons: true
            });
        });
    },
    onShareAppMessage: function (e) {
        var type = e.target.dataset.type;
        var _a = this.data, id = _a.id, detail = _a.detail, selectedSku = _a.selectedSku, shareCouponParams = _a.shareCouponParams;
        var mainImg = selectedSku.bannerImgs[0];
        var memberId = app.store.Auth.sysUserInfo.id;
        app.dataBury$([{
                "$code": "shareApp",
                "$ts": new Date().getTime(),
                "goodsId": id
            }]);
        var meta = {
            title: selectedSku.title + " " + detail.title,
        };
        if (mainImg.indexOf('cloud') !== 0) {
            meta = __assign({}, meta, { imageUrl: mainImg });
        }
        if (type === '1' && this.data.canShareConpons) {
            return __assign({}, meta, { path: "/pages/receive-coupon/index?im=" + memberId + "&" + shareCouponParams });
        }
        else {
            return __assign({}, meta, { path: "/pages/good-detail/index?id=" + id + "&im=" + memberId });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUNqRCwyQ0FBMEM7QUFDMUMseUNBQWlEO0FBQ2pELGlEQUE4RDtBQUU5RCxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVcsQ0FBQztBQUs5QixJQUFJLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFHRixlQUFlLEVBQUUsS0FBSztRQUd0QixFQUFFLEVBQUUsRUFBRTtRQUdOLEtBQUssRUFBRSxFQUFFO1FBR1QsU0FBUyxFQUFFLEtBQUs7UUFJaEIsaUJBQWlCLEVBQUUsRUFBRTtRQUdyQixjQUFjLEVBQUUsS0FBSztRQUdyQixhQUFhLEVBQUUsS0FBSztRQUdwQixNQUFNLEVBQUUsSUFBSTtRQUdaLE1BQU0sRUFBRSxFQUFHO1FBR1gsSUFBSSxFQUFFLEVBYUw7UUFHRCxXQUFXLEVBQUUsSUFBSTtRQUdqQixVQUFVLEVBQUUsSUFBSTtRQUdoQixPQUFPLEVBQUUsRUFjUjtRQUdELFFBQVEsRUFBRSxLQUFLO0tBQ2xCO0lBRUQsU0FBUyxFQUFFLENBQUM7SUFFWixXQUFXO1FBQ1AsZ0JBQVEsQ0FBRSxJQUFJLEVBQUU7WUFHWixhQUFhLEVBQUU7Z0JBQ0gsSUFBQSwyQkFBTyxDQUFlO2dCQUU5QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ3ZCLElBQUEsV0FBOEMsRUFBNUMsMENBQWtCLEVBQUUsZ0NBQXdCLENBQUM7b0JBQ3JELElBQUksSUFBSSxHQUFRO3dCQUNaLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUM3QixLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVM7cUJBQ3JCLENBQUM7b0JBQ0YsT0FBTyxJQUFJLENB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LE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRztZQUNsQyxJQUFJLGdCQUNHLElBQUksSUFDUCxRQUFRLEVBQUUsT0FBTyxHQUNwQixDQUFDO1NBQ0w7UUFHRCxJQUFLLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUc7WUFDN0Msb0JBQ08sSUFBSSxJQUNQLElBQUksRUFBRSxvQ0FBa0MsUUFBUSxTQUFJLGlCQUFtQixJQUMxRTtTQUVKO2FBQU07WUFDSCxvQkFDTyxJQUFJLElBQ1AsSUFBSSxFQUFFLGlDQUErQixFQUFFLFlBQU8sUUFBVSxJQUMzRDtTQUNKO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb25maWcgZnJvbSAnLi4vLi4vY29uZmlnL2luZGV4JztcbmltcG9ydCB7IElBcHAgfSBmcm9tIFwiLi4vLi4vZ2xvYmFsXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cCc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleCc7XG5pbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlJztcbmltcG9ydCB7IGNvdXBvblRvRnJvbnQgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcbmltcG9ydCB7IFN0b3JhZ2VLZXksIEludml0ZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudCc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG4vKipcbiAqIOWVhuWTgeivpuaDhVxuICovXG5QYWdlKHtcblxuICAgIGRhdGE6IHtcblxuICAgICAgICAvKiog5piv5ZCm5Y+v5Lul5YiG5Lqr5ZWG5ZOB5Yi4ICovXG4gICAgICAgIGNhblNoYXJlQ29ucG9uczogZmFsc2UsXG5cbiAgICAgICAgLyoqIOWVhuWTgWlkICovXG4gICAgICAgIGlkOiAnJyxcblxuICAgICAgICAvKiog6buY6K6k55qEc2t1aWQgKi9cbiAgICAgICAgc2t1aWQ6ICcnLFxuXG4gICAgICAgIC8qKiDllYblk4FpZCAqL1xuICAgICAgICBpc0lQaG9uZVg6IGZhbHNlLFxuICAgICAgICAvLyBpc0lQaG9uZVg6IGFwcC5zdG9yZS5BdXRoLmlzSVBob25lWCxcbiBcbiAgICAgICAgLyoqIOWIhuS6q+S8mOaDoOWIuOeahOWPguaVsCAqL1xuICAgICAgICBzaGFyZUNvdXBvblBhcmFtczogJycsXG5cbiAgICAgICAgLyoqIOaYr+WQpuS4uuW4guWcuuaLk+WxleWRmCAqL1xuICAgICAgICBpc01hcmtlckV4cGFuZDogZmFsc2UsXG5cbiAgICAgICAgLyoqIOaYr+WQpuS4uuWQiOS8meS6uiAqL1xuICAgICAgICBpc0Rpc3RyaWJ1dG9yOiBmYWxzZSxcblxuICAgICAgICAvLyDllYblk4Hor6bmg4VcbiAgICAgICAgZGV0YWlsOiBudWxsLFxuXG4gICAgICAgIC8vIOWkp+WbvlxuICAgICAgICBiYW5uZXI6IFsgXSxcblxuICAgICAgICAvLyBza3VcbiAgICAgICAgc2t1czogW1xuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGlkOiAnOTk5OScsXG4gICAgICAgICAgICAvLyAgICAgY2FuU2VsZWN0OiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiAnbWF4aHViJyxcbiAgICAgICAgICAgIC8vICAgICBwcmljZTogMTM0LFxuICAgICAgICAgICAgLy8gICAgIGZhZGVQcmljZTogMzQ1LFxuICAgICAgICAgICAgLy8gICAgIHN0b2NrOiA1LFxuICAgICAgICAgICAgLy8gICAgIHBpZDogJzExMScsXG4gICAgICAgICAgICAvLyAgICAgc2lkOiAnOTk5OScsXG4gICAgICAgICAgICAvLyAgICAgaW1nOiAnY2xvdWQ6Ly9kZXYtY3owbzguNjQ2NS1kZXYtY3owbzgvZ29vZC90ZXN0LWdvb2QucG5nJyxcbiAgICAgICAgICAgIC8vICAgICBsaW1pdDogMlxuICAgICAgICAgICAgLy8gfVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIOeCueWHu+mAieS4reeahHNrde+8jOS9huacquehruWumlxuICAgICAgICBzZWxlY3RlZFNrdTogbnVsbCxcblxuICAgICAgICAvLyDnoa7lrprpgInmi6nnmoRza3VcbiAgICAgICAgY29tZmlybVNrdTogbnVsbCxcblxuICAgICAgICAvLyDkvJjmg6DliLhcbiAgICAgICAgY291cG9uczogW1xuICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgLy8gICAgIGlkOiAnMTIzJyxcbiAgICAgICAgICAgIC8vICAgICB0eXBlOiAnJyxcbiAgICAgICAgICAgIC8vICAgICB0eXBlTGFiZWw6ICfkvJrlkZjliLgnLFxuICAgICAgICAgICAgLy8gICAgIGRpc2NvdW50VHlwZTogJycsXG4gICAgICAgICAgICAvLyAgICAgdmFsdWU6IDUxMjMsXG4gICAgICAgICAgICAvLyAgICAgdXNlZDogZmFsc2UsXG4gICAgICAgICAgICAvLyAgICAgdGlwczogJ+a7oTM5OeWFgyzlh481MDDlhYMnLFxuICAgICAgICAgICAgLy8gICAgIHRpdGxlOiAnQ1ZUT1VDSCDkvJrorq7lubPmnb/mjIflrprkvJjmg6DliLgnLFxuICAgICAgICAgICAgLy8gICAgIHN0YXJ0OiAxNTY2OTk2MTQxODExLFxuICAgICAgICAgICAgLy8gICAgIGVuZDogMTU2Njk5NjE0MTgxMSxcbiAgICAgICAgICAgIC8vICAgICB1c2VUaXBzOiAn5L2/55So6K+05piO77ya5bCP56iL5bqP5LiT5Lqr77yM5LiL5Y2V5Y2z5Y+v5L2/55So44CCJ1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIOWxleekuuS4u+mhteaMiemSrlxuICAgICAgICBzaG93SG9tZTogZmFsc2VcbiAgICB9LFxuXG4gICAgZW50ZXJUaW1lOiAwLFxuXG4gICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAvKiog5bCP5LyY5oOg5Yi4ICovXG4gICAgICAgICAgICBzbWFsbENvdXBvbnMkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb3Vwb25zIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY291cG9ucy5tYXAoKCBjLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGZ1bGxSZWR1Y2VNaW5QcmljZSwgZnVsbFJlZHVjZU51bSB9ID0gYy5tZXRhO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0YTogYW55ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmc6IGsgJSAyID09PSAxID8gJyM0NDQnIDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogYy5zbWFsbFRpcHNcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTsgXG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKwgKi9cbiAgICB3YXRjaEFwcCggKSB7XG4gICAgICAgIGFwcC53YXRjaCQoJ0F1dGguaXNNYXJrZXJFeHBhbmQnLCB2ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzTWFya2VyRXhwYW5kOiB2XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC53YXRjaCQoJ0F1dGguaXNEaXN0cmlidXRvcicsIHYgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgaXNEaXN0cmlidXRvcjogdlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAud2F0Y2gkKCdBdXRoLnN5c1VzZXJJbmZvJywgdiA9PiB7XG4gICAgICAgICAgICAhIXYgJiYgdGhpcy5mZXRjaEdvb2QoICk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAud2F0Y2gkKCdDb21tb24uaXNJUGhvbmVYJywgdiA9PiB7XG4gICAgICAgICAgICAgLy8g5YW85a65aXBvbmVYXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBpc0lQaG9uZVg6IHZcbiAgICAgICAgICAgIH0pIFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqIOaLieWPluWVhuWTgeivpuaDhSAqL1xuICAgIGZldGNoR29vZCggaWQ/ICkge1xuICAgICAgICBjb25zdCB7IHNrdWlkIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgIGNvbnN0IGdpZCA9IHR5cGVvZiBpZCA9PT0gJ3N0cmluZycgPyBpZCA6IHRoaXMuZGF0YS5pZDtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBwYXRoOiBgL2FwaXMvZ29vZHMvZGV0YWlsLyR7Z2lkfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgLy8g6L+Z6YeM57uZc2t1c+mHjeaWsOaOkuW6j1xuICAgICAgICAgICAgbGV0IHNvcnRTa3U6IGFueSA9IFsgXTtcbiAgICAgICAgICAgIGNvbnN0IHNrdXMgPSBkYXRhLnNrdXM7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTa3UgPSBza3VzLmZpbmQoIHggPT4geC5pZCA9PT0gc2t1aWQgKTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNrdUluZGV4ID0gc2t1cy5maW5kSW5kZXgoIHggPT4geC5pZCA9PT0gc2t1aWQgKTtcblxuICAgICAgICAgICAgaWYgKCAhIXRhcmdldFNrdSApIHtcbiAgICAgICAgICAgICAgICBza3VzLnNwbGljZSggdGFyZ2V0U2t1SW5kZXgsIDEgKTtcbiAgICAgICAgICAgICAgICBzb3J0U2t1ID0gW1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTa3UsXG4gICAgICAgICAgICAgICAgICAgIC4uLnNrdXNcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb3J0U2t1ID0gW1xuICAgICAgICAgICAgICAgICAgICAuLi5za3VzLmZpbHRlciggeCA9PiBBcnJheS5pc0FycmF5KCB4Lm15Q291cG9ucyApICYmIHgubXlDb3Vwb25zLmxlbmd0aCA+IDAgKSxcbiAgICAgICAgICAgICAgICAgICAgLi4uc2t1cy5maWx0ZXIoIHggPT4gISggQXJyYXkuaXNBcnJheSggeC5teUNvdXBvbnMgKSAmJiB4Lm15Q291cG9ucy5sZW5ndGggPiAwICkpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IGRhdGEsXG4gICAgICAgICAgICAgICAgc2t1czogc29ydFNrdVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0VXNlckNvdXBvbnMoZGF0YS5za3VJZCk7XG4gICAgICAgICAgICAgICAgd3guc3RvcFB1bGxEb3duUmVmcmVzaCh7IH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoIGUgKSB7IH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOiOt+WPluWIm+W7uuWIhuS6q+S8mOaDoOWIuOeahHNoYXJlS2V5ICovXG4gICAgZmV0Y2hDb3VvblNoYXJlS2V5KCBza3VJZCApIHtcbiAgICAgICAgaWYgKCAhc2t1SWQgKSB7IHJldHVybjsgfVxuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGVyck1zZzogJ25vbmUnLFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ25vbmUnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL3BhcnRuZXIvc2hhcmUtc2t1LXVybD9za3VJZD0ke3NrdUlkfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgIGNvbnN0IHNoYXJlQ291cG9uUGFyYW1zID0gZGF0YS5zcGxpdCgnPycpWyAxIF07XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBzaGFyZUNvdXBvblBhcmFtc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGluaXRTaG93SG9tZSggKSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgc2hvd0hvbWU6IGdldEN1cnJlbnRQYWdlcyggKS5sZW5ndGggPT09IDFcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOWxleekunNrdSAqL1xuICAgIG9uU2hvd1NrdSggKSB7XG4gICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICBjb25zdCBkZXRhaWw6IGFueSA9IHRoaXMuZGF0YS5kZXRhaWw7XG4gICAgICAgIGNvbnN0IHNrdSA9IHRoaXNfLnNlbGVjdENvbXBvbmVudCgnI3NrdScpO1xuXG4gICAgICAgIGlmICggISFkZXRhaWwgJiYgZGV0YWlsLmRpc2FibGVkICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2t1Lm9wZW4oICk7XG4gICAgfSxcblxuICAgIC8qKiDlsZXnpLrkvJjmg6DliLggKi9cbiAgICBvblNob3dDb3Vwb24oICkge1xuICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgY29uc3Qgc2t1ID0gdGhpc18uc2VsZWN0Q29tcG9uZW50KCcjY291cG9uJyk7XG4gICAgICAgIHNrdS5vcGVuKCApO1xuICAgIH0sXG5cbiAgICAvKiog54K55Ye76YCJ5oupc2t1ICovXG4gICAgb25DaGFuZ2VTa3UoeyBkZXRhaWwgfSkge1xuICAgICAgICBjb25zdCBteUNvdXBvbnMgPSBkZXRhaWwubXlDb3Vwb25zIHx8IFsgXTtcblxuICAgICAgICAvLyDkvJjmg6DliLjliIfmjaLvvIzpgInlj5bov5nkuKpza3XlupXkuIvnmoTkvJjmg6DliLhcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBzZWxlY3RlZFNrdTogZGV0YWlsLFxuICAgICAgICAgICAgY291cG9uczogbXlDb3Vwb25zLm1hcCggY291cG9uVG9Gcm9udCApLFxuICAgICAgICAgICAgYmFubmVyOiBkZXRhaWwuYmFubmVySW1nc1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDkvJjmg6DliLjliIfmjaLvvIzph43mlrDojrflj5ZzaGFyZUtleVxuICAgICAgICB0aGlzLmZldGNoQ291b25TaGFyZUtleSggZGV0YWlsLmlkICk7XG4gICAgfSxcblxuICAgIC8qKiDpooTop4jlm77niYcgKi9cbiAgICBwcmV2aWV3SW1nKHsgY3VycmVudFRhcmdldCB9OiBhbnkgKSB7XG4gICAgICAgIHJldHVybjsgXG4gICAgICAgIGNvbnN0IHsgaW1nLCBpbWdzIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgICBjdXJyZW50OiBpbWcsXG4gICAgICAgICAgICB1cmxzOiBpbWdzXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKiog56Gu5a6a6YCJ5oupc2t177yM5bm26L+b6KGM6LSt5LmwICovXG4gICAgb25Db25maXJtU2t1KHsgZGV0YWlsIH0pIHtcbiAgICAgICAgY29uc3QgeyBza3UgfSA9IGRldGFpbDtcbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBjb21maXJtU2t1OiBza3VcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIC8vIOWfi+eCueS4iuaKpVxuICAgICAgICAvLyBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgIC8vICAgICBcIiRjb2RlXCI6XCJzaGFyZUFwcFwiLFxuICAgICAgICAvLyAgICAgXCIkdHNcIjpuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgLy8gICAgIFwiZ29vZHNJZFwiOiB0aGlzLmRhdGEuaWRcbiAgICAgICAgLy8gfV0pO1xuXG4gICAgICAgIC8vIOWmguaenOacquazqOWGjO+8jOWImei3s+WOu+azqOWGjFxuICAgICAgICBpZiAoICFhcHAuc3RvcmUuQXV0aC5zeXNVc2VySW5mby5pZCApIHtcbiAgICAgICAgICAgIG5hdlRvKCcvcGFnZXMvbG9naW4vaW5kZXgnKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g6LSt5LmwXG4gICAgICAgICAgICBuYXZUbyhgL3BhZ2VzL2ZpbGwtb3JkZXIvaW5kZXg/c2t1SWRzPSR7c2t1LmlkfSZjb3VudHM9JHtza3UuY291bnQkfWApXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBnb0hvbWUoICkge1xuICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgIHVybDogJy9wYWdlcy9tYWluLXBhZ2UvaW5kZXgnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkxvYWQoIHF1ZXJ5OiBhbnkgKSB7XG4gICAgICAgIGlmKHF1ZXJ5LmltKXtcbiAgICAgICAgICAgIC8vIOiuvue9ruWIhuS6q+S6uuWSjOWIhuS6q+exu+Wei1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUiwgcXVlcnkuaW0pO1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoIFN0b3JhZ2VLZXkuUkVHSVNURVJfSU5WSVRFUl9UWVBFLCBJbnZpdGVUeXBlLlNIQVJFX0dPT0RTKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNrdWlkOiBxdWVyeS5za3VpZCB8fCAnJyxcbiAgICAgICAgICAgIGlkOiBxdWVyeS5pZCB8fCBxdWVyeS5za3VpZCB8fCAnZ29vZDAwMSdcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMud2F0Y2hBcHAoICk7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgICAgIHRoaXMuaW5pdFNob3dIb21lKCApO1xuICAgIH0sXG5cbiAgICBvblNob3coICkge1xuICAgICAgICB0aGlzLmVudGVyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH0sXG5cbiAgICBvbkhpZGUoICkge1xuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6IFwib3JkZXJEZXRhaWxQYWdlXCIgLFxuICAgICAgICAgICAgXCIkdHNcIjp0aGlzLmVudGVyVGltZSxcbiAgICAgICAgICAgIFwiZW50ZXJUaW1lXCI6IHRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJsZWF2ZVRpbWVcIjogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgICBcImdvb2RzSWRcIjogdGhpcy5kYXRhLmlkXG4gICAgICAgIH1dKTtcbiAgICB9LFxuXG4gICAgb25QdWxsRG93blJlZnJlc2goICkge1xuICAgICAgICB0aGlzLmZldGNoR29vZCggKTtcbiAgICB9LFxuXG4gICAgLy8g6I635Y+W55So5oi35LyY5oOg5Yi45YiX6KGoXG4gICAgZ2V0VXNlckNvdXBvbnMoaWQpe1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIGVyck1zZzogJ25vbmUnLFxuICAgICAgICAgICAgbG9hZGluZ01zZzogJ25vbmUnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL2Rpc3RyaWJ1dG9yL2N1cnJlbnRfdXNlcl9jb3Vwb24/c2t1SWQ9JHtpZH1gXG4gICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IHN0YXR1cywgZGF0YSB9ID0gcmVzO1xuICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBkYXRhLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICAgICAgY2FuU2hhcmVDb25wb25zOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb25TaGFyZUFwcE1lc3NhZ2UoIGU6IGFueSApIHtcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICAgICAgICBjb25zdCB7IGlkLCBkZXRhaWwsIHNlbGVjdGVkU2t1LCBzaGFyZUNvdXBvblBhcmFtcyB9ID0gdGhpcy5kYXRhO1xuXG4gICAgICAgIGNvbnN0IG1haW5JbWcgPSBzZWxlY3RlZFNrdS5iYW5uZXJJbWdzWyAwIF07XG5cbiAgICAgICAgLy8g5o+S5YWl5b2T5YmN5YiG5Lqr5Lq655qEaWRcbiAgICAgICAgY29uc3QgbWVtYmVySWQgPSBhcHAuc3RvcmUuQXV0aC5zeXNVc2VySW5mby5pZDtcbiAgICAgICAgXG4gICAgICAgIC8vIOWfi+eCueS4iuaKpVxuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6XCJzaGFyZUFwcFwiLFxuICAgICAgICAgICAgXCIkdHNcIjpuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgICAgIFwiZ29vZHNJZFwiOiBpZFxuICAgICAgICB9XSk7XG5cbiAgICAgICAgbGV0IG1ldGE6IGFueSA9IHtcbiAgICAgICAgICAgIHRpdGxlOiBgJHsgc2VsZWN0ZWRTa3UudGl0bGUgfSAkeyBkZXRhaWwudGl0bGUgfWAsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBtYWluSW1nLmluZGV4T2YoJ2Nsb3VkJykgIT09IDAgKSB7XG4gICAgICAgICAgICBtZXRhID0ge1xuICAgICAgICAgICAgICAgIC4uLm1ldGEsXG4gICAgICAgICAgICAgICAgaW1hZ2VVcmw6IG1haW5JbWdcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiBcbiAgICAgICAgLy8g5YiG5Lqr5Yi4XG4gICAgICAgIGlmICggdHlwZSA9PT0gJzEnICYmIHRoaXMuZGF0YS5jYW5TaGFyZUNvbnBvbnMgKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLm1ldGEsXG4gICAgICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9yZWNlaXZlLWNvdXBvbi9pbmRleD9pbT0ke21lbWJlcklkfSYke3NoYXJlQ291cG9uUGFyYW1zfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8g5YiG5Lqr6ZO+5o6lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLm1ldGEsXG4gICAgICAgICAgICAgICAgcGF0aDogYC9wYWdlcy9nb29kLWRldGFpbC9pbmRleD9pZD0ke2lkfSZpbT0ke21lbWJlcklkfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pXG4iXX0=