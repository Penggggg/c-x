import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({

    data: {
        phone: ''
    },

    /** 监听 */
    watchApp( ) {
        const this_:any = this;
        app.watch$('Common.customerService', phone => {
            !!phone && this_.setData!({
                phone
            });
        });
    },

    runComputed( ) {
        computed( this, {

        }); 
    },

    onLoad( ) {
        this.watchApp( );
    },

    onShow( ) {

    }
})
