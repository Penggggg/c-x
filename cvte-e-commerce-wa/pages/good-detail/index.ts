import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { couponToFront } from '../../utils/util';
import { StorageKey, InviteType } from '../../utils/constant';

const app = getApp< IApp >( );

/**
 * 商品详情
 */
Page({

    data: {

        /** 是否可以分享商品券 */
        canShareConpons: false,

        /** 商品id */
        id: '',

        /** 默认的skuid */
        skuid: '',

        /** 商品id */
        isIPhoneX: false,
        // isIPhoneX: app.store.Auth.isIPhoneX,
 
        /** 分享优惠券的参数 */
        shareCouponParams: '',

        /** 是否为市场拓展员 */
        isMarkerExpand: false,

        /** 是否为合伙人 */
        isDistributor: false,

        // 商品详情
        detail: null,

        // 大图
        banner: [ ],

        // sku
        skus: [
            // {
            //     id: '9999',
            //     canSelect: true,
            //     title: 'maxhub',
            //     price: 134,
            //     fadePrice: 345,
            //     stock: 5,
            //     pid: '111',
            //     sid: '9999',
            //     img: 'cloud://dev-cz0o8.6465-dev-cz0o8/good/test-good.png',
            //     limit: 2
            // }
        ],

        // 点击选中的sku，但未确定
        selectedSku: null,

        // 确定选择的sku
        comfirmSku: null,

        // 优惠券
        coupons: [
            // {
            //     id: '123',
            //     type: '',
            //     typeLabel: '会员券',
            //     discountType: '',
            //     value: 5123,
            //     used: false,
            //     tips: '满399元,减500元',
            //     title: 'CVTOUCH 会议平板指定优惠券',
            //     start: 1566996141811,
            //     end: 1566996141811,
            //     useTips: '使用说明：小程序专享，下单即可使用。'
            // }
        ],

        // 展示主页按钮
        showHome: false
    },

    enterTime: 0,

    runComputed( ) {
        computed( this, {

            /** 小优惠券 */
            smallCoupons$: function( ) {
                const { coupons } = this.data;
                
                const result = coupons.map(( c, k ) => {
                    const { fullReduceMinPrice, fullReduceNum } = c.meta;
                    let meta: any = {
                        bg: k % 2 === 1 ? '#444' : '',
                        label: c.smallTips
                    };
                    return meta;
                });
                return result;
            }

        }); 
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Auth.isMarkerExpand', v => {
            this.setData!({
                isMarkerExpand: v
            });
        });
        app.watch$('Auth.isDistributor', v => {
            this.setData!({
                isDistributor: v
            });
        });
        app.watch$('Auth.sysUserInfo', v => {
            !!v && this.fetchGood( );
        });
        app.watch$('Common.isIPhoneX', v => {
             // 兼容iponeX
            this.setData!({
                isIPhoneX: v
            }) 
        });
    },

    /** 拉取商品详情 */
    fetchGood( id? ) {
        const { skuid } = this.data;
        const gid = typeof id === 'string' ? id : this.data.id;
        http({
            path: `/apis/goods/detail/${gid}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            // 这里给skus重新排序
            let sortSku: any = [ ];
            const skus = data.skus;
            const targetSku = skus.find( x => x.id === skuid );
            const targetSkuIndex = skus.findIndex( x => x.id === skuid );

            if ( !!targetSku ) {
                skus.splice( targetSkuIndex, 1 );
                sortSku = [
                    targetSku,
                    ...skus
                ];
            } else {
                sortSku = [
                    ...skus.filter( x => Array.isArray( x.myCoupons ) && x.myCoupons.length > 0 ),
                    ...skus.filter( x => !( Array.isArray( x.myCoupons ) && x.myCoupons.length > 0 ))
                ]
            }

            this.setData!({
                detail: data,
                skus: sortSku
            });
            try {
                this.getUserCoupons(data.skuId);
                wx.stopPullDownRefresh({ });
            } catch ( e ) { }
        })
    },

    /** 获取创建分享优惠券的shareKey */
    fetchCouonShareKey( skuId ) {
        if ( !skuId ) { return; }
        http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: `/apis/partner/share-sku-url?skuId=${skuId}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            const shareCouponParams = data.split('?')[ 1 ];
            this.setData!({
                shareCouponParams
            });

        });
    },

    initShowHome( ) {
        this.setData!({
            showHome: getCurrentPages( ).length === 1
        })
    },

    /** 展示sku */
    onShowSku( ) {
        const this_: any = this;
        const detail: any = this.data.detail;
        const sku = this_.selectComponent('#sku');

        if ( !!detail && detail.disabled ) {
            return;
        }

        sku.open( );
    },

    /** 展示优惠券 */
    onShowCoupon( ) {
        const this_: any = this;
        const sku = this_.selectComponent('#coupon');
        sku.open( );
    },

    /** 点击选择sku */
    onChangeSku({ detail }) {
        const myCoupons = detail.myCoupons || [ ];

        // 优惠券切换，选取这个sku底下的优惠券
        this.setData!({
            selectedSku: detail,
            coupons: myCoupons.map( couponToFront ),
            banner: detail.bannerImgs
        });

        // 优惠券切换，重新获取shareKey
        this.fetchCouonShareKey( detail.id );
    },

    /** 预览图片 */
    previewImg({ currentTarget }: any ) {
        return; 
        const { img, imgs } = currentTarget.dataset;
        wx.previewImage({
            current: img,
            urls: imgs
        });
    },

    /** 确定选择sku，并进行购买 */
    onConfirmSku({ detail }) {
        const { sku } = detail;
        this.setData!({
            comfirmSku: sku
        });
        // // 埋点上报
        // app.dataBury$([{
        //     "$code":"shareApp",
        //     "$ts":new Date().getTime(),
        //     "goodsId": this.data.id
        // }]);

        // 如果未注册，则跳去注册
        if ( !app.store.Auth.sysUserInfo.id ) {
            navTo('/pages/login/index');

        } else {
            // 购买
            navTo(`/pages/fill-order/index?skuIds=${sku.id}&counts=${sku.count$}`)
        }

    },

    goHome( ) {
        wx.redirectTo({
            url: '/pages/main-page/index'
        });
    },

    onLoad( query: any ) {
        if(query.im){
            // 设置分享人和分享类型
            wx.setStorageSync( StorageKey.REGISTER_INVITER, query.im);
            wx.setStorageSync( StorageKey.REGISTER_INVITER_TYPE, InviteType.SHARE_GOODS);
        }
        this.setData!({
            skuid: query.skuid || '',
            id: query.id || query.skuid || 'good001'
        });
        this.watchApp( );
        this.runComputed( );
        this.initShowHome( );
    },

    onShow( ) {
        this.enterTime = new Date().getTime();
    },

    onHide( ) {
        app.dataBury$([{
            "$code": "orderDetailPage" ,
            "$ts":this.enterTime,
            "enterTime": this.enterTime,
            "leaveTime": new Date().getTime(),
            "goodsId": this.data.id
        }]);
    },

    onPullDownRefresh( ) {
        this.fetchGood( );
    },

    // 获取用户优惠券列表
    getUserCoupons(id){
        http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: `/apis/distributor/current_user_coupon?skuId=${id}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            data.length > 0 && this.setData!({
                canShareConpons: true
            });

        });
    },

    onShareAppMessage( e: any ) {
        const { type } = e.target.dataset;
        const { id, detail, selectedSku, shareCouponParams } = this.data;

        const mainImg = selectedSku.bannerImgs[ 0 ];

        // 插入当前分享人的id
        const memberId = app.store.Auth.sysUserInfo.id;
        
        // 埋点上报
        app.dataBury$([{
            "$code":"shareApp",
            "$ts":new Date().getTime(),
            "goodsId": id
        }]);

        let meta: any = {
            title: `${ selectedSku.title } ${ detail.title }`,
        };

        if ( mainImg.indexOf('cloud') !== 0 ) {
            meta = {
                ...meta,
                imageUrl: mainImg
            };
        }
 
        // 分享券
        if ( type === '1' && this.data.canShareConpons ) {
            return {
                ...meta,
                path: `/pages/receive-coupon/index?im=${memberId}&${shareCouponParams}`
            }
        // 分享链接
        } else {
            return {
                ...meta,
                path: `/pages/good-detail/index?id=${id}&im=${memberId}`
            }
        }
    }
})
