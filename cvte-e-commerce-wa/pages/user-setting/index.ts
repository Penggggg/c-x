import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({

    data: {
        
        settingList: [
            {
                label: '用户协议',
                path: '/pages/agreement/index?p=userReg'
            },
            {
                label: '会员&积分',
                path: '/pages/agreement/index?p=member'
            }, 
            {
                label: '售后服务',
                path: '/pages/agreement/index?p=afterSale'
            }, 
            {
                label: '隐私政策',
                path: '/pages/agreement/index?p=privacy'
            }, 
            {
                label: '优惠券说明',
                path: '/pages/agreement/index?p=coupon'
            }, 
        ]

    },

    runComputed( ) {
        computed( this, {


        }); 
    },

    go({ currentTarget }) {
        const { data } = currentTarget.dataset;
        navTo( data.path );
    },

    onLoad( ) {

    },

    onShow( ) {

    }
})
