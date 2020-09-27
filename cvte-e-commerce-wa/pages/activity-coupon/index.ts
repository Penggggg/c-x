import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { queryParse, couponToFront } from '../../utils/util';

const app = getApp< IApp >( );

Page({

    data: {

        /** 环境 调试用的 */
        env: '',

        /** 初始化 */
        inited: false,

        /** 活动id */
        acId: '',

        /** 活动详情 */
        detail: { },

        /** 优惠券 */
        coupons: [ ]

    },

    runComputed( ) {
        computed( this, {

            coupons$: function( ) {
                const { coupons } = this.data;
                return coupons.map( x => couponToFront( x, { used: false }))
            }

        }); 
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Auth.sysUserInfo', v => {
            const { acId } = this.data;
            if ( !!v ) {
                this.fetchCoupon( acId );
                this.fetchActivity( acId );
                this.setData!({
                    inited: true
                });
            }
        });
    },

    /** 获取活动信息 */
    fetchActivity( acId ) {
        const { env } = this.data;
        if ( !acId ) { return; }
        http({
            env,
            path: `/apis/activity/detail/${acId}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.setData!({
                detail: data
            });
        });
    },

    /** 获取活动优惠券 */
    fetchCoupon( acId ) {
        const { env } = this.data;
        if ( !acId ) { return; }
        http({
            env,
            loadingMsg: 'none',
            path: `/apis/activity/counpon/${acId}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.setData!({
                coupons: data || [ ]
            });
        });
    },

    /** 领券 */
    getCoupon( ) {
        const { acId, coupons, env } = this.data;

        /** 如果未注册，则跳到注册页面 */
        if ( !app.store.Auth.sysUserInfo.id ) {
            return navTo('/pages/login/index');
        }

        http({
            env,
            method: 'POST',
            path: `/apis/coupons/batch_receive`,
            data: coupons.map(( x: any ) => ({
                channel: '小程序',
                couponTemplateId: x.id,
                receiveNum: 1,
                sourceId: acId,
                sourceType: '1'
            }))
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            wx.showToast({
                title: '领取成功'
            });
            navTo('/pages/main-page/index');
        });
    },

    /**
     * @description
     * 此页面为活动领取页面 
     * 
     * 通过二维码，进入此页面，请传以下参数
     * 二维码s: encodeURIComponent("a=activityId&f=any")
     * 其中：
     *   a为活动id
     *   f为此页面来源，用于统计，可无
     *   e为指定的请求环境，可无
     */
    onLoad( query: any ) {
        const _query = queryParse( decodeURIComponent( query.s || '' ) || 'a=84aed1&f=code')
        const { a, f, e } = _query;

        console.log('!!!扫码进来啦！', query );
        console.log('!!!_query', _query );

        this.watchApp( );
        this.runComputed( );
        !!a && this.setData!({
            env: e || '',
            acId: a
        });        
    },

    onShow( ) {
        const { acId, inited } = this.data;
        if ( !!inited ) {
            this.fetchCoupon( acId );
            this.fetchActivity( acId );
        }
    }
})
