<template>
    <window-title name="设备绑定向导" >
        <div class="p-bodysign-bind-guide">

            <!-- <div class="text-line">
                <mu-icon
                    value="info"
                    color="blue"
                />
                <span>设备绑定说明</span>
            </div> -->

            <div class="content-block">
                
                <div class="title">
                    希科多体征设备绑定向导
                </div>

                <div>
                    尊敬的用户您好，您正在使用的是希科多体征视源健康定制版，本向导将指引您完成注册及绑定。
                </div>

                <div class="sub-title">
                    一、关注”视源健康”公众号成为视源健康用户
                </div>


                <div class="grey-title">
                    1. 关注公众号
                </div>

                <div>
                    长按“视源健康”公众号二维码关注公众号
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/qrcode.jpg"
                    />
                </div>

                <div class="grey-title">
                    2. 注册成为视源健康用户
                </div>

                <div>
                    点击用户绑定链接进行用户信息绑定，如果未在我司体检过用户请点击【注册新用户】
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-1.png"
                    />
                </div>

                <div class="sub-title">
                    二、设备绑定
                </div>

                <div class="grey-title">
                    1. 长按希科多体征下方按钮出示设备管理二维码
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-2.png"
                    />
                </div>

                <div class="grey-title">
                    2. 扫描二维码进入用户创建界面
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-3.png"
                    />
                </div>

                <div>
                    点击”添加设备用户”添加用户，添加完成之后重启希科多体征生效。
                </div>

                <div class="grey-title">
                    3. 绑定设备用户
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-4.png"
                    />
                </div>

                <div>
                    选择用户，点击“绑定用户”按钮，完成设备绑定。绑定之后可以在视源健康公众号收到测量通知，健康管理员可以同步知悉测量结果，以便及时进行健康干预。
                </div>

                <div class="sub-title">
                    二、用户关注
                </div>

                <div class="grey-title">
                    1. 长按希科多体征下方按钮出示设备管理二维码
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-2.png"
                    />
                </div>

                <div class="grey-title">
                    2. 扫描二维码进入用户关注页面
                </div>

                <div class="img-block">
                    <img
                        src="/public/img/guide-5.png"
                    />
                </div>

                <div>
                    选择用户，点击“关注用户”按钮，完成用户关注。关注之后可以在视源健康公众号收到亲人好友的测量通知，以便及时进行健康干预。
                </div>

            </div>

            <div class="action-block">
                <div>
                    <mu-checkbox
                        label="不再提醒"
                        :value="true"
                        v-model="check"
                    />
                </div>
                <div
                    class="p-btn"
                    @click="judgeGo"
                >
                    点击绑定设备
                </div>
            </div>

            <!-- 关注框 -->
            <div
                class="follow-block"
                v-if="showFollow"
            >
                <div class="title">
                    请先关注“视源健康”公众号后再进行绑定
                </div>

                <div class="btn-block">
                    <img
                        class="follow-img"
                        v-if="qrcodeTicket"
                        :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${qrcodeTicket}`"
                    />
                   
                </div>
                <div class='tips'>长按“视源健康”公众号二维码关注公众号</div>
                <div class="param">
                    关注公众号后您可以：
                </div>
                <div class="param">
                    1、设备多用户管理
                </div>
                <div class="param">
                    2、血压、血糖检查提醒
                </div>
                <div class="param">
                    3、享用视源健康慢病管理服务
                </div>
            </div>
            
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

    /** 是否已经注册过 */
    private isNew = true;

    /** 关注状态 */
    private check = false;

    /** 用户配置 */
    private userConfig: any = null;

     /** 二维码 */
    private qrcodeTicket = '';

    /** 展开关注框 */
    private showFollow = false;

    @Watch('check')
    onCheck( val ) {
        this.updateUserConf( val )
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
            });
            console.log('...', configObj );
            (window as any).wx.config( configObj );
            (window as any).wx.ready( function( ) {
                console.log('====wxinit ok ====');
            });
        })
    }

    /** 查询用户配置 */
    private fetchUserConf( openid ) {
        this.http$.get({
            params: {
                wxOpenId: openid
            },
            url: `/api/body-sign/user-config`
        }).then(( res: any ) => {
            const { status, data } = res;
            if ( status !== 200 || !data || data.length === 0 ) { return; }

            const config = JSON.parse( data[ 0 ].configure );

            if ( config ) {
                this.userConfig = Object.assign({ }, config, {
                    id: data[ 0 ].id
                });
            }
            this.check = Number( config.isEnableDeviceBindGuide ) === 1
        })
    }

    /** 更改 */
    private updateUserConf( isBind ) {
        this.http$.post({
            data: Object.assign({ }, this.userConfig, {
                isEnableDeviceBindGuide: isBind ? '1' : '0'
            }),
            url: `/api/body-sign/update-user-config`
        }, {
            loadMsg: '设置中...'
        }).then(( res: any ) => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.fetchUserConf(  this.account$.wx.data.openid );
        });
    }

    private judgeGo( ) {
        // 跳到注册
        if ( this.isNew ) {
            this.goCreate( );
        // 跳到设备绑定
        } else {
            this.goBind( );
        }
    }

    /** 跳到设备绑定 */
    private goBind( ) {
        const { sc, dn, f } = this.$route.query;
        this.$router.push(`/body-sign/device-bind?dn=${dn}&sc=${sc}&active=${1}&f=${f}`);
    }

    /** 跳到注册页面 */
    private goCreate( ) {
        const { sc, dn } = this.$route.query;
        // console.log('dn:',dn,"sc:",sc);
        this.$router.push(`/body-sign/account-bind?dn=${dn}&sc=${sc}`);
    }

    /** 检查是否已关注 */
    private checkFolow( ) {
        const { f } = this.$route.query;
        this.showFollow = !!f && !Number( f );
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

    /** 生成关注二维码 */
    private wxQrcode( ) {

        /**
         * tt 参数 请看controller/common
         * f: 1，改为已关注
         */
        const query = Object.assign({ }, this.$route.query, {
            tt: 2,
            f: 1
        });

        let qstring = '';
        Object.keys( query )
            .map( key => {
                qstring += `${key}=${query[ key ]}&`
            });
    
        this.http$.get({
            params: {
                q: qstring
            },
            url: `/api/common/wx-qrcode`
        }).then(( res: any ) => {
                this.qrcodeTicket = ( res.ticket );
        });
    }

    /** 系统用户 */
    private onSystemUser( ) {
        const data = toJS( this.account$.wx.data );
        const systemUser = toJS( this.account$.wx.systemUser );

        this.fetchUserConf(  data.openid );
        this.userConfig = {
            userId: systemUser.id,
            wxOpenId: data.openid
        };
        this.isNew = !systemUser.id;
    }

    /** 监听 */
    private watchMobx( ) {
        observe( this.account$.wx, 'systemUser', change => this.onSystemUser( ));
        if ( !!this.account$.wx.systemUser.id ) {
            this.onSystemUser( );
        }
    }

    mounted( ) {
        this.wxQrcode( );
        this.watchMobx( );
        this.checkFolow( );
        !this.$util.isIOS( ) && this.fetchWxInit( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

