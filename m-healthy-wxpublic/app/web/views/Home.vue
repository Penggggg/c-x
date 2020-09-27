<template>
    <div class="home">
        <router-view />
    </div>
</template>

<script lang="ts">
/// <reference path="../global.d.ts" />
import MuseUI from 'muse-ui';
import Router from 'vue-router';
import { inject } from '../service/inject';
import { LoadingPlugin } from '../plugins/loading';
import { ToastPlugin } from '../plugins/toast';
import { HttpPluginV2 } from '../plugins/httpv2';
import { UtilPlugin } from '../plugins/util';
import { Component, Vue } from 'vue-property-decorator';
import Toast from 'muse-ui-toast';

Vue.use( MuseUI );
Vue.use( Router );
Vue.use( ToastPlugin );
Vue.use( HttpPluginV2 );
Vue.use( LoadingPlugin );
Vue.use( UtilPlugin );

@inject({
    selector: ['account$']
})
@Component({ })
export default class Home extends Vue {

    /** 拉取微信相关数据 */
    private fetchWxData( ) {
        this.account$.wx.getData( );
        this.account$.wx.getClientIp( );
    }

    /** 获取微信配置参数 */
    private fetchWxInit( ) {
        this.http$.get< any >({
            url: `/api/common/jssdk`,
            params: {
                url: (document as any).location.href,
                apilist: 'scanQRCode'
            }
        }).then( res => {
            const { data, status } = res;
            if ( status !== 200 ) { return; }
            const configObj = Object.assign({ }, data, {
                // appId: 'wxc01f1c65dc9635d0'
            });
            console.log((document as any).location.href)
            console.log('WXConfig', configObj);
            (window as any).wx.config( configObj );
            (window as any).wx.ready( function( ) {
                console.log('====wxinit====');
            });
        })
    }

    /** ios配置微信 */
    private initWxConfig( ) {
        !!this.$util.isIOS( ) && this.fetchWxInit( );
    }

    mounted( ) {
        this.fetchWxData( );
        this.initWxConfig( );
    }

}
</script>
<style lang="less">
/** loading */
.decorate-loading {
    left: 50% !important;
    top: 50% !important;
    width: 80px;
    height: 85px;
    border-radius: 10px;
    transform: translate(-50%,-50%);
}
/** 默认字号 */
input, textarea, .mu-input-label {
    font-size: 14px !important;
}
/** 页面 */
.my-page {
    // min-height: 100vh;
    padding-bottom: 30px;
    background: #fafafa;
    box-sizing: border-box;
}
/** 单选 */
.mu-radio-label {
    line-height: 20px;
}
/** 图标 */
.my-icon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
} 
@import '~muse-ui/dist/muse-ui.css';
@import '~muse-ui-loading/dist/muse-ui-loading.css';
</style>
