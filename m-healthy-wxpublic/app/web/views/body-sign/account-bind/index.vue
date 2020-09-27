<template>
    <window-title
        name="账号绑定"
    >
        <div class="p-bodysign-account-bind" >

            <!-- 当前进度 -->
            <div
                class="my-process-block"
            >
                <my-process
                    :active="0"
                    :options="[
                        '用户注册',
                        '账号绑定'
                    ]"
                />
            </div>

            <!-- 表单 -->
            <div class="my-form-block">
                <my-form
                    :key="1"
                    ref="form"
                    :meta="formMeta"
                />
            </div>

            <!-- 协议与帮助 --> 
            <div class="other-block">
                <div class="check-block">
                    <mu-checkbox
                        value="eat"
                        v-model="agree"
                    />
                    <span>
                        <span @click="agree = !agree">已阅读并同意</span>《<a @click="showProcotol=true">用户服务协议</a>》
                    </span>
                </div>
                <a href="tel:4000-020-666" class="tel">联系客服</a>
            </div>
            <!-- 文字提示 -->
            <div class="remind-block">
                <span>账号绑定前，请先注册为视源健康会员，以便享用视源健康管理服务</span>
            </div>

            <div class="btn-block">
                <div
                    class="btn"
                    @click="onCheck"
                >
                    注册/绑定用户
                </div>
            </div>

            <!-- 服务协议 --> 
            <my-drawer
                title="用户服务协议"
                :show.sync="showProcotol"
            >
                <my-protocol />
            </my-drawer>

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
import MyDrawer from '../../../components/my-drawer/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../components/window-title/index.vue';
import MyForm from '../../../components/my-form-v2/index.vue';
import MyProcess from '../../../components/my-process/index.vue';
import MyProtocol from '../../../container/service-protocol/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyProcess,
        MyForm,
        MyDrawer,
        windowTitle,
        MyProtocol
    }
})
export default class P extends Vue {

    /** 二维码 */
    private qrcodeTicket = '';

    /** 展开关注框 */
    private showFollow = false;

    /** 同意服务协议 */
    private agree = true;

    /** 展示协议 */
    private showProcotol = false;

    /** 表单信息 */
    get formMeta( ): C.MyForm.meta {
        return [
            [
                {
                    key: 'name',
                    label: '姓名',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写姓名'
                    }, {
                        validate: val => !!val && String( val ).length <= 10,
                        message: '姓名小于10个字'
                    }]
                }
            ], [
                {
                    key: 'telephone',
                    label: '手机',
                    type: 'number',
                    value: undefined,
                    rules: [{
                        validate: val => (/^1\d{10}$/g).test( String( val )),
                        message: '号码为1开头的11位数字'
                    }, { 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写手机号码'
                    }]
                }
            ], [
                {
                    saveKey: 'form-bind2',
                    label: '验证码',
                    key: 'verifycode',
                    type: 'verifycode',
                    phonekey: 'telephone',
                    url: '/api/common/verifycode',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val && !!(String( val ).trim( )),
                        message: '必须填写验证码'
                    }]
                }
            ]
        ]
    }

    /** 验证码校验 */
    private onCheck( ) {

        const { result, data } = ( this.$refs.form as any ).getData( );
        const { verifycode, telephone } = data;

        if ( !result ) {
            return this.$toast.error('请完善表单信息')
        }

        if ( !this.agree ) {
            return this.$toast.info('请查看并勾选用户服务协议')
        }

        this.http$.post<normalResult<any>>({
            url: `/api/common/check-verifycode`,
            data: {
                verifycode,
                phone: telephone
            }
        }, {
            errMsg: '验证码错误',
            loadMsg: '校验中...'
        }).then( res => {
            if ( res.status === 200 ) {
                this.onSubmit({
                    name: data.name,
                    telephone: data.telephone
                });
            } 
        });
    }

    /** 提交 */
    private onSubmit( temp ) {
        const { dn, sc,  } = this.$route.query;
        const data = Object.assign({ }, temp, {
            appId: this.account$.wx.data.appid,
            openId: this.account$.wx.data.openid,
        });
        this.http$.post< any >({
            data,
            url: '/api/account/bind_or_create',
        }, {
            loadMsg: '加载中...',
            successMsg: '注册/绑定完成！'
        }).then( res => {
            if ( res.status === 200 ) {
                const { dn, sc,  } = this.$route.query;
                const host = process.env.NODE_ENV === "dev" ?
                            'http://m-health-wx.cvteapi.com' : 'https://m-health-wx.cvte.com';
                window.location.href = `${host}/body-sign/device-bind?dn=${dn}&sc=${sc}&active=1&f=1`;
            }
        })
    }

    /** 检查是否已关注 */
    private checkFolow( ) {
        const { f } = this.$route.query;
        this.showFollow = !!f && !Number( f );
    }

    /** 生成关注二维码 */
    private wxQrcode( ) {

        /**
         * tt 参数 请看controller/common
         * f: 1，改为已关注
         */
        const query = Object.assign({ }, this.$route.query, {
            tt: 1,
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

    mounted( ) {
        this.wxQrcode( );
        this.checkFolow( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

