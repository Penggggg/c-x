import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { debounce } from '../../utils/util.js';
import { computed } from '../../lib/vuefy/index.js';
import { store$ } from '../../store/index';


/**
 * @description
 * 菜品标签选择列表
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /** 详情 */
        detail: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {


    },

    /**
     * 组件的方法列表
     */
    methods: {
        onNavToDetail(e) {
            navTo(`/pages/order-detail/index?no=${e.currentTarget.dataset.orderno}`);
        }
        ,
        pay(e) {
            const this_: any = this;
            const item = this_.data.detail;
            console.log('我要支付', item);
            item.type === 'OFFLINE_PAY' && navTo(`/pages/pay-res/index?state=WAIT_REMIT&no=${item.orderNo}`)
            item.type === 'ONLINE_PAY' && this.wxPay({
                out_trade_no: item.id,  // 订单id
                // TODO: 此处测试支付，暂时定为一分钱(正式环境后端控制，不影响)
                total_fee: item.actPrice * 100,   // 总价格
                spbill_create_ip: '127.0.0.1',
                openid: store$.Auth.openid,
                body: '支付商品'
            },item.orderNo);
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
                wx.requestPayment(Object.assign(val.data, {
                    success: function (res) {
                        http({
                            method: 'PUT',
                            errMsg: 'none',
                            path: `/apis/order/frontend_confirm/${data.out_trade_no}`,
                        }).then(( ) => {
                            navTo(`/pages/order-detail/index?no=${orderNo}`);
                        });
                    }, fail: function (res) {
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none'
                        });
                    }
                }))
            }).catch(e => {
                console.error('出错了22:', e);
            })
        },
    },

    attached: function () {
        // 增加防抖动函数
        this.pay = debounce(this.pay, 500);

        console.log('数据',this.data.detail);
    },
    ready: function(){
    
    }
})
