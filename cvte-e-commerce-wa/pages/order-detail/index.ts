import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { debounce } from '../../utils/util';
import { store$ } from '../../store/index';
import { OrderStateCN, OrderPayTypeCN, OrderState, InvoiceChoiceTypeCN, InvoiceTypeCN,
    OnlinePayDeadLine, OfflinePayDeadLine, OrderPayType } from '../../utils/constant';

const app = getApp< IApp >( );

Page({
    data: {

        // 订单号
        no: '',

        showInvoice: '0',

        // 订单详情数据
        od: {
            id: ''
         },

        // 加载中
        loading: true,

        // 支付倒计时
        countdown: 0,

        enterTime: 0
    },

    runComputed( ) {
        computed( this, {
            od$: function( ) {
                const { od, loading } = this.data;
                const { placeOrderTime, type, state, payTime, invoiceInfo } = od;

                if ( loading ) {
                    return { };
                }

                const format = dd => {
                    const time = new Date( dd );
                    const y = time.getFullYear( );
                    const m = time.getMonth( ) + 1;
                    const d = time.getDate( );
                    const h = time.getHours( );
                    const mm = time.getMinutes( );
                    return `${y}-${m}-${d} ${h}:${mm}`;
                }

                // 开票信息
                let invoiceInfo$ = { };
                if ( !!invoiceInfo && Object.keys( invoiceInfo ).length > 0 ) {
                    const { type, invoiceType, invoiceTitle, taxNo, enterpriseTelephone,
                        bankAccount, openingBank, enterpriseAddress } = invoiceInfo;
                    invoiceInfo$ = {
                        ...invoiceInfo,
                        taxNo,
                        bankAccount,
                        openingBank,
                        invoiceTitle,
                        enterpriseAddress,
                        enterpriseTelephone,
                        type: InvoiceChoiceTypeCN[ type ],
                        invoiceType: InvoiceTypeCN[ invoiceType ] || '',
                    };
                }

                const meta = {
                    ...od,
                    // 开票信息
                    invoiceInfo$,
                    // 订单状态
                    state$: OrderStateCN[ state ],
                    // 订单方式
                    type$: OrderPayTypeCN[ type ],
                    // 订单创建时间
                    createTime$: format( placeOrderTime ),
                    // 支付时间
                    payTime$: payTime ? 
                        format( payTime ) :
                        '暂未支付',
                    // 订单sku
                    items$: !od.items ? [ ] :
                        od.items.map( i => ({
                            image: i.skuImgs,
                            name: i.skuName || '',
                            desc: i.skuDesc || '',
                            price: i.oriPrice.toFixed( 2 ),
                            count: i.qty
                        }))
                };
                console.log( '......', meta );
                return meta;
            }
        });
    },

    // 获取订单详情
    getOrderDetail( no ) {
        if ( !no ) { return; }
        http({
            method: 'get',
            path: `/apis/order/detail/${no}`
        }).then( res => {

            const { status, data } = res;
            if( status !== 200 ) return;
    
            this.dealState( data );
            this.setData!({
                od: data,
                loading: false
            });
        })
    },

    // 处理订单状态
    dealState( orderDetail ) {
        let  countdown = 0;
        const { placeOrderTime, state, type } = orderDetail;

        // 处理支付倒计时
        const createOrderTime = new Date( placeOrderTime ).getTime( );
                const dealLineTS = type === OrderPayType.ONLINE_PAY ?
                    createOrderTime + OnlinePayDeadLine :
                    createOrderTime + OfflinePayDeadLine;

        if ( (state === OrderState.WAIT_PAY || state === OrderState.PAY_APPROVAL) && dealLineTS > Date.now( )) {
            countdown = Number(
                ((dealLineTS - Date.now( )) / 1000).toFixed( 0 )
            );
        }

        this.setData!({
            countdown
        });
    },

    /** 取消订单 */
    onCancel( ) {
        app.dataBury$([{
            "$code":"cancelOrder",
            "$ts":new Date().getTime(),
            "goodsId":this.data.od.id
        }]);
        const id = '';
        http({
            method: 'put',
            path: `/apis/order/${this.data.od.id}/cancel`,
        }).then(val => {
            if(val.status !== 200){
                return ;
            }
            wx.showToast({
                title: '取消成功'
            });
            wx.redirectTo({
                url: '/pages/order-list/index?state=ALL'
            });
        })
    },

    /** 展示开票信息 */
    onShowInvoice( ) {
        const { no, od } = (this as any).data;
        if ( !od.invoiceInfo ) { return; }
        navTo(`/pages/order-detail/index?si=1&no=${no}`);
    },

    /** 订单支付 */
    onPay( ) {
        const this_: any = this;
        const item = this_.data.od;
        app.dataBury$([{
            "$code":"gotoPay",
            "$ts":new Date().getTime(),
            "goodsId": item.id
        }]);
        if(this.data.countdown<=0) {
            wx.showToast({
                icon: 'none',
                title: '订单已过期～'
            });
            return;
        }
        console.log('我要支付', item);
        item.type === 'OFFLINE_PAY' &&  navTo(`/pages/pay-res/index?state=WAIT_REMIT&no=${item.orderNo}`)
        // wx.redirectTo({
        //     url: `/pages/pay-res/index?state=WAIT_REMIT&no=${item.orderNo}`
        // })
       
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
            console.error('出错了44:', e);
        })
    },

    /** 联系客服 */
    onCall( ) {
        wx.makePhoneCall({
            phoneNumber: app.store.Common.customerService
        })
    },

    /** 复制 */
    onCopy({ currentTarget }) {
        const { clipboard } = currentTarget.dataset;
        !!clipboard && wx.setClipboardData({
            data: clipboard
        });
    },

    onLoad( q: any ) {
        // 增加防抖函数
        this.onPay = debounce(this.onPay , 500);
        this.onCancel = debounce(this.onCancel , 500);
        const { si, no } = q;
        this.getOrderDetail( no );
        this.runComputed( );

        this.setData!({
            no
        });

        if ( !!si ) {
            this.setData!({
                showInvoice: si
            });
        }

    },

    onShow( ) {
        this.setData!({
            enterTime: Date.now( )
        })
    },

    onHide( ) {
        const { enterTime } = this.data;
        // 订单详情PV埋点
        app.dataBury$([{
            "$code": "selectBecomePartner" ,
            "$ts": enterTime,
            "enterTime": enterTime,
            "leaveTime": Date.now( )
        }]);
        this.setData!({
            enterTime: 0
        });
    }
})