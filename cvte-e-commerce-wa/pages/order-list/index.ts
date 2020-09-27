import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { OrderStateCN } from '../../utils/constant';
import { formatTime, debounce } from '../../utils/util';

const app = getApp<IApp>();

Page({
    data: {
        // 当前的下标
        current: 0,
        tabs: [
            {
                key: 0,
                label: '待付款',
                type:'WAIT_PAY'
            }, {
                key: 1,
                label: '待审核',
                type: 'PAY_APPROVAL'
            }, {
                key: 2,
                label: '待发货',
                type: 'WAIT_DELIVER'
            },
            {
                key: 3,
                label: '待收货',
                type: 'WAIT_RECEIVR'
            },
             {
                key: 4,
                label: '全部',
                type: 'ALL'
            }
        ],
        emptyTest: {
            items: []
        },
        orderList: []
    },
    enterTime: 0,

    runComputed() {
        computed(this, {


        });
    },

    onTabChange({ detail }) {
        this.setData!({
            current: detail
        });
        this.getOrderListByState({ state: this.data.tabs[detail].type});
    },

    onLoad(q: any) {
        if (q.state) {
            const index = this.data.tabs.findIndex(i => i.type === q.state);
            index >= 0 && this.setData!({
                current: index
            });
            this.getOrderListByState({ state: q.state });
        }else {
            this.getOrderListByState({ state: this.data.tabs[0].type });
        }
    },

    onShow() {
        this.enterTime = new Date().getTime();
    },

    onHide() {
        // 订单列表PV埋点
        app.dataBury$([{
            "$code": "orderList",
            "$ts": this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime()
        }]);
        this.enterTime = 0;
    },

    // 根据订单状态获取订单列表
    getOrderListByState(params) {
        try {
            http({
                method: 'get',
                path: `/apis/order/order-list`,
                data: params.state === 'ALL' ?Object.assign(params,{state: ''}): params
            }).then(val => {
                if (val.status !== 200) {
                    return;
                }
                this.setData!({
                    orderList: val.data.list.map((v, i) => {
                        // (v.state === 'PAY_APPROVAL' && v.hasWaterList === '0') ? '待上传' :
                        console.log('啦啦啦啦啦',(v.state === 'PAY_APPROVAL' && v.hasWaterList === '0') );
                        return {
                            time: formatTime(new Date(v.placeOrderTime)),
                            orderNo: v.orderNo,
                            // id: v.orderNo,
                            id: v.id,
                            status: (v.state === 'PAY_APPROVAL' && v.hasWaterList === '0') ? '待上传':OrderStateCN[v.state] ,
                            state: v.state,
                            allPrice: v.actPrice.toFixed(2),
                            actPrice: v.actPrice,
                            items: v.items.map(k => {
                                return {
                                    image:k.skuImgs,
                                    name: k.skuName,
                                    desc: k.skuDesc,
                                    price: k.oriPrice.toFixed(2),
                                    count: k.qty
                                }
                            }),
                            type: v.type

                        }
                    }),
                });
            })
        } catch (error) {
            console.error('页面出错了', error);
        }
    }
})