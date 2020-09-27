<template>
    <window-title name="设备绑定" >

        <div class="p-bodysign-bind">
            <skt-list
                type="new"
                :loading="loading"
            >
                <div>

                    <ul class="device-list">
                        <li
                            :key="k"
                            class="device-item"
                            v-for="(item, k) in list$"
                            @click="onTabDevice( item )"
                        >
                            <div class="item-icon">
                                <svg class="my-icon big" aria-hidden="true">
                                    <use :xlink:href="item.icon"></use>
                                </svg>
                            </div>
                            <div class="item-info">
                                {{ item.detailCode }}
                            </div>
                        </li>
                    </ul>

                    <div
                        class="p-btn"
                        @click="onScan"
                    >
                        添加设备
                    </div>
                </div>
            </skt-list>
            
        </div>

    </window-title>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../components/window-title/index.vue';
import sktList from '../../../components/skeleton-list/index.vue';
import MyForm from '../../../components/my-form-v2/index.vue';


@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyForm,
        sktList,
        windowTitle
    }
})
export default class P extends Vue {

    /** dislog */
    private showDialog = false;

    /** load */
    private loading = true;

    /** 来源编码 */
    private sourceCode = '';

    /** 设备列表 */
    private list = [ ];

    /** 用户列表 */
    private users: any = [ ];

    get list$( ) {
        const { list } = this;
        return this.list.map( x => Object.assign({ }, x, {
            icon: '#icon-shouji',
        }));
    }

    /** 监听 */
    private watchMobx( ) {
        const { sc } = this.$route.params;
        observe( this.account$.wx, 'systemUser', change => {
            this.fetchHasBound( sc );
        });
        !!this.account$.wx.systemUser.id && this.fetchHasBound( sc );
    }

    /** 获取已经绑定过的设备 */
    private fetchHasBound( sc: string ) {

        this.loading = true;

        this.http$.get< any >({
            params: {
                sourceCode: sc,
                userId: this.account$.wx.systemUser.id
            },
            url: `/api/body-sign/bound-devices`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return }

            this.loading = false;
            this.list = data;
        });
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
            console.log('WXConfig', configObj);
            (window as any).wx.config( configObj );
            (window as any).wx.ready( function( ) {
                console.log('====wxinit====');
            });
        })
    }

    /** 点击设备列表选项 */
    private onTabDevice( item ) {
        this.$router.push(`/body-sign/device-bind?dn=${item.detailCode}&sc=${item.sourceId}&f=1`)
    }

    /** 点击设备列表选项 */
    private onScan( ) {
        /**
         * ! 版本2：调用微信扫一扫
         */
        (window as any).wx.scanQRCode({
            needResult:1,
            scanType: ["qrCode","barCode"],
            success:function (res) {
                window.location.href = res.resultStr;
            },
            error:function(res){
                alert( JSON.stringify(res))
                if( res.errMsg.indexOf('function_not_exist') > 0 ) {
                        alert('版本过低请升级');
                }
            }
        });
    }

    mounted( ) {
        this.watchMobx( );
        !this.$util.isIOS( ) && this.fetchWxInit( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

