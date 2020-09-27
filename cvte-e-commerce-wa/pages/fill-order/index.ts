import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { store$ } from '../../store/index';
import { getUuid, debounce } from '../../utils/util';
import { InvoiceChoiceType, InvoiceType } from '../../utils/constant';

const app = getApp<IApp>();

Page({

    data: {
        isIPhoneX: false,
        refresh: '',
        // 订单总价格
        orderPrice: {
            actPrice: '--',
            discountPrice: '--'
        },
        sku: {},
        goodsItems: [], // 商品列表
        address: {},  // 收货地址
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
        // 开票方式
        invoiceType: '',
        // 支付方式
        payWay: {
            id: '',
            name: ''
        },
        // 用券
        coupons: {
            id: '',
            name: ''
        },
        // 目前已选的收获地址id
        selectedAddressId: ''
    },

    // query参数
    query: {
        skuIds: [],
        counts: []
    },

    // 离开页面时间
    enterTime: 0,

    // 提交订单的数据结构
    orderData: {
        // 收件人
        receivers: [],
        // 商品列表
        items: [],
        // 发票信息
        invoiceInfo: {
            id: '',
            type: ''
        },
        // 是否开票
        isInvoice: '0',
        // 当前订单状态
        state: '',
        // 支付方式
        type: '',
        // 来源
        source: ''
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Common.isIPhoneX', v => {
             // 兼容iponeX
            this.setData!({
                isIPhoneX: v
            }) 
        });
    },

    runComputed() {
        computed(this, {

        });
    },

    // 选择支付方式回调
    onPickPay(e) {
        const res = this.data.payMethods.filter((v, i) => i === Number(e.detail.value));
        res.length > 0 && this.setData!({
            payWay: res[0]
        })
    },

    /** 打开优惠券选择页面 */
    open() {
        const this_: any = this;
        const pop = this_.selectComponent('#coupon');
        pop.open();
    },

    // 地址选择回调
    onAddressChange(data) {
        (this.orderData as any).receivers = [data.detail];
        
        // 如果未选择开票信息，则把收款地址默认为开票地址
        if ( !this.orderData.invoiceInfo.type ) {
            this.setData!({
                selectedAddressId: data.detail.id
            });
        }
    },

    // 选择优惠券回调
    onPickCoupon({ detail }) {
        const { skuIds, counts } = this.query;
        this.computePrice(skuIds.map((item, index) => {
            return {
                skuCode: item,
                qty: counts[index] || 0,
                couponIds: detail.map(v => v.id)
            }
        }));
    },

    // 跳转至订单开票
    navToInvoice() {
        navTo('/pages/invoice-create/index');
    },

    // 校验请求参数
    checkSubmitParams() {
        if (this.orderData.receivers.length === 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入收货地址',
                mask: true
            });
            return false;
        } else if (!this.orderData.invoiceInfo.type) {
            wx.showToast({
                icon: 'none',
                title: '请完善发票信息',
                mask: true
            });
            return false;
        } else if (!this.data.payWay.id) {
            wx.showToast({
                icon: 'none',
                title: '请输选择支付方式',
                mask: true
            });
            return false;
        }
        return true;
    },
    // 提交订单
    async onSubmitOrder(e) {
        if (!this.checkSubmitParams()) {
            return;
        }
        const { skuIds, counts } = this.query;
        await this.computePrice(skuIds.map((item, index) => {
            return {
                skuCode: item,
                qty: counts[index] || 0,
                couponIds: (this.orderData.items[0] as any).couponIds
            }
        }));
        this.orderData.state = 'WAIT_PAY';
        this.orderData.type = this.data.payWay.id;
        this.orderData.source = 'SYS';
        this.orderData.isInvoice = this.orderData.invoiceInfo.type !== 'NO_TICKETS' ? '1' : '0';
        console.log('提交参数', this.orderData);
        this.generateOrder(this.orderData);

    },

    onLoad(q: any) {
        this.watchApp( );
        // 增加防抖动
        (this.onSubmitOrder as any) = debounce(this.onSubmitOrder , 500);
        const { skuIds, counts } = q;
        (this as any).query = {
            skuIds: decodeURIComponent(skuIds).split(','),
            counts: decodeURIComponent(counts).split(',')
        }
        // this.watchApp();
        this.computePrice(this.query.skuIds.map((item, index) => {
            return {
                skuCode: item,
                qty: this.query.counts[index] || 0,
                couponIds: []
            }
        }));
        Promise.all(this.query.skuIds.map((items, index) => {
            return this.getDetailBySku(items);
        })).then(data => {

            this.setData!({
                goodsItems: data.map((v, i) => {
                    return {
                        image: v.bannerImgs[0],
                        name: v.title,
                        desc: v.description,
                        price: v.price.toFixed(2),
                        count: this.query.counts[i],
                        unit: v.unit
                    }
                }),
                sku: {
                    num: this.query.counts[0],
                    skuCode: this.query.skuIds[0]
                }
            })
        });
    },

    onShow() {
        this.setData!({
            refresh: (Math.random() * 9999).toFixed(0)
        });
        this.enterTime = new Date().getTime();
    },

    onHide() {
        // 填写订单PV埋点
        app.dataBury$([{
            "$code": "fillOrder",
            "$ts": this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
        this.enterTime = 0;
    },

    // 微信预支付
    wxPay(data, orderNo) {
        http({
            method: 'POST',
            path: '/apis/wxPay/prepay',
            data,
            errMsg: '支付出错啦 ～'
        }).then((val) => {

            if (val.status !== 200) {
                return;
            }
            // 修改订单状态
            const changeState = (data) => {
                http({
                    method: 'PUT',
                    errMsg: 'none',
                    path: `/apis/order/frontend_confirm/${data.out_trade_no}`,
                }).then(( ) => {
                    wx.redirectTo({
                        url: `/pages/order-detail/index?no=${orderNo}`,
                    });
                });
            };
            // 实际支付金额为0的情况
            data.total_fee === 0 && changeState(data);
             // 实际支付金额不为0的情况
            data.total_fee > 0 && wx.requestPayment(Object.assign(val.data, {
                success: function (res) {
                    changeState(data);
                }, fail: function (res) {
                    // http({
                    //     method: 'PUT',
                    //     path: `/apis/order/set_wait_pay/${data.out_trade_no}`,
                    //     errMsg: '重置订单状态失败～'
                    // }).then(value => {
                    //     if(value.status !== 200){
                    //         return ;
                    //     }
                    //     wx.redirectTo({
                    //         url: `/pages/order-detail/index?no=${orderNo}`,
                    //     })
                    // })
                    wx.redirectTo({
                        url: `/pages/order-detail/index?no=${orderNo}`,
                    })
                }
            }))
        }).catch(e => {
            console.error('出错了33:', e);
        })
    },

    // 根据skuid获取商品详情
    getDetailBySku(id) {
        return http({
            method: 'get',
            path: `/apis/goods/sku/detail/${id}`
        }).then(val => {
            return val.data;
        })
    },

    // 计算实际结算价格
    async computePrice(items) {
        const dedupKey = await getUuid();
        http({
            method: 'post',
            path: `/apis/goods/price`,
            data: {
                couponIds: [],
                dedupKey: dedupKey.data,
                isFreeShipping: 1,
                items
            }
        }).then(val => {
            if (val.status === 200)
                console.log('计算后的价格', val.data);
            this.setData!({
                orderPrice: {
                    actPrice: String(val.data.actPrice),
                    discountPrice: String(val.data.discountPrice)
                }
            });
            this.orderData = Object.assign({}, val.data, this.orderData.state, {
                receivers: this.orderData.receivers,
                invoiceInfo: this.orderData.invoiceInfo
            });
        })
    },

    // 生成订单
    generateOrder(data) {
        http({
            method: 'post',
            path: `/apis/order/generate`,
            data
        }).then(val => {
            if (val.status !== 200) {
                wx.showToast({
                    icon: 'none',
                    title: '请求错误，请重试',
                    mask: true
                });
                return;
            }
            // friday提交订单上报
            app.dataBury$([{
                "$code": "submitOrder",
                "$ts": new Date().getTime(),
                "orderNo": val.data.orderNo
            }]);
            console.log('生成订单了', val.data);
            this.data.payWay.id === 'OFFLINE_PAY' && wx.redirectTo({
                url: `/pages/pay-res/index?state=WAIT_REMIT&no=${val.data.orderNo}`,
              })
            this.data.payWay.id === 'ONLINE_PAY' && this.wxPay({
                out_trade_no: val.data.id,  // 订单id
                // TODO: 此处测试支付，暂时定为一分钱(正式环境后端控制，不影响)
                total_fee: val.data.actPrice * 100,   // 总价格
                spbill_create_ip: '127.0.0.1',
                openid: store$.Auth.openid,
                body: '支付商品'
            },val.data.orderNo);
        })
    },

    onUnload() {
        console.log('离开了');
    },


    onInvoiceChange({ detail }) {
        console.log('变化', detail);
        (this.orderData as any).invoiceInfo = Object.assign({}, detail, { ...detail.addressDetail });
        delete (this.orderData.invoiceInfo as any).addressDetail;
        this.setData!({
            selectedAddressId: ''
        });
    }
})
