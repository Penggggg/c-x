import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { addressToFront } from '../../utils/util';

const app = getApp< IApp >( );

Page({

    data: {

        isIPhoneX: false,

        // 加载
        loading: true,

        // 地址列表
        list: [ ],

        memberid: ''
    },

    runComputed( ) {
        computed( this, {


        }); 
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Auth.sysUserInfo', v => {
            !!v && this.fetchList( v.id );
            !!v && this.setData!({
                memberid: v.id
            });
        });

        app.watch$('Common.isIPhoneX', v => {
            // 兼容iponeX
           this.setData!({
               isIPhoneX: v
           }) 
       });
    },

    /** 拉取地址 */
    fetchList( mid? ) {
        const memberid = mid || this.data.memberid;

        if ( !memberid ) { return; }

        http({
            path: `/apis/address/my/${memberid}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
 
            this.setData!({
                loading: false,
                list: data ? data.map( addressToFront ) : [ ]
            });
        });
    },

    /** 创建 */
    go( ) {
        navTo('/pages/address-create/index');
    },

    onLoad( ) {
        this.watchApp( );
    },

    onShow( ) {
        this.fetchList( );
    }
})
