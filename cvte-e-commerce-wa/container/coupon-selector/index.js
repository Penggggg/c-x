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
var route_js_1 = require("../../utils/route.js");
var http_js_1 = require("../../utils/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var util_1 = require("../../utils/util");
Component({
    properties: {
        max: {
            type: Number,
            value: 1
        },
        skuList: {
            type: Array,
            value: [],
            observer: 'fetchSkuListCoupons'
        },
        sku: {
            type: Object,
            value: {},
            observer: 'fetchSkuItemCoupons'
        }
    },
    data: {
        coupons: [],
        checkList: []
    },
    methods: {
        runComputed: function () {
            index_js_1.computed(this, {
                coupons$: function () {
                    var this_ = this;
                    var _a = this_.data, coupons = _a.coupons, checkList = _a.checkList;
                    return coupons.map(function (c) {
                        return __assign({}, c, { checked$: checkList.find(function (x) { return x.id === c.id; }) });
                    });
                }
            });
        },
        open: function () {
            var this_ = this;
            var pop = this_.selectComponent('#pop');
            pop.open();
        },
        close: function () {
            var this_ = this;
            var pop = this_.selectComponent('#pop');
            pop.close();
        },
        fetchSkuListCoupons: function (skuList) {
            if (!skuList || skuList.length === 0) {
                return;
            }
            var this_ = this;
            return http_js_1.http({
                method: 'POST',
                path: "/apis/coupons/order-sku",
                data: {
                    skuList: skuList
                }
            }).then(function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                this_.setData({
                    coupons: data ? data.map(util_1.couponToFront) : []
                });
            });
        },
        fetchSkuItemCoupons: function (sku) {
            var this_ = this;
            var skuCode = sku.skuCode, num = sku.num;
            if (!skuCode || num === 0) {
                return;
            }
            return http_js_1.http({
                path: "/apis/coupons/by-sku?skuCode=" + skuCode + "&num=" + num,
            }).then(function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                var meta = data ? data.map(util_1.couponToFront) : [];
                var checkList = meta.filter(function (x) { return !!x.isDefault; });
                this_.setData({
                    checkList: checkList,
                    coupons: meta
                });
                this_.triggerEvent('change', checkList);
            });
        },
        toast: function (title) {
            wx.showToast({
                title: title,
                icon: 'none'
            });
        },
        onSelect: function (_a) {
            var currentTarget = _a.currentTarget;
            var this_ = this;
            var max = this_.data.max;
            var checkList = this_.data.checkList.slice();
            var item = currentTarget.dataset.data;
            var _b = currentTarget.dataset.data, id = _b.id, used = _b.used, passed = _b.passed;
            if (passed || used) {
                return;
            }
            if (max === 0) {
                return;
            }
            if (max === 1) {
                if (checkList.find(function (x) { return x.id === id; })) {
                    checkList = [];
                }
                else {
                    checkList = [item];
                }
            }
            else {
                if (!checkList.find(function (x) { return x.id === id; })) {
                    if (checkList.length < max) {
                        checkList.push(item);
                    }
                    else {
                        this.toast("\u53EA\u80FD\u9009\u62E9" + max + "\u5F20\u4F18\u60E0\u5238");
                    }
                }
                else {
                    var index = checkList.findIndex(function (x) { return x.id === id; });
                    checkList.splice(index, 1);
                }
            }
            this_.setData({
                checkList: checkList.slice()
            });
            this_.triggerEvent('change', checkList);
        },
        onComfirm: function () {
            var this_ = this;
            var checkList = this_.data.checkList;
            this_.triggerEvent('confirm', checkList);
            this_.close();
        },
        go: function () {
            route_js_1.navTo('/pages/coupon-tips/index');
        }
    },
    attached: function () {
        this.runComputed();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTZDO0FBQzdDLCtDQUEyQztBQUMzQyxxREFBb0Q7QUFDcEQseUNBQWlEO0FBTWpELFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQUdSLEdBQUcsRUFBRTtZQUNELElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7U0FDWDtRQVNELE9BQU8sRUFBRTtZQUNMLElBQUksRUFBRSxLQUFLO1lBQ1gsS0FBSyxFQUFFLEVBQUc7WUFDVixRQUFRLEVBQUUscUJBQXFCO1NBQ2xDO1FBU0QsR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsRUFBRztZQUNWLFFBQVEsRUFBRSxxQkFBcUI7U0FDbEM7S0FDSjtJQUtELElBQUksRUFBRTtRQUdGLE9BQU8sRUFBRSxFQUFHO1FBR1osU0FBUyxFQUFFLEVBQUc7S0FFakI7SUFLRCxPQUFPLEVBQUU7UUFFTCxXQUFXO1lBQ1AsbUJBQVEsQ0FBRSxJQUFJLEVBQUU7Z0JBR1osUUFBUSxFQUFFO29CQUNOLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztvQkFDbEIsSUFBQSxlQUFtQyxFQUFqQyxvQkFBTyxFQUFFLHdCQUF3QixDQUFDO29CQUMxQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUUsVUFBQSxDQUFDO3dCQUNqQixvQkFDTyxDQUFDLElBQ0osUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQWIsQ0FBYSxDQUFFLElBQ2hEO29CQUNOLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBR0QsSUFBSTtZQUNBLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUN4QixJ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LENBQUM7WUFDaEIsSUFBQSxnQ0FBUyxDQUFnQjtZQUNqQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUUsQ0FBQztZQUMxQyxLQUFLLENBQUMsS0FBSyxFQUFHLENBQUM7UUFDbkIsQ0FBQztRQUdELEVBQUU7WUFDRSxnQkFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUE7UUFDckMsQ0FBQztLQUNKO0lBRUQsUUFBUSxFQUFFO1FBQ04sSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO0lBQ3hCLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBuYXZUbyB9IGZyb20gJy4uLy4uL3V0aWxzL3JvdXRlLmpzJztcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IGNvdXBvblRvRnJvbnQgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIHNrdeeahOS8mOaDoOWIuOmAieaLqeWZqFxuICovXG5Db21wb25lbnQoe1xuXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5bGe5oCn5YiX6KGoXG4gICAgICovXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIC8qKiDmnIDlpJrlj6/pgInkvJjmg6DliLjmlbDph48gKi9cbiAgICAgICAgbWF4OiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogMVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICogc2t15YiX6KGoXG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgICBudW06IG51bWJlcixcbiAgICAgICAgICogICAgICBza3VJZDogc3RyaW5nXG4gICAgICAgICAqIH1bIF1cbiAgICAgICAgICovXG4gICAgICAgIHNrdUxpc3Q6IHtcbiAgICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgICAgdmFsdWU6IFsgXSxcbiAgICAgICAgICAgIG9ic2VydmVyOiAnZmV0Y2hTa3VMaXN0Q291cG9ucydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICog5Y2V5Liqc2t1XG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgICBudW06IG51bWJlcixcbiAgICAgICAgICogICAgICBza3VDb2RlOiBzdHJpbmdcbiAgICAgICAgICogfVxuICAgICAgICAgKi9cbiAgICAgICAgc2t1OiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZTogeyB9LFxuICAgICAgICAgICAgb2JzZXJ2ZXI6ICdmZXRjaFNrdUl0ZW1Db3Vwb25zJ1xuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOS8mOaDoOWIuOWIl+ihqFxuICAgICAgICBjb3Vwb25zOiBbIF0sXG5cbiAgICAgICAgLy8g5bey6YCJXG4gICAgICAgIGNoZWNrTGlzdDogWyBdXG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgcnVuQ29tcHV0ZWQoICkge1xuICAgICAgICAgICAgY29tcHV0ZWQoIHRoaXMsIHtcblxuICAgICAgICAgICAgICAgIC8vIOS8mOaDoOWIuFxuICAgICAgICAgICAgICAgIGNvdXBvbnMkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGNvdXBvbnMsIGNoZWNrTGlzdCB9ID0gdGhpc18uZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvdXBvbnMubWFwKCBjID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkJDogY2hlY2tMaXN0LmZpbmQoIHggPT4geC5pZCA9PT0gYy5pZCApXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5omT5byAICovXG4gICAgICAgIG9wZW4oICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCBwb3AgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNwb3AnKTtcbiAgICAgICAgICAgIHBvcC5vcGVuKCApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDlhbPpl60gKi9cbiAgICAgICAgY2xvc2UoICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCBwb3AgPSB0aGlzXy5zZWxlY3RDb21wb25lbnQoJyNwb3AnKTtcbiAgICAgICAgICAgIHBvcC5jbG9zZSggKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5qC55o2uc2t15YiX6KGo6I635Y+W5LyY5oOg5Yi45YiX6KGoICovXG4gICAgICAgIGZldGNoU2t1TGlzdENvdXBvbnMoIHNrdUxpc3QgKSB7XG5cbiAgICAgICAgICAgIGlmICggIXNrdUxpc3QgfHwgc2t1TGlzdC5sZW5ndGggPT09IDAgKSB7IHJldHVybjsgfVxuXG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBwYXRoOiBgL2FwaXMvY291cG9ucy9vcmRlci1za3VgLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgc2t1TGlzdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cbiAgICAgICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgY291cG9uczogZGF0YSA/IGRhdGEubWFwKCBjb3Vwb25Ub0Zyb250ICkgOiBbIF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDmoLnmja7ljZXkuKpza3Xojrflj5bkvJjmg6DliLjliJfooaggKi9cbiAgICAgICAgZmV0Y2hTa3VJdGVtQ291cG9ucyggc2t1ICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IHNrdUNvZGUsIG51bSB9ID0gc2t1O1xuICAgICAgICAgICAgaWYgKCAhc2t1Q29kZSB8fCBudW0gPT09IDAgKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gaHR0cCh7XG4gICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL2NvdXBvbnMvYnktc2t1P3NrdUNvZGU9JHtza3VDb2RlfSZudW09JHtudW19YCxcbiAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBkYXRhID8gZGF0YS5tYXAoIGNvdXBvblRvRnJvbnQgKSA6IFsgXVxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrTGlzdCA9IG1ldGEuZmlsdGVyKCAgeCA9PiAhIXguaXNEZWZhdWx0ICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tMaXN0LFxuICAgICAgICAgICAgICAgICAgICBjb3Vwb25zOiBtZXRhXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpc18udHJpZ2dlckV2ZW50KCdjaGFuZ2UnLCBjaGVja0xpc3QgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDmtojmga/lvLnmoYYgKi9cbiAgICAgICAgdG9hc3QoIHRpdGxlICkge1xuICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICog6YCJ5oup5LyY5oOg5Yi4XG4gICAgICAgICAqIFxuICAgICAgICAgKiBtYXggPSAx55qE5pe25YCZ5Li65Y2V6YCJ5qih5byPXG4gICAgICAgICAqIG1heCA+IDEg5Li65aSa6YCJ77yM5LiU5pyA5aSn5Y+v6YCJ5Li6bWF4XG4gICAgICAgICAqL1xuICAgICAgICBvblNlbGVjdCh7IGN1cnJlbnRUYXJnZXQgfSkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IG1heCB9ID0gdGhpc18uZGF0YTtcbiAgICAgICAgICAgIGxldCBjaGVja0xpc3Q6IGFueSA9IFsgLi4udGhpc18uZGF0YS5jaGVja0xpc3QgXTtcblxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldC5kYXRhO1xuICAgICAgICAgICAgY29uc3QgeyBpZCwgdXNlZCwgcGFzc2VkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKCBwYXNzZWQgfHwgdXNlZCApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIGlmICggbWF4ID09PSAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgaWYgKCBtYXggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBjaGVja0xpc3QuZmluZCggeCA9PiB4LmlkID09PSBpZCApKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTGlzdCA9IFsgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjaGVja0xpc3QgPSBbIGl0ZW0gXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoICFjaGVja0xpc3QuZmluZCggeCA9PiB4LmlkID09PSBpZCApKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g5re75Yqg55qE5pe25YCZ77yM6KaB55yL55yL5piv5ZCm5Yiw5LqG5LiK6ZmQXG4gICAgICAgICAgICAgICAgICAgIGlmICggY2hlY2tMaXN0Lmxlbmd0aCA8IG1heCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrTGlzdC5wdXNoKCBpdGVtICk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvYXN0KGDlj6rog73pgInmi6kke21heH3lvKDkvJjmg6DliLhgKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjaGVja0xpc3QuZmluZEluZGV4KCB4ID0+IHguaWQgPT09IGlkICk7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrTGlzdC5zcGxpY2UoIGluZGV4LCAxICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBjaGVja0xpc3Q6IFsgLi4uY2hlY2tMaXN0IF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpc18udHJpZ2dlckV2ZW50KCdjaGFuZ2UnLCBjaGVja0xpc3QgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog56Gu5a6aICovXG4gICAgICAgIG9uQ29tZmlybSggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tMaXN0IH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgdGhpc18udHJpZ2dlckV2ZW50KCdjb25maXJtJywgY2hlY2tMaXN0ICk7XG4gICAgICAgICAgICB0aGlzXy5jbG9zZSggKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6Lez5b6A6K+05piOICovXG4gICAgICAgIGdvKCApIHtcbiAgICAgICAgICAgIG5hdlRvKCcvcGFnZXMvY291cG9uLXRpcHMvaW5kZXgnKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgfVxufSlcbiAgIl19