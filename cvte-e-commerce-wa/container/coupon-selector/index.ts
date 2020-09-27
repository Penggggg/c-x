import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { couponToFront } from '../../utils/util';

/**
 * @description
 * sku的优惠券选择器
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        /** 最多可选优惠券数量 */
        max: {
            type: Number,
            value: 1
        },

        /** 
         * sku列表
         * {
         *      num: number,
         *      skuId: string
         * }[ ]
         */
        skuList: {
            type: Array,
            value: [ ],
            observer: 'fetchSkuListCoupons'
        },

        /**
         * 单个sku
         * {
         *      num: number,
         *      skuCode: string
         * }
         */
        sku: {
            type: Object,
            value: { },
            observer: 'fetchSkuItemCoupons'
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        // 优惠券列表
        coupons: [ ],

        // 已选
        checkList: [ ]

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        runComputed( ) {
            computed( this, {

                // 优惠券
                coupons$: function( ) {
                    const this_: any = this;
                    const { coupons, checkList } = this_.data;
                    return coupons.map( c => {
                        return {
                            ...c,
                            checked$: checkList.find( x => x.id === c.id )
                        };
                    });
                }
            });
        },

        /** 打开 */
        open( ) {
            const this_: any = this;
            const pop = this_.selectComponent('#pop');
            pop.open( );
        },

        /** 关闭 */
        close( ) {
            const this_: any = this;
            const pop = this_.selectComponent('#pop');
            pop.close( );
        },

        /** 根据sku列表获取优惠券列表 */
        fetchSkuListCoupons( skuList ) {

            if ( !skuList || skuList.length === 0 ) { return; }

            const this_: any = this;
            return http({
                method: 'POST',
                path: `/apis/coupons/order-sku`,
                data: {
                    skuList
                }
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this_.setData({
                    coupons: data ? data.map( couponToFront ) : [ ]
                });
            });
        },

        /** 根据单个sku获取优惠券列表 */
        fetchSkuItemCoupons( sku ) {
            const this_: any = this;
            const { skuCode, num } = sku;
            if ( !skuCode || num === 0 ) { return; }
            
            return http({
                path: `/apis/coupons/by-sku?skuCode=${skuCode}&num=${num}`,
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const meta = data ? data.map( couponToFront ) : [ ]
                const checkList = meta.filter(  x => !!x.isDefault );

                this_.setData({
                    checkList,
                    coupons: meta
                });
                this_.triggerEvent('change', checkList );
            });
        },

        /** 消息弹框 */
        toast( title ) {
            wx.showToast({
                title,
                icon: 'none'
            });
        },

        /** 
         * 选择优惠券
         * 
         * max = 1的时候为单选模式
         * max > 1 为多选，且最大可选为max
         */
        onSelect({ currentTarget }) {
            const this_: any = this;
            const { max } = this_.data;
            let checkList: any = [ ...this_.data.checkList ];

            const item = currentTarget.dataset.data;
            const { id, used, passed } = currentTarget.dataset.data;

            if ( passed || used ) { return; }

            if ( max === 0 ) { return; }

            if ( max === 1 ) {
                
                if ( checkList.find( x => x.id === id )) {
                    checkList = [ ];
                } else {
                    checkList = [ item ];
                }

            } else {

                if ( !checkList.find( x => x.id === id )) {

                    // 添加的时候，要看看是否到了上限
                    if ( checkList.length < max ) {
                        checkList.push( item );
                    } else {
                        this.toast(`只能选择${max}张优惠券`)
                    }
    
                } else {
                    const index = checkList.findIndex( x => x.id === id );
                    checkList.splice( index, 1 );
                }
            }

            this_.setData({
                checkList: [ ...checkList ]
            });
            this_.triggerEvent('change', checkList );
        },

        /** 确定 */
        onComfirm( ) {
            const this_: any = this;
            const { checkList } = this_.data;
            this_.triggerEvent('confirm', checkList );
            this_.close( );
        },

        /** 跳往说明 */
        go( ) {
            navTo('/pages/coupon-tips/index')
        }
    },

    attached: function( ) {
        this.runComputed( );
    }
})
  