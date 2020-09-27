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
var index_1 = require("../../lib/vuefy/index");
var route_1 = require("../../utils/route");
var index_2 = require("../../store/index");
var util_1 = require("../../utils/util");
var app = getApp();
Page({
    data: {
        isIPhoneX: false,
        refresh: '',
        orderPrice: {
            actPrice: '--',
            discountPrice: '--'
        },
        sku: {},
        goodsItems: [],
        address: {},
        payMethods: [
            {
                id: 'OFFLINE_PAY',
                name: '线下支付'
            },
            {
                id: 'ONLINE_PAY',
                name: '微信支付'
            }
        ],
        invoiceType: '',
        payWay: {
            id: '',
            name: ''
        },
        coupons: {
            id: '',
            name: ''
        },
        selectedAddressId: ''
    },
    query: {
        skuIds: [],
        counts: []
    },
    enterTime: 0,
    orderData: {
        receivers: [],
        items: [],
        invoiceInfo: {
            id: '',
            type: ''
        },
        isInvoice: '0',
        state: '',
        type: '',
        source: ''
    },
    watchApp: function () {
        var _this = this;
        app.watch$('Common.isIPhoneX', function (v) {
            _this.setData({
                isIPhoneX: v
            });
        });
    },
    runComputed: function () {
        index_1.computed(this, {});
    },
    onPickPay: function (e) {
        var res = this.data.payMethods.filter(function (v, i) { return i === Number(e.detail.value); });
        res.length > 0 && this.setData({
            payWay: res[0]
        });
    },
    open: function () {
        var this_ = this;
        var pop = this_.selectComponent('#coupon');
        pop.open();
    },
    onAddressChange: function (data) {
        this.orderData.receivers = [data.detail];
        if (!this.orderData.invoiceInfo.type) {
            this.setData({
                selectedAddressId: data.detail.id
            });
        }
    },
    onPickCoupon: function (_a) {
        var detail = _a.detail;
        var _b = this.query, skuIds = _b.skuIds, counts = _b.counts;
        this.computePrice(skuIds.map(function (item, index) {
            return {
                skuCode: item,
                qty: counts[index] || 0,
                couponIds: detail.map(function (v) { return v.id; })
            };
        }));
    },
    navToInvoice: function () {
        route_1.navTo('/pages/invoice-create/index');
    },
    checkSubmitParams: function () {
        if (this.orderData.receivers.length === 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入收货地址',
                mask: true
            });
            return false;
        }
        else if (!this.orderData.invoiceInfo.type) {
            wx.showToast({
                icon: 'none',
                title: '请完善发票信息',
                mask: true
            });
            return false;
        }
        else if (!this.data.payWay.id) {
            wx.showToast({
                icon: 'none',
                title: '请输选择支付方式',
                mask: true
            });
            return false;
        }
        return true;
    },
    onSubmitOrder: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, skuIds, counts;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.checkSubmitParams()) {
                            return [2];
                        }
                        _a = this.query, skuIds = _a.skuIds, counts = _a.counts;
                        return [4, this.computePrice(skuIds.map(function (item, index) {
                                return {
                                    skuCode: item,
                                    qty: counts[index] || 0,
                                    couponIds: _this.orderData.items[0].couponIds
                                };
                            }))];
                    case 1:
                        _b.sent();
                        this.orderData.state = 'WAIT_PAY';
                        this.orderData.type = this.data.payWay.id;
                        this.orderData.source = 'SYS';
                        this.orderData.isInvoice = this.orderData.invoiceInfo.type !== 'NO_TICKETS' ? '1' : '0';
                        console.log('提交参数', this.orderData);
                        this.generateOrder(this.orderData);
                        return [2];
                }
            });
        });
    },
    onLoad: function (q) {
        var _this = this;
        this.watchApp();
        this.onSubmitOrder = util_1.debounce(this.onSubmitOrder, 500);
        var skuIds = q.skuIds, counts = q.counts;
        this.query = {
            skuIds: decodeURIComponent(skuIds).split(','),
            counts: decodeURIComponent(counts).split(',')
        };
        this.computePrice(this.query.skuIds.map(function (item, index) {
            return {
                skuCode: item,
                qty: _this.query.counts[index] || 0,
                couponIds: []
            };
        }));
        Promise.all(this.query.skuIds.map(function (items, index) {
            return _this.getDetailBySku(items);
        })).then(function (data) {
            _this.setData({
                goodsItems: data.map(function (v, i) {
                    return {
                        image: v.bannerImgs[0],
                        name: v.title,
                        desc: v.description,
                        price: v.price.toFixed(2),
                        count: _this.query.counts[i],
                        unit: v.unit
                    };
                }),
                sku: {
                    num: _this.query.counts[0],
                    skuCode: _this.query.skuIds[0]
                }
            });
        });
    },
    onShow: function () {
        this.setData({
            refresh: (Math.random() * 9999).toFixed(0)
        });
        this.enterTime = new Date().getTime();
    },
    onHide: function () {
        app.dataBury$([{
                "$code": "fillOrder",
                "$ts": this.enterTime,
                "enterTime": this.enterTime,
                "leaveTime": new Date().getTime()
            }]);
        this.enterTime = 0;
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
            var changeState = function (data) {
                http_1.http({
                    method: 'PUT',
                    errMsg: 'none',
                    path: "/apis/order/frontend_confirm/" + data.out_trade_no,
                }).then(function () {
                    wx.redirectTo({
                        url: "/pages/order-detail/index?no=" + orderNo,
                    });
                });
            };
            data.total_fee === 0 && changeState(data);
            data.total_fee > 0 && wx.requestPayment(Object.assign(val.data, {
                success: function (res) {
                    changeState(data);
                }, fail: function (res) {
                    wx.redirectTo({
                        url: "/pages/order-detail/index?no=" + orderNo,
                    });
                }
            }));
        }).catch(function (e) {
            console.error('出错了33:', e);
        });
    },
    getDetailBySku: function (id) {
        return http_1.http({
            method: 'get',
            path: "/apis/goods/sku/detail/" + id
        }).then(function (val) {
            return val.data;
        });
    },
    computePrice: function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var dedupKey;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, util_1.getUuid()];
                    case 1:
                        dedupKey = _a.sent();
                        http_1.http({
                            method: 'post',
                            path: "/apis/goods/price",
                            data: {
                                couponIds: [],
                                dedupKey: dedupKey.data,
                                isFreeShipping: 1,
                                items: items
                            }
                        }).then(function (val) {
                            if (val.status === 200)
                                console.log('计算后的价格', val.data);
                            _this.setData({
                                orderPrice: {
                                    actPrice: String(val.data.actPrice),
                                    discountPrice: String(val.data.discountPrice)
                                }
                            });
                            _this.orderData = Object.assign({}, val.data, _this.orderData.state, {
                                receivers: _this.orderData.receivers,
                                invoiceInfo: _this.orderData.invoiceInfo
                            });
                        });
                        return [2];
                }
            });
        });
    },
    generateOrder: function (data) {
        var _this = this;
        http_1.http({
            method: 'post',
            path: "/apis/order/generate",
            data: data
        }).then(function (val) {
            if (val.status !== 200) {
                wx.showToast({
                    icon: 'none',
                    title: '请求错误，请重试',
                    mask: true
                });
                return;
            }
            app.dataBury$([{
                    "$code": "submitOrder",
                    "$ts": new Date().getTime(),
                    "orderNo": val.data.orderNo
                }]);
            console.log('生成订单了', val.data);
            _this.data.payWay.id === 'OFFLINE_PAY' && wx.redirectTo({
                url: "/pages/pay-res/index?state=WAIT_REMIT&no=" + val.data.orderNo,
            });
            _this.data.payWay.id === 'ONLINE_PAY' && _this.wxPay({
                out_trade_no: val.data.id,
                total_fee: val.data.actPrice * 100,
                spbill_create_ip: '127.0.0.1',
                openid: index_2.store$.Auth.openid,
                body: '支付商品'
            }, val.data.orderNo);
        });
    },
    onUnload: function () {
        console.log('离开了');
    },
    onInvoiceChange: function (_a) {
        var detail = _a.detail;
        console.log('变化', detail);
        this.orderData.invoiceInfo = Object.assign({}, detail, __assign({}, detail.addressDetail));
        delete this.orderData.invoiceInfo.addressDetail;
        this.setData({
            selectedAddressId: ''
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx5Q0FBd0M7QUFDeEMsK0NBQWlEO0FBQ2pELDJDQUEwQztBQUMxQywyQ0FBMkM7QUFDM0MseUNBQXFEO0FBR3JELElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBUSxDQUFDO0FBRTNCLElBQUksQ0FBQztJQUVELElBQUksRUFBRTtRQUNGLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxFQUFFO1FBRVgsVUFBVSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxhQUFhLEVBQUUsSUFBSTtTQUN0QjtRQUNELEdBQUcsRUFBRSxFQUFFO1FBQ1AsVUFBVSxFQUFFLEVBQUU7UUFDZCxPQUFPLEVBQUUsRUFBRTtRQUNYLFVBQVUsRUFBRTtZQUNSO2dCQUNJLEVBQUUsRUFBRSxhQUFhO2dCQUNqQixJQUFJLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0ksRUFBRSxFQUFFLFlBQVk7Z0JBQ2hCLElBQUksRUFBRSxNQUFNO2FBQ2Y7U0FDSjtRQUVELFdBQVcsRUFBRSxFQUFFO1FBRWYsTUFBTSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUU7WUFDTixJQUFJLEVBQUUsRUFBRTtTQUNYO1FBRUQsT0FBTyxFQUFFO1lBQ0wsRUFBRSxFQUFFLEVBQUU7WUFDTixJQUFJLEVBQUUsRUFBRTtTQUNYO1FBRUQsaUJBQWlCLEVBQUUsRUFBRTtLQUN4QjtJQUdELEtBQUssRUFBRTtRQUNILE1BQU0sRUFBRSxFQUFFO1FBQ1YsTUFBTSxFQUFFLEVBQUU7S0FDYjtJQUdELFNBQVMsRUFBRSxDQUFDO0lBR1osU0FBUyxFQUFFO1FBRVAsU0FBUyxFQUFFLEVBQUU7UUFFYixLQUFLLEVBQUUsRUFBRTtRQUVULFdBQVcsRUFBRTtZQUNULEVBQUUsRUFBRSxFQUFFO1lB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YUFDcEUsQ0FBQyxDQUFBO1lBQ0osS0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLFlBQVksSUFBSSxLQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMvQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUV6QixTQUFTLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRztnQkFDbEMsZ0JBQWdCLEVBQUUsV0FBVztnQkFDN0IsTUFBTSxFQUFFLGNBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTTtnQkFDMUIsSUFBSSxFQUFFLE1BQU07YUFDZixFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUdELGVBQWUsWUFBQyxFQUFVO1lBQVIsa0JBQU07UUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQWlCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sZUFBTyxNQUFNLENBQUMsYUFBYSxFQUFHLENBQUM7UUFDN0YsT0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQW1CLENBQUMsYUFBYSxDQUFDO1FBQ3pELElBQUksQ0FBQyxPQUFRLENBQUM7WUFDVixpQkFBaUIsRUFBRSxFQUFFO1NBQ3hCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleCc7XG5pbXBvcnQgeyBJQXBwIH0gZnJvbSBcIi4uLy4uL2dsb2JhbFwiO1xuaW1wb3J0IHsgaHR0cCB9IGZyb20gJy4uLy4uL3V0aWxzL2h0dHAnO1xuaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICcuLi8uLi9saWIvdnVlZnkvaW5kZXgnO1xuaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZSc7XG5pbXBvcnQgeyBzdG9yZSQgfSBmcm9tICcuLi8uLi9zdG9yZS9pbmRleCc7XG5pbXBvcnQgeyBnZXRVdWlkLCBkZWJvdW5jZSB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWwnO1xuaW1wb3J0IHsgSW52b2ljZUNob2ljZVR5cGUsIEludm9pY2VUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbHMvY29uc3RhbnQnO1xuXG5jb25zdCBhcHAgPSBnZXRBcHA8SUFwcD4oKTtcblxuUGFnZSh7XG5cbiAgICBkYXRhOiB7XG4gICAgICAgIGlzSVBob25lWDogZmFsc2UsXG4gICAgICAgIHJlZnJlc2g6ICcnLFxuICAgICAgICAvLyDorqLljZXmgLvku7fmoLxcYlxuICAgICAgICBvcmRlclByaWNlOiB7XG4gICAgICAgICAgICBhY3RQcmljZTogJy0tJyxcbiAgICAgICAgICAgIGRpc2NvdW50UHJpY2U6ICctLSdcbiAgICAgICAgfSxcbiAgICAgICAgc2t1OiB7fSxcbiAgICAgICAgZ29vZHNJdGVtczogW10sIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBhZGRyZXNzOiB7fSwgIC8vIOaUtui0p+WcsOWdgFxuICAgICAgICBwYXlNZXRob2RzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdPRkZMSU5FX1BBWScsXG4gICAgICAgICAgICAgICAgbmFtZTogJ+e6v+S4i+aUr+S7mCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdPTkxJTkVfUEFZJyxcbiAgICAgICAgICAgICAgICBuYW1lOiAn5b6u5L+h5pSv5LuYJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICAvLyDlvIDnpajmlrnlvI9cbiAgICAgICAgaW52b2ljZVR5cGU6ICcnLFxuICAgICAgICAvLyDmlK/ku5jmlrnlvI9cbiAgICAgICAgcGF5V2F5OiB7XG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICB9LFxuICAgICAgICAvLyDnlKjliLhcbiAgICAgICAgY291cG9uczoge1xuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgbmFtZTogJydcbiAgICAgICAgfSxcbiAgICAgICAgLy8g55uu5YmN5bey6YCJ55qE5pS26I635Zyw5Z2AaWRcbiAgICAgICAgc2VsZWN0ZWRBZGRyZXNzSWQ6ICcnXG4gICAgfSxcblxuICAgIC8vIHF1ZXJ55Y+C5pWwXG4gICAgcXVlcnk6IHtcbiAgICAgICAgc2t1SWRzOiBbXSxcbiAgICAgICAgY291bnRzOiBbXVxuICAgIH0sXG5cbiAgICAvLyDnprvlvIDpobXpnaLml7bpl7RcbiAgICBlbnRlclRpbWU6IDAsXG5cbiAgICAvLyDmj5DkuqTorqLljZXnmoTmlbDmja7nu5PmnoRcbiAgICBvcmRlckRhdGE6IHtcbiAgICAgICAgLy8g5pS25Lu25Lq6XG4gICAgICAgIHJlY2VpdmVyczogW10sXG4gICAgICAgIC8vIOWVhuWTgeWIl+ihqFxuICAgICAgICBpdGVtczogW10sXG4gICAgICAgIC8vIOWPkeelqOS/oeaBr1xuICAgICAgICBpbnZvaWNlSW5mbzoge1xuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgdHlwZTogJydcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5piv5ZCm5byA56WoXG4gICAgICAgIGlzSW52b2ljZTogJzAnLFxuICAgICAgICAvLyDlvZPliY3orqLljZXnirbmgIFcbiAgICAgICAgc3RhdGU6ICcnLFxuICAgICAgICAvLyDmlK/ku5jmlrnlvI9cbiAgICAgICAgdHlwZTogJycsXG4gICAgICAgIC8vIOadpea6kFxuICAgICAgICBzb3VyY2U6ICcnXG4gICAgfSxcblxuICAgIC8qKiDnm5HlkKwgKi9cbiAgICB3YXRjaEFwcCggKSB7XG4gICAgICAgIGFwcC53YXRjaCQoJ0NvbW1vbi5pc0lQaG9uZVgnLCB2ID0+IHtcbiAgICAgICAgICAgICAvLyDlhbzlrrlpcG9uZVhcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGlzSVBob25lWDogdlxuICAgICAgICAgICAgfSkgXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBydW5Db21wdXRlZCgpIHtcbiAgICAgICAgY29tcHV0ZWQodGhpcywge1xuXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvLyDpgInmi6nmlK/ku5jmlrnlvI/lm57osINcbiAgICBvblBpY2tQYXkoZSkge1xuICAgICAgICBjb25zdCByZXMgPSB0aGlzLmRhdGEucGF5TWV0aG9kcy5maWx0ZXIoKHYsIGkpID0+IGkgPT09IE51bWJlcihlLmRldGFpbC52YWx1ZSkpO1xuICAgICAgICByZXMubGVuZ3RoID4gMCAmJiB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHBheVdheTogcmVzWzBdXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKiDmiZPlvIDkvJjmg6DliLjpgInmi6npobXpnaIgKi9cbiAgICBvcGVuKCkge1xuICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgY29uc3QgcG9wID0gdGhpc18uc2VsZWN0Q29tcG9uZW50KCcjY291cG9uJyk7XG4gICAgICAgIHBvcC5vcGVuKCk7XG4gICAgfSxcblxuICAgIC8vIOWcsOWdgOmAieaLqeWbnuiwg1xuICAgIG9uQWRkcmVzc0NoYW5nZShkYXRhKSB7XG4gICAgICAgICh0aGlzLm9yZGVyRGF0YSBhcyBhbnkpLnJlY2VpdmVycyA9IFtkYXRhLmRldGFpbF07XG4gICAgICAgIFxuICAgICAgICAvLyDlpoLmnpzmnKrpgInmi6nlvIDnpajkv6Hmga/vvIzliJnmiormlLbmrL7lnLDlnYDpu5jorqTkuLrlvIDnpajlnLDlnYBcbiAgICAgICAgaWYgKCAhdGhpcy5vcmRlckRhdGEuaW52b2ljZUluZm8udHlwZSApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkQWRkcmVzc0lkOiBkYXRhLmRldGFpbC5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g6YCJ5oup5LyY5oOg5Yi45Zue6LCDXG4gICAgb25QaWNrQ291cG9uKHsgZGV0YWlsIH0pIHtcbiAgICAgICAgY29uc3QgeyBza3VJZHMsIGNvdW50cyB9ID0gdGhpcy5xdWVyeTtcbiAgICAgICAgdGhpcy5jb21wdXRlUHJpY2Uoc2t1SWRzLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc2t1Q29kZTogaXRlbSxcbiAgICAgICAgICAgICAgICBxdHk6IGNvdW50c1tpbmRleF0gfHwgMCxcbiAgICAgICAgICAgICAgICBjb3Vwb25JZHM6IGRldGFpbC5tYXAodiA9PiB2LmlkKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSxcblxuICAgIC8vIOi3s+i9rOiHs+iuouWNleW8gOelqFxuICAgIG5hdlRvSW52b2ljZSgpIHtcbiAgICAgICAgbmF2VG8oJy9wYWdlcy9pbnZvaWNlLWNyZWF0ZS9pbmRleCcpO1xuICAgIH0sXG5cbiAgICAvLyDmoKHpqozor7fmsYLlj4LmlbBcbiAgICBjaGVja1N1Ym1pdFBhcmFtcygpIHtcbiAgICAgICAgaWYgKHRoaXMub3JkZXJEYXRhLnJlY2VpdmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+36L6T5YWl5pS26LSn5Zyw5Z2AJyxcbiAgICAgICAgICAgICAgICBtYXNrOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5vcmRlckRhdGEuaW52b2ljZUluZm8udHlwZSkge1xuICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfor7flrozlloTlj5Hnpajkv6Hmga8nLFxuICAgICAgICAgICAgICAgIG1hc2s6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmRhdGEucGF5V2F5LmlkKSB7XG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ivt+i+k+mAieaLqeaUr+S7mOaWueW8jycsXG4gICAgICAgICAgICAgICAgbWFzazogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAvLyDmj5DkuqTorqLljZVcbiAgICBhc3luYyBvblN1Ym1pdE9yZGVyKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNoZWNrU3VibWl0UGFyYW1zKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHNrdUlkcywgY291bnRzIH0gPSB0aGlzLnF1ZXJ5O1xuICAgICAgICBhd2FpdCB0aGlzLmNvbXB1dGVQcmljZShza3VJZHMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBza3VDb2RlOiBpdGVtLFxuICAgICAgICAgICAgICAgIHF0eTogY291bnRzW2luZGV4XSB8fCAwLFxuICAgICAgICAgICAgICAgIGNvdXBvbklkczogKHRoaXMub3JkZXJEYXRhLml0ZW1zWzBdIGFzIGFueSkuY291cG9uSWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5vcmRlckRhdGEuc3RhdGUgPSAnV0FJVF9QQVknO1xuICAgICAgICB0aGlzLm9yZGVyRGF0YS50eXBlID0gdGhpcy5kYXRhLnBheVdheS5pZDtcbiAgICAgICAgdGhpcy5vcmRlckRhdGEuc291cmNlID0gJ1NZUyc7XG4gICAgICAgIHRoaXMub3JkZXJEYXRhLmlzSW52b2ljZSA9IHRoaXMub3JkZXJEYXRhLmludm9pY2VJbmZvLnR5cGUgIT09ICdOT19USUNLRVRTJyA/ICcxJyA6ICcwJztcbiAgICAgICAgY29uc29sZS5sb2coJ+aPkOS6pOWPguaVsCcsIHRoaXMub3JkZXJEYXRhKTtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZU9yZGVyKHRoaXMub3JkZXJEYXRhKTtcblxuICAgIH0sXG5cbiAgICBvbkxvYWQocTogYW55KSB7XG4gICAgICAgIHRoaXMud2F0Y2hBcHAoICk7XG4gICAgICAgIC8vIOWinuWKoOmYsuaKluWKqFxuICAgICAgICAodGhpcy5vblN1Ym1pdE9yZGVyIGFzIGFueSkgPSBkZWJvdW5jZSh0aGlzLm9uU3VibWl0T3JkZXIgLCA1MDApO1xuICAgICAgICBjb25zdCB7IHNrdUlkcywgY291bnRzIH0gPSBxO1xuICAgICAgICAodGhpcyBhcyBhbnkpLnF1ZXJ5ID0ge1xuICAgICAgICAgICAgc2t1SWRzOiBkZWNvZGVVUklDb21wb25lbnQoc2t1SWRzKS5zcGxpdCgnLCcpLFxuICAgICAgICAgICAgY291bnRzOiBkZWNvZGVVUklDb21wb25lbnQoY291bnRzKS5zcGxpdCgnLCcpXG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhpcy53YXRjaEFwcCgpO1xuICAgICAgICB0aGlzLmNvbXB1dGVQcmljZSh0aGlzLnF1ZXJ5LnNrdUlkcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNrdUNvZGU6IGl0ZW0sXG4gICAgICAgICAgICAgICAgcXR5OiB0aGlzLnF1ZXJ5LmNvdW50c1tpbmRleF0gfHwgMCxcbiAgICAgICAgICAgICAgICBjb3Vwb25JZHM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgUHJvbWlzZS5hbGwodGhpcy5xdWVyeS5za3VJZHMubWFwKChpdGVtcywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERldGFpbEJ5U2t1KGl0ZW1zKTtcbiAgICAgICAgfSkpLnRoZW4oZGF0YSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIGdvb2RzSXRlbXM6IGRhdGEubWFwKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogdi5iYW5uZXJJbWdzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdi50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2M6IHYuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogdi5wcmljZS50b0ZpeGVkKDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQ6IHRoaXMucXVlcnkuY291bnRzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdDogdi51bml0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBza3U6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtOiB0aGlzLnF1ZXJ5LmNvdW50c1swXSxcbiAgICAgICAgICAgICAgICAgICAgc2t1Q29kZTogdGhpcy5xdWVyeS5za3VJZHNbMF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgb25TaG93KCkge1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHJlZnJlc2g6IChNYXRoLnJhbmRvbSgpICogOTk5OSkudG9GaXhlZCgwKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5lbnRlclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9LFxuXG4gICAgb25IaWRlKCkge1xuICAgICAgICAvLyDloavlhpnorqLljZVQVuWfi+eCuVxuICAgICAgICBhcHAuZGF0YUJ1cnkkKFt7XG4gICAgICAgICAgICBcIiRjb2RlXCI6IFwiZmlsbE9yZGVyXCIsXG4gICAgICAgICAgICBcIiR0c1wiOiB0aGlzLmVudGVyVGltZSxcbiAgICAgICAgICAgIFwiZW50ZXJUaW1lXCI6IHRoaXMuZW50ZXJUaW1lLFxuICAgICAgICAgICAgXCJsZWF2ZVRpbWVcIjogbmV3IERhdGUoKS5nZXRUaW1lKClcbiAgICAgICAgfV0pO1xuICAgICAgICB0aGlzLmVudGVyVGltZSA9IDA7XG4gICAgfSxcblxuICAgIC8vIOW+ruS/oemihOaUr+S7mFxuICAgIHd4UGF5KGRhdGEsIG9yZGVyTm8pIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIHBhdGg6ICcvYXBpcy93eFBheS9wcmVwYXknLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGVyck1zZzogJ+aUr+S7mOWHuumUmeWVpiDvvZ4nXG4gICAgICAgIH0pLnRoZW4oKHZhbCkgPT4ge1xuXG4gICAgICAgICAgICBpZiAodmFsLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8g5L+u5pS56K6i5Y2V54q25oCBXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgICAgICAgICAgICAgIGVyck1zZzogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBgL2FwaXMvb3JkZXIvZnJvbnRlbmRfY29uZmlybS8ke2RhdGEub3V0X3RyYWRlX25vfWAsXG4gICAgICAgICAgICAgICAgfSkudGhlbigoICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYC9wYWdlcy9vcmRlci1kZXRhaWwvaW5kZXg/bm89JHtvcmRlck5vfWAsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIOWunumZheaUr+S7mOmHkemineS4ujDnmoTmg4XlhrVcbiAgICAgICAgICAgIGRhdGEudG90YWxfZmVlID09PSAwICYmIGNoYW5nZVN0YXRlKGRhdGEpO1xuICAgICAgICAgICAgIC8vIOWunumZheaUr+S7mOmHkemineS4jeS4ujDnmoTmg4XlhrVcbiAgICAgICAgICAgIGRhdGEudG90YWxfZmVlID4gMCAmJiB3eC5yZXF1ZXN0UGF5bWVudChPYmplY3QuYXNzaWduKHZhbC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZShkYXRhKTtcbiAgICAgICAgICAgICAgICB9LCBmYWlsOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHBhdGg6IGAvYXBpcy9vcmRlci9zZXRfd2FpdF9wYXkvJHtkYXRhLm91dF90cmFkZV9ub31gLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgZXJyTXNnOiAn6YeN572u6K6i5Y2V54q25oCB5aSx6LSl772eJ1xuICAgICAgICAgICAgICAgICAgICAvLyB9KS50aGVuKHZhbHVlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmKHZhbHVlLnN0YXR1cyAhPT0gMjAwKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm4gO1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgd3gucmVkaXJlY3RUbyh7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdXJsOiBgL3BhZ2VzL29yZGVyLWRldGFpbC9pbmRleD9ubz0ke29yZGVyTm99YCxcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAgICAgICAgIHd4LnJlZGlyZWN0VG8oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL29yZGVyLWRldGFpbC9pbmRleD9ubz0ke29yZGVyTm99YCxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCflh7rplJnkuoYzMzonLCBlKTtcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5qC55o2uc2t1aWTojrflj5bllYblk4Hor6bmg4VcbiAgICBnZXREZXRhaWxCeVNrdShpZCkge1xuICAgICAgICByZXR1cm4gaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL2dvb2RzL3NrdS9kZXRhaWwvJHtpZH1gXG4gICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgIHJldHVybiB2YWwuZGF0YTtcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g6K6h566X5a6e6ZmF57uT566X5Lu35qC8XG4gICAgYXN5bmMgY29tcHV0ZVByaWNlKGl0ZW1zKSB7XG4gICAgICAgIGNvbnN0IGRlZHVwS2V5ID0gYXdhaXQgZ2V0VXVpZCgpO1xuICAgICAgICBodHRwKHtcbiAgICAgICAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgICAgICAgcGF0aDogYC9hcGlzL2dvb2RzL3ByaWNlYCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBjb3Vwb25JZHM6IFtdLFxuICAgICAgICAgICAgICAgIGRlZHVwS2V5OiBkZWR1cEtleS5kYXRhLFxuICAgICAgICAgICAgICAgIGlzRnJlZVNoaXBwaW5nOiAxLFxuICAgICAgICAgICAgICAgIGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgIGlmICh2YWwuc3RhdHVzID09PSAyMDApXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ+iuoeeul+WQjueahOS7t+agvCcsIHZhbC5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSEoe1xuICAgICAgICAgICAgICAgIG9yZGVyUHJpY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0UHJpY2U6IFN0cmluZyh2YWwuZGF0YS5hY3RQcmljZSksXG4gICAgICAgICAgICAgICAgICAgIGRpc2NvdW50UHJpY2U6IFN0cmluZyh2YWwuZGF0YS5kaXNjb3VudFByaWNlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5vcmRlckRhdGEgPSBPYmplY3QuYXNzaWduKHt9LCB2YWwuZGF0YSwgdGhpcy5vcmRlckRhdGEuc3RhdGUsIHtcbiAgICAgICAgICAgICAgICByZWNlaXZlcnM6IHRoaXMub3JkZXJEYXRhLnJlY2VpdmVycyxcbiAgICAgICAgICAgICAgICBpbnZvaWNlSW5mbzogdGhpcy5vcmRlckRhdGEuaW52b2ljZUluZm9cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDnlJ/miJDorqLljZVcbiAgICBnZW5lcmF0ZU9yZGVyKGRhdGEpIHtcbiAgICAgICAgaHR0cCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgIHBhdGg6IGAvYXBpcy9vcmRlci9nZW5lcmF0ZWAsXG4gICAgICAgICAgICBkYXRhXG4gICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgIGlmICh2YWwuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35rGC6ZSZ6K+v77yM6K+36YeN6K+VJyxcbiAgICAgICAgICAgICAgICAgICAgbWFzazogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGZyaWRheeaPkOS6pOiuouWNleS4iuaKpVxuICAgICAgICAgICAgYXBwLmRhdGFCdXJ5JChbe1xuICAgICAgICAgICAgICAgIFwiJGNvZGVcIjogXCJzdWJtaXRPcmRlclwiLFxuICAgICAgICAgICAgICAgIFwiJHRzXCI6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgIFwib3JkZXJOb1wiOiB2YWwuZGF0YS5vcmRlck5vXG4gICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn55Sf5oiQ6K6i5Y2V5LqGJywgdmFsLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5kYXRhLnBheVdheS5pZCA9PT0gJ09GRkxJTkVfUEFZJyAmJiB3eC5yZWRpcmVjdFRvKHtcbiAgICAgICAgICAgICAgICB1cmw6IGAvcGFnZXMvcGF5LXJlcy9pbmRleD9zdGF0ZT1XQUlUX1JFTUlUJm5vPSR7dmFsLmRhdGEub3JkZXJOb31gLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgdGhpcy5kYXRhLnBheVdheS5pZCA9PT0gJ09OTElORV9QQVknICYmIHRoaXMud3hQYXkoe1xuICAgICAgICAgICAgICAgIG91dF90cmFkZV9ubzogdmFsLmRhdGEuaWQsICAvLyDorqLljZVpZFxuICAgICAgICAgICAgICAgIC8vIFRPRE86IOatpOWkhOa1i+ivleaUr+S7mO+8jOaaguaXtuWumuS4uuS4gOWIhumSsSjmraPlvI/njq/looPlkI7nq6/mjqfliLbvvIzkuI3lvbHlk40pXG4gICAgICAgICAgICAgICAgdG90YWxfZmVlOiB2YWwuZGF0YS5hY3RQcmljZSAqIDEwMCwgICAvLyDmgLvku7fmoLxcbiAgICAgICAgICAgICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgICAgICAgICAgICBvcGVuaWQ6IHN0b3JlJC5BdXRoLm9wZW5pZCxcbiAgICAgICAgICAgICAgICBib2R5OiAn5pSv5LuY5ZWG5ZOBJ1xuICAgICAgICAgICAgfSx2YWwuZGF0YS5vcmRlck5vKTtcbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgb25VbmxvYWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfnprvlvIDkuoYnKTtcbiAgICB9LFxuXG5cbiAgICBvbkludm9pY2VDaGFuZ2UoeyBkZXRhaWwgfSkge1xuICAgICAgICBjb25zb2xlLmxvZygn5Y+Y5YyWJywgZGV0YWlsKTtcbiAgICAgICAgKHRoaXMub3JkZXJEYXRhIGFzIGFueSkuaW52b2ljZUluZm8gPSBPYmplY3QuYXNzaWduKHt9LCBkZXRhaWwsIHsgLi4uZGV0YWlsLmFkZHJlc3NEZXRhaWwgfSk7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5vcmRlckRhdGEuaW52b2ljZUluZm8gYXMgYW55KS5hZGRyZXNzRGV0YWlsO1xuICAgICAgICB0aGlzLnNldERhdGEhKHtcbiAgICAgICAgICAgIHNlbGVjdGVkQWRkcmVzc0lkOiAnJ1xuICAgICAgICB9KTtcbiAgICB9XG59KVxuIl19