<template>
    <div class="page-order-pay-preview my-page">

        <!-- 头部 -->
        <my-header
            :isfixed="true"
        >   
            <span
                slot="left"
                @click="onBack"
            >
                <mu-icon
                    size="25"
                    color="green"
                    value="keyboard_arrow_left"
                />
            </span>
            <span slot="center">
                    订单支付
            </span>
        </my-header>

        <!-- 过期信息 -->
        <div
            v-if="cannotPay"
            class="my-error-block"
        >
            <div class="icon-tips">
                i
            </div>
            <p class="tips-title">
                提示
            </p>
            <p class="tips">
                {{ tips }}
            </p>
        </div>
        
        <div v-if="!cannotPay">

            <!-- 文字提示 -->
            <div class="content-tips">
                剩余可支付时间
            </div>

            <!-- 倒计时 -->
            <div
                class="count-down-block"
            >
                <div class="count-down-item">{{ countDownText[ 0 ] }}</div>
                <div class="count-down-item">{{ countDownText[ 1 ] }}</div>
                <div class="count-down-dian">:</div>
                <div class="count-down-item">{{ countDownText[ 2 ] }}</div>
                <div class="count-down-item">{{ countDownText[ 3 ] }}</div>
            </div>

            <!-- 支付钱数 -->
            <div class="total-fee-block">
                <span class="total-fee-title">共需要支付</span>
                <span
                    v-if="detail"
                    class="total-fee-price"
                >¥{{ detail.price }}</span>
            </div>

            <!-- 支付按钮 -->
            <div class="pay-btn-block">
                <div
                    class="pay-btn"
                    @click="pay"
                >
                    {{ paying ? '支付中...' : '微信支付' }}
                </div>
            </div>

        </div>

        
    </div>
</template>
<script lang="ts">
import MyHeader from '../../../components/my-header/index.vue';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { setInterval, clearInterval } from 'timers';

/** 订单支付预览页面 */
@Component({
    components: {
        MyHeader
    }
})
export default class OrderPayPreview extends Vue {

    /** 支付中 */
    private paying = false;

    /** 是否已经超时/已经支付等原因，而不能进行支付 */
    private cannotPay = false;

    /** 提示 */
    private tips = ''

    /** 倒计时 - 分 */
    private minutes = 30;

    /** 倒计时 - 秒 */
    private second = 0;

    /** 订单创建时间 */
    private crtTime!: number;

    /** 订单详情 */
    private detail = null;

    /** 打开当前页面的瞬间 */
    private current = new Date( ).getTime( );

    get countDownText( ) {
        const Minutes = String( this.minutes ).length === 1 ? `0${this.minutes}` : String( this.minutes );
        const Seconds = String( this.second ).length === 1 ? `0${this.second}` : String( this.second );
        return [ Minutes[ 0 ], Minutes[ 1 ], Seconds[ 0 ], Seconds[ 1 ]];
    }

    /** 获取订单详情 */
    private fetchDetail( oid ) {
        this.http$.get({
            url: `/api/my-order/detail/${oid}`
        }, {
            loadMsg: '加载中...',
            errMsg: '获取订单错误，请重试'
        }).then(( res: any ) => {
            if ( res.status !== 200 ) { return;}

            this.crtTime = res.data.crtTime;
            this.detail = res.data;

            if ( res.data.appointStatus !== '1' ) { 
                this.cannotPay = true;
                const s = res.data.appointStatus;
                if ( s === '2' ) {
                    this.tips = '您已成功支付，请等待客服确认';
                } else if ( s === '3' ) {
                    this.tips = '您已成功预约，请勿重新支付';
                } else if ( s === '4' ) {
                    this.tips = '该订单已被取消';
                } else if ( s === '5' ) {
                    this.tips = '该订单已成功退款';
                } else if ( s === '6' ) {
                    this.tips = '该订单已过期，请重新下单支付';
                }

            } else if ( new Date( ).getTime( ) - res.data.crtTime > 30 * 60 * 1000 ) {
                this.cannotPay = true;
                this.tips = '订单已过期，请重新下单支付';

            } else {
                this.countDown( );
            }
        });
    }

    private countDown( ) {

        const clock = setInterval(( ) => {

            // 超出时间
            const exceed = new Date( ).getTime( ) - this.crtTime;

            if ( exceed >= 30 * 60 * 1000 ) {
                clearInterval( clock );
                return this.fetchDetail( this.$route.params.orderid );
            }

            // 剩余时间
            const surplus = 30 * 60 * 1000 - exceed;
            // 秒的余数
            const secondTimestamp = surplus % ( 60 * 1000 );
            
            this.minutes = Math.floor( surplus / ( 60 * 1000 ));
            this.second = Math.floor( secondTimestamp / 1000 );

        }, 500 );

    }

    private pay( ) {

        if ( this.paying || !this.detail ) { return; }
        this.paying = true;

        const orderId = this.$route.params.orderid;
        this.http$.get({
            url: `/api/booking/health-check/prepay/${orderId}`
        }).then(( res: any ) => {
        
            this.paying = false;
            if ( res.status !== 200 ) {
                this.$toast.message('生成支付错误，正在重试...');
            }

            // 发起微信支付
            (window as any).WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, res => {
                if ( res.err_msg === 'get_brand_wcpay_request:ok' ) {
                    // 刷新订单状态
                    this.http$.put({
                        url: `/api/booking/health-check/pay/${orderId}`
                    }).then( res => {
                        // 跳到订单列表
                        this.$router.replace(`${this.$route.query.next || '/my-order/list'}`);
                    });
                }
            })

        }).catch( e => {
            this.paying = false;
            this.$toast.error('网络错误，请重试')
        });
    }

    /** 返回按钮 */
    private onBack( ) {
        const pre = this.$route.query.pre;
        if ( !!pre ) {
            this.$router.push( pre );
        } else {
            this.$router.back( );
        }
    }

    mounted( ) {
        this.fetchDetail( this.$route.params.orderid );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

