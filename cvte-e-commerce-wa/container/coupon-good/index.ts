import { IApp } from "../../global";
import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { cloudHttp } from '../../utils/cloudHttp';
import { computed } from '../../lib/vuefy/index.js';

const app = getApp< IApp >( );

/**
 * @description
 * 商品详情的卡券展示器
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * coupon展示队列 
         * {
         *      id,
         *      type 券类型
         *      typeLabel 券类型中文
         *      discountType 优惠类型
         *      value 优惠价格/折扣
         *      used 是否能用、
         *      passed 是否过期
         *      tips 小文案提示 逗号隔开
         *      title 标题
         *      start 有效期 开始时间
         *      end 有效期 结束时间
         *      useTips 使用说明
         *      
         * }[ ]
         */
        coupons: {
            type: Array,
            value: [ ]
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        isIPhoneX: false,

        /** 是否展开 */
        open: false,

        /** 动画1 */
        animationSku: null,

        /** 动画2 */
        animationSkuBg: null,

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        /** 关闭弹窗 */
        close( ) {
            const this_ = (this as any);
            this_.triggerEvent('toggle', false );
            this_.setData({
                open: false
            });

            this.setAnimate( );
        },

        /** 外部调用：展开 */
        open( ) {
            const this_ = (this as any);
            const { open } = this_.data;

            this_.setData({
                open: true
            });

            this.setAnimate( );
        },

        /** 动画 */
        setAnimate( ) {
            const this_ = (this as any);
            const { open, isIPhoneX } = this_.data;

            const animationSkuMeta: any = wx.createAnimation({ 
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });

            const animationSkuBgMeta: any = wx.createAnimation({ 
                duration: 250, 
                timingFunction: 'ease-out', 
                transformOrigin: '50% 50%',
            });

            if ( open ) {
                const height = isIPhoneX ? '-62vh' : '-60vh';
                animationSkuMeta.opacity( 0.3 ).translateY( height ).opacity( 1 ).step( );
                animationSkuBgMeta.opacity( 1 ).step( );
            } else {
                animationSkuMeta.opacity( 0.5 ).translateY( '60vh' ).opacity( 0 ).step( );
                animationSkuBgMeta.opacity( 0 ).step( );
            }

            this_.setData({
                animationSku: animationSkuMeta.export( ),
                animationSkuBg: animationSkuBgMeta.export( )
            })

        },

        /** 禁止滑动 */
        preventTouchMove( ) {

        },

        /** 确认 */
        confirmSelect( e: any ) {
            const this_: any = this;
            this_.close( );
        },

        /** 监听 */
        watchApp( ) {
            app.watch$('Common.isIPhoneX', v => {
                // 兼容iponeX
                (this as any).setData!({
                    isIPhoneX: v
                }) 
            });
        }
        
    },

    attached: function( ) {
        this.watchApp( );
    }
})
  