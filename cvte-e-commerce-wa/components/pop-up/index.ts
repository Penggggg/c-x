import { IApp } from "../../global";
import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { cloudHttp } from '../../utils/cloudHttp';
import { computed } from '../../lib/vuefy/index.js';

const app = getApp< IApp >( );

/**
 * @description
 * 菜品标签选择列表
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

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
                const height = isIPhoneX ? '-72vh' : '-70vh';
                animationSkuMeta.opacity( 0.3 ).translateY( height ).opacity( 1 ).step( );
                animationSkuBgMeta.opacity( 1 ).step( );
            } else {
                animationSkuMeta.opacity( 0.5 ).translateY( '70vh' ).opacity( 0 ).step( );
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
  