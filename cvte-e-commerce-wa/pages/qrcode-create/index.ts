import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { cloudHttp } from '../../utils/cloudHttp';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({

    data: {

        // 二维码页面参数
        p: '',

        // 二维码页面参数
        s: '',

        // 二维码超时
        timeout: 0,

        // 加载
        preLoading: true,

        // 二维码加载
        qrLoading: true
    },

    runComputed( ) {
        computed( this, {

        }); 
    },

    // 调取分享数据统计接口
    fetchAnaly( ) {
        http({
            path: `/apis/partner/share-url`
        }).then( res => {

            const { data, status } = res;
            if ( status !== 200 ) { return; }

            const { s } = this.data;
            const analyQuery = data.split('?')[ 1 ];
            this.setData!({
                s: s ? `${s}&${analyQuery}` : analyQuery
            })
            setTimeout(( ) => {
                this.setData!({
                    preLoading: false,
                })
            }, 50 );
        });
    },

    /** 二维码准备好 */
    isLoad({ detail }) {
        this.setData!({
            qrLoading: false
        });
    },

    onLoad( options: any ) {
        const { p, s } = options;
        this.setData!({
            s: s ? decodeURIComponent( s ) : '',
            p: p ? decodeURIComponent( p ) : 'pages/index/index',
            // timeout: new Date( Date.now( ) + 1 * 60 * 1000 ).getTime( )
            timeout: 0
        });

        setTimeout(( ) => {
            this.fetchAnaly( );
        }, 50 );
    },

    onShow( ) {

    }
})
