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
var index_2 = require("../../store/index");
var constant_1 = require("../../utils/constant");
var app = getApp();
Page({
    data: {
        no: '',
        showInvoice: '0',
        od: {
            id: ''
        },
        loading: true,
        countdown: 0,
        enterTime: 0
    },
    runComputed: function () {
        index_1.computed(this, {
            od$: function () {
                var _a = this.data, od = _a.od, loading = _a.loading;
                var placeOrderTime = od.placeOrderTime, type = od.type, state = od.state, payTime = od.payTime, invoiceInfo = od.invoiceInfo;
                if (loading) {
                    return {};
                }
                var format = function (dd) {
                    var time = new Date(dd);
                    var y = time.getFullYear();
                    var m = time.getMonth() + 1;
                    var d = time.getDate();
                    var h = time.getHours();
                    var mm = time.getMinutes();
                    return y + "-" + m + "-" + d + " " + h + ":" + mm;
                };
                var invoiceInfo$ = {};
                if (!!invoiceInfo && Object.keys(invoiceInfo).length > 0) {
                    var type_1 = invoiceInfo.type, invoiceType = invoiceInfo.invoiceType, invoiceTitle = invoiceInfo.invoiceTitle, taxNo = invoiceInfo.taxNo, enterpriseTelephone = invoiceInfo.enterpriseTelephone, bankAccount = invoiceInfo.bankAccount, openingBank = invoiceInfo.openingBank, enterpriseAddress = invoiceInfo.enterpriseAddress;
                    invoiceInfo$ = __assign({}, invoiceInfo, { taxNo: taxNo,
                        bankAccount: bankAccount,
                        openingBank: openingBank,
                        invoiceTitle: invoiceTitle,
                        enterpriseAddress: enterpriseAddress,
                        enterpriseTelephone: enterpriseTelephone, type: constant_1.InvoiceChoiceTypeCN[type_1], invoiceType: constant_1.InvoiceTypeCN[invoiceType] || '' });
                }
                var meta = __assign({}, od, { invoiceInfo$: invoiceInfo$, state$: constant_1.OrderStateCN[state], type$: constant_1.OrderPayTypeCN[type], createTime$: format(placeOrderTime), payTime$: payTime ?
                        format(payTime) :
                        '暂未支付', items$: !od.items ? [] :
                        od.items.map(function (i) { return ({
                            image: i.skuImgs,
                            name: i.skuName || '',
                            desc: i.skuDesc || '',
                            price: i.oriPrice.toFixed(2),
                            count: i.qty
                        }); }) });
                console.log('......', meta);
                return meta;
            }
        });
    },
    getOrderDetail: function (no) {
        var _this = this;
        if (!no) {
            return;
        }
        http_1.http({
            method: 'get',
            path: "/apis/order/detail/" + no
        }).then(function (res) {
            var status = res.status, data = res.data;
            if (status !== 200)
                return;
            _this.dealState(data);
            _this.setData({
                od: data,
                loading: false
            });
        });
    },
    dealState: function (orderDetail) {
        var countdown = 0;
        var placeOrderTime = orderDetail.placeOrderTime, state = orderDetail.state, type = orderDetail.type;
        var createOrderTime = new Date(placeOrderTime).getTime();
        var dealLineTS = type === constant_1.OrderPayType.ONLINE_PAY ?
            createOrderTime + constant_1.OnlinePayDeadLine :
            createOrderTime + constant_1.OfflinePayDeadLine;
        if ((state === constant_1.OrderState.WAIT_PAY || state === constant_1.OrderState.PAY_APPROVAL) && dealLineTS > Date.now()) {
            countdown = Number(((dealLineTS - Date.now()) / 1000).toFixed(0));
        }
        this.setData({
            countdown: countdown
        });
    },
    onCancel: function () {
        app.dataBury$([{
                "$code": "cancelOrder",
                "$ts": new Date().getTime(),
                "goodsId": this.data.od.id
            }]);
        var id = '';
        http_1.http({
            method: 'put',
            path: "/apis/order/" + this.data.od.id + "/cancel",
        }).then(function (val) {
            if (val.status !== 200) {
                return;
            }
            wx.showToast({
                title: '取消成功'
            });
            wx.redirectTo({
                url: '/pages/order-list/index?state=ALL'
            });
        });
    },
    onShowInvoice: function () {
        var _a = this.data, no = _a.no, od = _a.od;
        if (!od.invoiceInfo) {
            return;
        }
        route_1.navTo("/pages/order-detail/index?si=1&no=" + no);
    },
    onPay: function () {
        var this_ = this;
        var item = this_.data.od;
        app.dataBury$([{
                "$code": "gotoPay",
                "$ts": new Date().getTime(),
                "goodsId": item.id
            }]);
        if (this.data.countdown <= 0) {
            wx.showToast({
                icon: 'none',
                title: '订单已过期～'
            });
            return;
        }
        console.log('我要支付', item);
        item.type === 'OFFLINE_PAY' && route_1.navTo("/pages/pay-res/index?state=WAIT_REMIT&no=" + item.orderNo);
        item.type === 'ONLINE_PAY' && this.wxPay({
            out_trade_no: item.id,
            total_fee: item.actPrice * 100,
            spbill_create_ip: '127.0.0.1',
            openid: index_2.store$.Auth.openid,
            body: '支付商品'
        }, item.orderNo);
    },
    wxPay: function (data, orderNo) {
        http_1.http({
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
                    http_1.http({
                        method: 'PUT',
                        errMsg: 'none',
                        path: "/apis/order/frontend_confirm/" + data.out_trade_no,
                    }).then(function () {
                        route_1.navTo("/pages/order-detail/index?no=" + orderNo);
                    });
                }, fail: function (res) {
                    wx.showToast({
                        title: '支付失败',
                        icon: 'none'
                    });
                }
            }));
        }).catch(function (e) {
            console.error('出错了44:', e);
        });
    },
    onCall: function () {
        wx.makePhoneCall({
            phoneNumber: app.store.Common.customerService
        });
    },
    onCopy: function (_a) {
        var currentTarget = _a.currentTarget;
        var clipboard = currentTarget.dataset.clipboard;
        !!clipboard && wx.setClipboardData({
            data: clipboard
        });
    },
    onLoad: function (q) {
        this.onPay = util_1.debounce(this.onPay, 500);
        this.onCancel = util_1.debounce(this.onCancel, 500);
        var si = q.si, no = q.no;
        this.getOrderDetail(no);
        this.runComputed();
        this.setData({
            no: no
        });
        if (!!si) {
            this.setData({
                showInvoice: si
            });
        }
    },
    onShow: function () {
        this.setData({
            enterTime: Date.now()
        });
    },
    onHide: function () {
        var enterTime = this.data.enterTime;
        app.dataBury$([{
                "$code": "selectBecomePartner",
                "$ts": enterTime,
                "enterTime": enterTime,
                "leaveTime": Date.now()
            }]);
        this.setData({
            enterTime: 0
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEseUNBQXdDO0FBQ3hDLCtDQUFpRDtBQUNqRCwyQ0FBMEM7QUFDMUMseUNBQTRDO0FBQzVDLDJDQUEyQztBQUMzQyxpREFDc0Y7QUFFdEYsSUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFXLENBQUM7QUFFOUIsSUFBSSxDQUFDO0lBQ0QsSUFBSSxFQUFFO1FBR0YsRUFBRSxFQUFFLEVBQUU7UUFFTixXQUFXLEVBQUUsR0FBRztRQUdoQixFQUFFLEVBQUU7WUFDQSxFQUFFLEVBQUUsRUFBRTtTQUNSO1FBR0YsT0FBTyxFQUFFLElBQUk7UUFHYixTQUFTLEVBQUUsQ0FBQztRQUVaLFNBQVMsRUFBRSxDQUFDO0tBQ2Y7SUFFRCxXQUFXO1FBQ1AsZ0JBQVEsQ0FBRSxJQUFJLEVBQUU7WUFDWixHQUFHLEVBQUU7Z0JBQ0ssSUFBQSxjQUEyQixFQUF6QixVQUFFLEVBQUUsb0JBQXFCLENBQUM7Z0JBQzFCLElBQUEsa0NBQWMsRUFBRSxjQUFJLEVBQUUsZ0JBQUssRUFBRSxvQkFBTyxFQUFFLDRCQUFXLENBQVE7Z0JBRWpFLElBQUssT0FBTyxFQUFHO29CQUNYLE9BQU8sRUFBRyxDQUFDO2lCQUNkO2dCQUVELElBQU0sTUFBTSxHQUFHLFVBQUEsRUFBRTtvQkFDYixJQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBRSxFQUFFLENBQUUsQ0FBQztvQkFDNUIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRyxDQUFDO29CQUM5QixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUMvQixJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFHLENBQUM7b0JBQzFCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUcsQ0FBQztvQkFDM0IsSUFBTSxF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QUNoQixXQUFXLEVBQUUsU0FBUztnQkFDdEIsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUc7YUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1YsU0FBUyxFQUFFLENBQUM7U0FDZixDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbmZpZyBmcm9tICcuLi8uLi9jb25maWcvaW5kZXgnO1xuaW1wb3J0IHsgSUFwcCB9IGZyb20gXCIuLi8uLi9nbG9iYWxcIjtcbmltcG9ydCB7IGh0dHAgfSBmcm9tICcuLi8uLi91dGlscy9odHRwJztcbmltcG9ydCB7IGNvbXB1dGVkIH0gZnJvbSAnLi4vLi4vbGliL3Z1ZWZ5L2luZGV4JztcbmltcG9ydCB7IG5hdlRvIH0gZnJvbSAnLi4vLi4vdXRpbHMvcm91dGUnO1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJztcbmltcG9ydCB7IHN0b3JlJCB9IGZyb20gJy4uLy4uL3N0b3JlL2luZGV4JztcbmltcG9ydCB7IE9yZGVyU3RhdGVDTiwgT3JkZXJQYXlUeXBlQ04sIE9yZGVyU3RhdGUsIEludm9pY2VDaG9pY2VUeXBlQ04sIEludm9pY2VUeXBlQ04sXG4gICAgT25saW5lUGF5RGVhZExpbmUsIE9mZmxpbmVQYXlEZWFkTGluZSwgT3JkZXJQYXlUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnQnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8IElBcHAgPiggKTtcblxuUGFnZSh7XG4gICAgZGF0YToge1xuXG4gICAgICAgIC8vIOiuouWNleWPt1xuICAgICAgICBubzogJycsXG5cbiAgICAgICAgc2hvd0ludm9pY2U6ICcwJyxcblxuICAgICAgICAvLyDorqLljZXor6bmg4XmlbDmja5cbiAgICAgICAgb2Q6IHtcbiAgICAgICAgICAgIGlkOiAnJ1xuICAgICAgICAgfSxcblxuICAgICAgICAvLyDliqDovb3kuK1cbiAgICAgICAgbG9hZGluZzogdHJ1ZSxcblxuICAgICAgICAvLyDmlK/ku5jlgJLorqHml7ZcbiAgICAgICAgY291bnRkb3duOiAwLFxuXG4gICAgICAgIGVudGVyVGltZTogMFxuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgIGNvbXB1dGVkKCB0aGlzLCB7XG4gICAgICAgICAgICBvZCQ6IGZ1bmN0aW9uKCApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9kLCBsb2FkaW5nIH0gPSB0aGlzLmRhdGE7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwbGFjZU9yZGVyVGltZSwgdHlwZSwgc3RhdGUsIHBheVRpbWUsIGludm9pY2VJbmZvIH0gPSBvZDtcblxuICAgICAgICAgICAgICAgIGlmICggbG9hZGluZyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXQgPSBkZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSggZGQgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRpbWUuZ2V0RnVsbFllYXIoICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG0gPSB0aW1lLmdldE1vbnRoKCApICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZCA9IHRpbWUuZ2V0RGF0ZSggKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaCA9IHRpbWUuZ2V0SG91cnMoICk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1tID0gdGltZS5nZXRNaW51dGVzKCApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7eX0tJHttfS0ke2R9ICR7aH06JHttbX1gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIOW8gOelqOS/oeaBr1xuICAgICAgICAgICAgICAgIGxldCBpbnZvaWNlSW5mbyQgPSB7IH07XG4gICAgICAgICAgICAgICAgaWYgKCAhIWludm9pY2VJbmZvICYmIE9iamVjdC5rZXlzKCBpbnZvaWNlSW5mbyApLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgaW52b2ljZVR5cGUsIGludm9pY2VUaXRsZSwgdGF4Tm8sIGVudGVycHJpc2VUZWxlcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5rQWNjb3VudCwgb3BlbmluZ0JhbmssIGVudGVycHJpc2VBZGRyZXNzIH0gPSBpbnZvaWNlSW5mbztcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZUluZm8kID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uaW52b2ljZUluZm8sXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXhObyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhbmtBY2NvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbmluZ0JhbmssXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZvaWNlVGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRlcnByaXNlQWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGVycHJpc2VUZWxlcGhvbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBJbnZvaWNlQ2hvaWNlVHlwZUNOWyB0eXBlIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnZvaWNlVHlwZTogSW52b2ljZVR5cGVDTlsgaW52b2ljZVR5cGUgXSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vZCxcbiAgICAgICAgICAgICAgICAgICAgLy8g5byA56Wo5L+h5oGvXG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VJbmZvJCxcbiAgICAgICAgICAgICAgICAgICAgLy8g6K6i5Y2V54q25oCBXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlJDogT3JkZXJTdGF0ZUNOWyBzdGF0ZSBdLFxuICAgICAgICAgICAgICAgICAgICAvLyDorqLljZXmlrnlvI9cbiAgICAgICAgICAgICAgICAgICAgdHlwZSQ6IE9yZGVyUGF5VHlwZUNOWyB0eXBlIF0sXG4gICAgICAgICAgICAgICAgICAgIC8vIOiuouWNleWIm+W7uuaXtumXtFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVUaW1lJDogZm9ybWF0KCBwbGFjZU9yZGVyVGltZSApLFxuICAgICAgICAgICAgICAgICAgICAvLyDmlK/ku5jml7bpl7RcbiAgICAgICAgICAgICAgICAgICAgcGF5VGltZSQ6IHBheVRpbWUgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdCggcGF5VGltZSApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICfmmoLmnKrmlK/ku5gnLFxuICAgICAgICAgICAgICAgICAgICAvLyDorqLljZVza3VcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMkOiAhb2QuaXRlbXMgPyBbIF0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgb2QuaXRlbXMubWFwKCBpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGkuc2t1SW1ncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBpLnNrdU5hbWUgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzYzogaS5za3VEZXNjIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBpLm9yaVByaWNlLnRvRml4ZWQoIDIgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogaS5xdHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICcuLi4uLi4nLCBtZXRhICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDojrflj5borqLljZXor6bmg4VcbiAgICBnZXRPcmRlckRldGFpbCggbm8gKSB7XG4gICAgICAgIGlmICggIW5vICkgeyByZXR1cm47IH1cbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL29yZGVyL2RldGFpbC8ke25vfWBcbiAgICAgICAgfSkudGhlbiggcmVzID0+IHtcblxuICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgIGlmKCBzdGF0dXMgIT09IDIwMCApIHJldHVybjtcbiAgICBcbiAgICAgICAgICAgIHRoaXMuZGVhbFN0YXRlKCBkYXRhICk7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgICAgICBvZDogZGF0YSxcbiAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIOWkhOeQhuiuouWNleeKtuaAgVxuICAgIGRlYWxTdGF0ZSggb3JkZXJEZXRhaWwgKSB7XG4gICAgICAgIGxldCAgY291bnRkb3duID0gMDtcbiAgICAgICAgY29uc3QgeyBwbGFjZU9yZGVyVGltZSwgc3RhdGUsIHR5cGUgfSA9IG9yZGVyRGV0YWlsO1xuXG4gICAgICAgIC8vIOWkhOeQhuaUr+S7mOWAkuiuoeaXtlxuICAgICAgICBjb25zdCBjcmVhdGVPcmRlclRpbWUgPSBuZXcgRGF0ZSggcGxhY2VPcmRlclRpbWUgKS5nZXRUaW1lKCApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlYWxMaW5lVFMgPSB0eXBlID09PSBPcmRlclBheVR5cGUuT05MSU5FX1BBWSA/XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU9yZGVyVGltZSArIE9ubGluZVBheURlYWRMaW5lIDpcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlT3JkZXJUaW1lICsgT2ZmbGluZVBheURlYWRMaW5lO1xuXG4gICAgICAgIGlmICggKHN0YXRlID09PSBPcmRlclN0YXRlLldBSVRfUEFZIHx8IHN0YXRlID09PSBPcmRlclN0YXRlLlBBWV9BUFBST1ZBTCkgJiYgZGVhbExpbmVUUyA+IERhdGUubm93KCApKSB7XG4gICAgICAgICAgICBjb3VudGRvd24gPSBOdW1iZXIoXG4gICAgICAgICAgICAgICAgKChkZWFsTGluZVRTIC0gRGF0ZS5ub3coICkpIC8gMTAwMCkudG9GaXhlZCggMCApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhISh7XG4gICAgICAgICAgICBjb3VudGRvd25cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKiDlj5bmtojorqLljZUgKi9cbiAgICBvbkNhbmNlbCggKSB7XG4gICAgICAgIGFwcC5kYXRhQnVyeSQoW3tcbiAgICAgICAgICAgIFwiJGNvZGVcIjpcImNhbmNlbE9yZGVyXCIsXG4gICAgICAgICAgICBcIiR0c1wiOm5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgXCJnb29kc0lkXCI6dGhpcy5kYXRhLm9kLmlkXG4gICAgICAgIH1dKTtcbiAgICAgICAgY29uc3QgaWQgPSAnJztcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdwdXQnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL29yZGVyLyR7dGhpcy5kYXRhLm9kLmlkfS9jYW5jZWxgLFxuICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICBpZih2YWwuc3RhdHVzICE9PSAyMDApe1xuICAgICAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAn5Y+W5raI5oiQ5YqfJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvb3JkZXItbGlzdC9pbmRleD9zdGF0ZT1BTEwnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqIOWxleekuuW8gOelqOS/oeaBryAqL1xuICAgIG9uU2hvd0ludm9pY2UoICkge1xuICAgICAgICBjb25zdCB7IG5vLCBvZCB9ID0gKHRoaXMgYXMgYW55KS5kYXRhO1xuICAgICAgICBpZiAoICFvZC5pbnZvaWNlSW5mbyApIHsgcmV0dXJuOyB9XG4gICAgICAgIG5hdlRvKGAvcGFnZXMvb3JkZXItZGV0YWlsL2luZGV4P3NpPTEmbm89JHtub31gKTtcbiAgICB9LFxuXG4gICAgLyoqIOiuouWNleaUr+S7mCAqL1xuICAgIG9uUGF5KCApIHtcbiAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzXy5kYXRhLm9kO1xuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6XCJnb3RvUGF5XCIsXG4gICAgICAgICAgICBcIiR0c1wiOm5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgXCJnb29kc0lkXCI6IGl0ZW0uaWRcbiAgICAgICAgfV0pO1xuICAgICAgICBpZih0aGlzLmRhdGEuY291bnRkb3duPD0wKSB7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+iuouWNleW3sui/h+acn++9nidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCfmiJHopoHmlK/ku5gnLCBpdGVtKTtcbiAgICAgICAgaXRlbS50eXBlID09PSAnT0ZGTElORV9QQVknICYmICBuYXZUbyhgL3BhZ2VzL3BheS1yZXMvaW5kZXg/c3RhdGU9V0FJVF9SRU1JVCZubz0ke2l0ZW0ub3JkZXJOb31gKVxuICAgICAgICAvLyB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgLy8gICAgIHVybDogYC9wYWdlcy9wYXktcmVzL2luZGV4P3N0YXRlPVdBSVRfUkVNSVQmbm89JHtpdGVtLm9yZGVyTm99YFxuICAgICAgICAvLyB9KVxuICAgICAgIFxuICAgICAgICBpdGVtLnR5cGUgPT09ICdPTkxJTkVfUEFZJyAmJiB0aGlzLnd4UGF5KHtcbiAgICAgICAgICAgIG91dF90cmFkZV9ubzogaXRlbS5pZCwgIC8vIOiuouWNlWlkXG4gICAgICAgICAgICAvLyBUT0RPOiDmraTlpITmtYvor5XmlK/ku5jvvIzmmoLml7blrprkuLrkuIDliIbpkrEo5q2j5byP546v5aKD5ZCO56uv5o6n5Yi277yM5LiN5b2x5ZONKVxuICAgICAgICAgICAgdG90YWxfZmVlOiBpdGVtLmFjdFByaWNlICogMTAwLCAgIC8vIOaAu+S7t+agvFxuICAgICAgICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICAgICAgICBvcGVuaWQ6IHN0b3JlJC5BdXRoLm9wZW5pZCxcbiAgICAgICAgICAgIGJvZHk6ICfmlK/ku5jllYblk4EnXG4gICAgICAgIH0saXRlbS5vcmRlck5vKTtcbiAgICB9LFxuXG4gICAgLy8g5b6u5L+h6aKE5pSv5LuYXG4gICAgd3hQYXkoZGF0YSwgb3JkZXJObykge1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgcGF0aDogJy9hcGlzL3d4UGF5L3ByZXBheScsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgZXJyTXNnOiAn5pSv5LuY5Ye66ZSZ5ZWmIO+9nidcbiAgICAgICAgfSkudGhlbigodmFsKSA9PiB7XG5cbiAgICAgICAgICAgIGlmICh2YWwuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3eC5yZXF1ZXN0UGF5bWVudChPYmplY3QuYXNzaWduKHZhbC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJNc2c6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9vcmRlci9mcm9udGVuZF9jb25maXJtLyR7ZGF0YS5vdXRfdHJhZGVfbm99YCxcbiAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmF2VG8oYC9wYWdlcy9vcmRlci1kZXRhaWwvaW5kZXg/bm89JHtvcmRlck5vfWApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aUr+S7mOWksei0pScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcign5Ye66ZSZ5LqGNDQ6JywgZSk7XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDogZTns7vlrqLmnI0gKi9cbiAgICBvbkNhbGwoICkge1xuICAgICAgICB3eC5tYWtlUGhvbmVDYWxsKHtcbiAgICAgICAgICAgIHBob25lTnVtYmVyOiBhcHAuc3RvcmUuQ29tbW9uLmN1c3RvbWVyU2VydmljZVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvKiog5aSN5Yi2ICovXG4gICAgb25Db3B5KHsgY3VycmVudFRhcmdldCB9KSB7XG4gICAgICAgIGNvbnN0IHsgY2xpcGJvYXJkIH0gPSBjdXJyZW50VGFyZ2V0LmRhdGFzZXQ7XG4gICAgICAgICEhY2xpcGJvYXJkICYmIHd4LnNldENsaXBib2FyZERhdGEoe1xuICAgICAgICAgICAgZGF0YTogY2xpcGJvYXJkXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvbkxvYWQoIHE6IGFueSApIHtcbiAgICAgICAgLy8g5aKe5Yqg6Ziy5oqW5Ye95pWwXG4gICAgICAgIHRoaXMub25QYXkgPSBkZWJvdW5jZSh0aGlzLm9uUGF5ICwgNTAwKTtcbiAgICAgICAgdGhpcy5vbkNhbmNlbCA9IGRlYm91bmNlKHRoaXMub25DYW5jZWwgLCA1MDApO1xuICAgICAgICBjb25zdCB7IHNpLCBubyB9ID0gcTtcbiAgICAgICAgdGhpcy5nZXRPcmRlckRldGFpbCggbm8gKTtcbiAgICAgICAgdGhpcy5ydW5Db21wdXRlZCggKTtcblxuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIG5vXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggISFzaSApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNob3dJbnZvaWNlOiBzaVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBvblNob3coICkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIGVudGVyVGltZTogRGF0ZS5ub3coIClcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgb25IaWRlKCApIHtcbiAgICAgICAgY29uc3QgeyBlbnRlclRpbWUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgLy8g6K6i5Y2V6K+m5oOFUFbln4vngrlcbiAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgXCIkY29kZVwiOiBcInNlbGVjdEJlY29tZVBhcnRuZXJcIiAsXG4gICAgICAgICAgICBcIiR0c1wiOiBlbnRlclRpbWUsXG4gICAgICAgICAgICBcImVudGVyVGltZVwiOiBlbnRlclRpbWUsXG4gICAgICAgICAgICBcImxlYXZlVGltZVwiOiBEYXRlLm5vdyggKVxuICAgICAgICB9XSk7XG4gICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgZW50ZXJUaW1lOiAwXG4gICAgICAgIH0pO1xuICAgIH1cbn0pIl19