<template>
    <window-title name="设备绑定" >

        <div class="p-bodysign-bind">
            <skt-list
                type="new"
                :loading="loading"
            >
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
                            {{ item.label }}
                        </div>
                        <div class="item-tips">
                            {{ 
                                item.isBound ? '已绑定' : '未绑定'
                            }}
                        </div>
                    </li>
                </ul>
            </skt-list>
            
        </div>

        <mu-dialog title="设备绑定" width="360" :open.sync="showDialog">
            <my-form
                ref="form"
                :meta="formMeta1"
                @change="onForm1Change"
            />
            
            <mu-button
                slot="actions"
                flat
                color="primary"
                @click="showDialog = false"
            >
                取消
            </mu-button>
            <mu-button
                slot="actions"
                flat
                color="primary"
                @click="submit"
            >
                确认
            </mu-button>
        </mu-dialog>

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

    /** 每个设备对应的已绑定列表 */
    private boundList: any[ ][ ] = [ ]

    /** 用户列表 */
    private users: any = [ ];

    get list$( ) {
        const { boundList, list } = this;
        return this.list.map(( x,k ) => {
            return Object.assign({ }, x, {
                hasBound: boundList[ k ] ? boundList[ k ] .length > 0 : false
            })
        });
    }

    /** 表单1 */
    get formMeta1( ) {
        const { users } = this;

        const useroption = [
            {
                key: 'user',
                label: '绑定用户',
                type: 'select',
                value: null,
                options: this.users.map( x => ({
                    label: x.nick,
                    value: x.createTime
                })),
                rules: [{ 
                    validate: val => !!val && !!(String( val ).trim( )),
                    message: '请选择用户'
                }]
            }
        ]

        const meta: any = [
            [
                {
                    key: 'dn',
                    label: ' 设备编码',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写编码'
                    }]
                }
            ]
        ];

        if ( users.length > 0 ) {
            meta.push( useroption )
        }

        return meta;
    }

    /** 监听 */
    private watchMobx( ) {
        observe( this.account$.wx, 'systemUser', change => {
            this.fetchSource( );
        });
        !!this.account$.wx.systemUser.id && this.fetchSource( );
    }

    /** 获取设备来源 */
    private fetchSource( ) {
        
        this.http$.get< any >({
            url: `/api/body-sign/device-source?isDevice=1`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.list = data.map( x => {
                return {
                    label: x.sourceName,
                    value: x.sourceCode,
                    isBound: x.isBindSource,
                    icon: '#icon-shouji',
                }
            });
            this.fetchHasBound( data.map( x => x.id ));
        })
    }

    /** 获取已经绑定过的设备 */
    private fetchHasBound( scArr: string[ ]) {

        this.loading = true;

        Promise.all( scArr.map( sc => this.http$.get< any >({
            params: {
                sourceCode: sc,
                userId: this.account$.wx.systemUser.id
            },
            url: `/api/body-sign/bound-devices`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return null; }

            return data;

        }))).then( res => {
            if ( res.some( x => x === null )) {
                return this.$toast.error('查询错误')
            }
            this.loading = false;
            this.boundList = res;
        });
    }

    /** 查询设备上的用户列表 */
    private fetchUserList( sourceCode, dn ) {
        this.http$.get< any >({
            url: `/api/body-sign/device-userlist?sourceCode=${sourceCode}&dn=${dn}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.users = data;
        })
    }

    /** 绑定设备用户 */
    private bindDeviceUser( data ) {
        this.http$.post< any >({
            data,
            url: `/api/body-sign/device-bind-user`
        }, {
            loadMsg: '绑定中...',
            successMsg: '绑定成功！'
        }).then( res => {
            const { status, data } = res;
            if ( status === 200 ) {
                this.showDialog = false;
                this.fetchSource( );
            }
        })
    }

    private submit( ) {

        if ( this.users.length === 0 ) {
            return this.$toast.info('请检查设备编码是否正确')
        }

        const { result, data } = ( this.$refs.form as any ).getData( );
        if ( !result ) {
            return this.$toast.error('请完善表单信息')
        }
        const { user, dn } = data;
        const targetUser = this.users.find( x => x.createTime === user );

        const temp = {
            deviceSn: dn,
            deviceUserNick: targetUser.nick,
            deviceTag: targetUser.tag,
            sourceCode: this.sourceCode,
            userId: this.account$.wx.systemUser.id
        };
        this.bindDeviceUser( temp );
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

    /** 点击设备列表选项 */
    private onTabDevice( item ) {
        
        // 如果是有绑定的设备就跳到绑定列表
        if ( item.hasBound ) {

            this.$router.push(`/body-sign/bound-device/${item.value}`)

        } else {

            // 如果是没有的，就扫码
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
    }

    /** 编码输入 Q23099500041 */ 
    private onForm1Change( e ) {
        const { dn } = e;
        const { sourceCode } = this;
        if ( !!dn && !!(String( dn ).trim( )) && !!sourceCode ) {
            this.fetchUserList( sourceCode, dn );
        }
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

