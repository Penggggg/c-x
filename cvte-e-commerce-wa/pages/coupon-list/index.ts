import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { couponToFront } from '../../utils/util';

const app = getApp< IApp >( );

Page({

    data: {

        // 指定一个tabs的key
        current: '1',

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

        // tab
        tabs: [
            {
                key: '1',
                label: '未使用',
            }, {
                key: '2',
                label: '已使用',
            }, {
                key: '4',
                label: '已过期',
            }
        ],

        queryCode: {
            '0': {
                code: '0',
                mean: '已发放'
            }, 
            '1': {
                code: '1',
                mean: '已领用'
            },
            '2': {
                code: '2',
                mean: '已使用'
            },
            '3': {
                code: '3',
                mean: '已退还'
            },
            '4': {
                code: '4',
                mean: '已过期'
            }
        }

    },

    runComputed( ) {
        computed( this, {

        }); 
    },

    /** 获取优惠券列表 */
    fetchCoupons( ) {
        const { current, queryCode } = this.data;
        const { code } = queryCode[ current ];

        return http({
            path: `/apis/coupons/my-list?status=${code}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.setData!({
                coupons: data ? data.map( couponToFront ) : [ ]
            });
        });
    },

    /** 点击切换 */
    onTabChange({ detail }) {
        this.setData!({
            current: detail
        });
        this.fetchCoupons( );
    },

    onLoad( ) {
        this.fetchCoupons( );
    },

    onShow( ) {

    }
})
