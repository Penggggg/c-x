import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({

    data: {

        skuList: [
            {
                num: 3,
                skuId: '2c9111926d15c64a016d15e67e140004'
            }
        ],

        skuItem: {
            num: 3,
            skuCode: '2c9ecb9a6d5cd7b8016d5db409790074'
        },

        refresh: '',

        searchUrl: `${config.host.default}/apis/common/company-check`

    },

    runComputed( ) {
        computed( this, {


        }); 
    },

    onCouponChange({ detail }) {
        console.log( detail );
    },

    /** 打开 */
    open( ) {
        const this_: any = this;
        const pop = this_.selectComponent('#coupon');
        pop.open( );
    },

    onLoad( ) {

    },

    onShow( ) {
        this.setData!({
            refresh: ( Math.random( ) * 9999).toFixed( 0 )
        })
    }
})
