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
        /**
         * sku展示队列 
         * {
         *      id,
         *      canSelect是否能选、
         *      title名称
         *      price价格
         *      fadePrice下划线价格
         *      stock库存   
         *      pid产品id
         *      sid型号id
         *      img图片
         *      limit限购数量
         *      count已选数量
         * }
         */
        skus: {
            type: Array,
            value: [ ],
            observer: 'initSelectedSku' 
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        isIPhoneX: false,

        /** 选中的sku */
        selectedSku: null,

        /** 是否展开 */
        open: false,

        /** 动画1 */
        animationSku: null,

        /** 动画2 */
        animationSkuBg: null,

        /** 授权状态 */
        isUserAuth: false,

        /** 数组 */
        selectdSkuCount: 1

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听用户授权情况 */
        checkAuth( ) {
            const this_: any = this;
            app.watch$('Auth.isUserAuth', val => {
                if ( val === undefined ) { return; }
                this_.setData({
                    isUserAuth: val
                });
            });
        },

        /** 获取用户授权 */
        getUserAuth( ) {
            const this_: any = this;
            app.store
                .Auth.getUserAuth( )
                .then(( ) => {
                    this_.confirmSelect( );
                });
        },

        /** 获取电话授权 */
        getPhoneAuth( e ) {
            app.store.Auth.getUserPhoneAndRegister( e )
                .then( data => console.log( '...', data ));
        },

        /** 初始化sku，排第一位的会被默认选中 */
        initSelectedSku( ) {

            const this_: any = this;
            const { skus } = this_.data;
            console.log('我的sku', skus);
            if ( !skus || skus.length === 0 ) { return; }

            // 找到当前可选的sku并默认选择
            const defaultSkuIndex = skus.findIndex( x => !!x.canSelect );

            if ( defaultSkuIndex !== -1 ) {
                const defaultSku = skus[ defaultSkuIndex ];

                this_.setData({
                    selectedSku: defaultSku
                })
                console.log('我的skussssss', this_.data.selectedSku);
                if ( defaultSku.count ) {
                    this_.setData({
                        selectdSkuCount: defaultSku.count
                    });
                }
                this_.triggerEvent('change', defaultSku );
            }

            
        },

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

        /** 预览图片 */
        previewImg({ currentTarget }: any) {
            const img = currentTarget.dataset.img;
            wx.previewImage({
                current: img,
                urls: [ img ]
            });
        },

        /** 选择 sku */
        onSelectSku({ currentTarget }: any) {
            const this_: any = this;
            const tappingSku = currentTarget.dataset.standard;
            if ( !tappingSku.canSelect ) { return; }
            this_.setData({
                selectdSkuCount: 1,
                selectedSku: tappingSku
            });
            this_.triggerEvent('change', tappingSku );
        },

        /** sku 数量 */
        onSkuCount({ detail }: any) {
            const this_: any = this;
            this_.setData({
                selectdSkuCount: detail.number
            });
        },

        /** 确认 */
        confirmSelect( e: any ) {
            const this_: any = this;
            const { selectedSku, selectdSkuCount } = this_.data;
            this_.triggerEvent('confirm', {
                sku: {
                    ...selectedSku,
                    count$: selectdSkuCount
                },
            });
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
        },
        
    },

    attached: function( ) {
        this.watchApp( );
        this.checkAuth( )
    }
})
  