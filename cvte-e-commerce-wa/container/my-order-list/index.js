"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var route_js_1 = require("../../utils/route.js");
var http_js_1 = require("../../utils/http.js");
var util_js_1 = require("../../utils/util.js");
var index_1 = require("../../store/index");
Component({
    properties: {
        detail: {
            type: Object,
            value: {}
        }
    },
    data: {},
    methods: {
        onNavToDetail: function (e) {
            route_js_1.navTo("/pages/order-detail/index?no=" + e.currentTarget.dataset.orderno);
        },
        pay: function (e) {
            var this_ = this;
            var item = this_.data.detail;
            console.log('我要支付', item);
            item.type === 'OFFLINE_PAY' && route_js_1.navTo("/pages/pay-res/index?state=WAIT_REMIT&no=" + item.orderNo);
            item.type === 'ONLINE_PAY' && this.wxPay({
                out_trade_no: item.id,
                total_fee: item.actPrice * 100,
                spbill_create_ip: '127.0.0.1',
                openid: index_1.store$.Auth.openid,
                body: '支付商品'
            }, item.orderNo);
        },
        wxPay: function (data, orderNo) {
            http_js_1.http({
                method: 'POST',
                path: '/apis/wxPay/prepay',
                data: data,
                errMsg: '支付出错啦 ～'
            }).then(function (val) {
                if (val.status !== 200) {
                    return;
                }
                wx.requestPayment(Object.assign(val.data, {
                    success: function (res) {
                        http_js_1.http({
                            method: 'PUT',
                            errMsg: 'none',
                            path: "/apis/order/frontend_confirm/" + data.out_trade_no,
                        }).then(function () {
                            route_js_1.navTo("/pages/order-detail/index?no=" + orderNo);
                        });
                    }, fail: function (res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                        });
                    }
                }));
            }).catch(function (e) {
                console.error('出错了22:', e);
            });
        },
    },
    attached: function () {
        this.pay = util_js_1.debounce(this.pay, 500);
        console.log('数据', this.data.detail);
    },
    ready: function () {
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE2QztBQUM3QywrQ0FBMkM7QUFDM0MsK0NBQStDO0FBRS9DLDJDQUEyQztBQU8zQyxTQUFTLENBQUM7SUFLTixVQUFVLEVBQUU7UUFFUixNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1o7S0FDSjtJQUtELElBQUksRUFBRSxFQUdMO0lBS0QsT0FBTyxFQUFFO1FBQ0wsYUFBYSxZQUFDLENBQUM7WUFDWCxnQkFBSyxDQUFDLGtDQUFnQyxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFTLENBQUMsQ0FBQztRQUM3RSxDQUFDO1FBRUQsR0FBRyxZQUFDLENBQUM7WUFDRCxJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDeEIsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLElBQUksZ0JBQUssQ0FBQyw4Q0FBNEMsSUFBSSxDQUFDLE9BQVMsQ0FBQyxDQUFBO1lBQ2hHLElBQUksQ0FBQyxJQUFJLEtBQUssWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3JDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFFckIsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRztnQkFDOUIsZ0JBQWdCLEVBQUUsV0FBVztnQkFDN0IsTUFBTSxFQUFFLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDMUIsSUFBSSxFQUFFLE1BQU07YUFDZixFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBRUQsS0FBSyxZQUFDLElBQUksRUFBRSxPQUFPO1lBQ2YsY0FBSSxDQUFDO2dCQUNELE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLElBQUksTUFBQTtnQkFDSixNQUFNLEVBQUUsU0FBUzthQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztnQkFFUixJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO29CQUNwQixPQUFPO2lCQUNWO2dCQUNELEVBQUUsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO29CQUN0QyxPQUFPLEVBQUUsVUFBVSxHQUFHO3dCQUNsQixjQUFJLENBQUM7NEJBQ0QsTUFBTSxFQUFFLEtBQUs7NEJBQ2IsTUFBTSxFQUFFLE1BQU07NEJBQ2QsSUFBSSxFQUFFLGtDQUFnQyxJQUFJLENBQUMsWUFBYzt5QkFDNUQsQ0FBQyxDQUFDLElBQUksQ0FBQzs0QkFDSixnQkFBSyxDQUFDLGtDQUFnQyxPQUFTLENBQUMsQ0FBQzt3QkFDckQsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLEdBQUc7d0JBQ2xCLEVBQUUsQ0FBQyxTQUFTLENBQUM7NEJBQ1QsS0FBSyxFQUFFLE1BQU07NEJBQ2IsSUFBSSxFQUFFLE1BQU07eUJBQ2YsQ0FBQyxDQUFDO29CQUNQLENBQUM7aUJBQ0osQ0FBQyxDQUFDLENBQUE7WUFDUCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztLQUNKO0lBRUQsUUFBUSxFQUFFO1FBRU4sSUFBSSxDQUFDLEdBQUcsR0FBRyxrQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsS0FBSyxFQUFFO0lBRVAsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUuanMnO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAuanMnO1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuLi8uLi91dGlscy91dGlsLmpzJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4LmpzJztcbmltcG9ydCB7IHN0b3JlJCB9IGZyb20gJy4uLy4uL3N0b3JlL2luZGV4JztcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6I+c5ZOB5qCH562+6YCJ5oup5YiX6KGoXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKiDor6bmg4UgKi9cbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB0eXBlOiBPYmplY3QsXG4gICAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG4gICAgICAgIG9uTmF2VG9EZXRhaWwoZSkge1xuICAgICAgICAgICAgbmF2VG8oYC9wYWdlcy9vcmRlci1kZXRhaWwvaW5kZXg/bm89JHtlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5vcmRlcm5vfWApO1xuICAgICAgICB9XG4gICAgICAgICxcbiAgICAgICAgcGF5KGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXNfLmRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+aIkeimgeaUr+S7mCcsIGl0ZW0pO1xuICAgICAgICAgICAgaXRlbS50eXBlID09PSAnT0ZGTElORV9QQVknICYmIG5hdlRvKGAvcGFnZXMvcGF5LXJlcy9pbmRleD9zdGF0ZT1XQUlUX1JFTUlUJm5vPSR7aXRlbS5vcmRlck5vfWApXG4gICAgICAgICAgICBpdGVtLnR5cGUgPT09ICdPTkxJTkVfUEFZJyAmJiB0aGlzLnd4UGF5KHtcbiAgICAgICAgICAgICAgICBvdXRfdHJhZGVfbm86IGl0ZW0uaWQsICAvLyDorqLljZVpZFxuICAgICAgICAgICAgICAgIC8vIFRPRE86IOatpOWkhOa1i+ivleaUr+S7mO+8jOaaguaXtuWumuS4uuS4gOWIhumSsSjmraPlvI/njq/looPlkI7nq6/mjqfliLbvvIzkuI3lvbHlk40pXG4gICAgICAgICAgICAgICAgdG90YWxfZmVlOiBpdGVtLmFjdFByaWNlICogMTAwLCAgIC8vIOaAu+S7t+agvFxuICAgICAgICAgICAgICAgIHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxuICAgICAgICAgICAgICAgIG9wZW5pZDogc3RvcmUkLkF1dGgub3BlbmlkLFxuICAgICAgICAgICAgICAgIGJvZHk6ICfmlK/ku5jllYblk4EnXG4gICAgICAgICAgICB9LGl0ZW0ub3JkZXJObyk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIOW+ruS/oemihOaUr+S7mFxuICAgICAgICB3eFBheShkYXRhLCBvcmRlck5vKSB7XG4gICAgICAgICAgICBodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBwYXRoOiAnL2FwaXMvd3hQYXkvcHJlcGF5JyxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIGVyck1zZzogJ+aUr+S7mOWHuumUmeWVpiDvvZ4nXG4gICAgICAgICAgICB9KS50aGVuKCh2YWwpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmICh2YWwuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3eC5yZXF1ZXN0UGF5bWVudChPYmplY3QuYXNzaWduKHZhbC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyTXNnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL29yZGVyL2Zyb250ZW5kX2NvbmZpcm0vJHtkYXRhLm91dF90cmFkZV9ub31gLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdlRvKGAvcGFnZXMvb3JkZXItZGV0YWlsL2luZGV4P25vPSR7b3JkZXJOb31gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LCBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5pSv5LuY5aSx6LSlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICB9KS5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCflh7rplJnkuoYyMjonLCBlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIOWinuWKoOmYsuaKluWKqOWHveaVsFxuICAgICAgICB0aGlzLnBheSA9IGRlYm91bmNlKHRoaXMucGF5LCA1MDApO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCfmlbDmja4nLHRoaXMuZGF0YS5kZXRhaWwpO1xuICAgIH0sXG4gICAgcmVhZHk6IGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgfVxufSlcbiJdfQ==