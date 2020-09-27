<template>
    <window-title
        name="视源健康"
    >
        <div class="p-activity-gys">

            <div>
                <!-- 健康卡 -->
                <!-- <div class="health-card">
                    <div class="title">
                        源·头（男）
                    </div>
                    <div class="tips">
                        含131项检查项目
                    </div>
                    <div class="price-block">
                        RMB: <div class="price">¥2999.00</div>
                    </div>
                    <div class="logo">
                        yibicom.com
                    </div>
                </div> -->

                <!-- 健康卡 -->
                <img
                    class="health-card-img"
                    src="/public/img/health-card.png"
                />

                <!-- tips -->
                <div class="tips-block p1">
                    健康卡采用实名制，请准确输入手机号码
                </div>

                <div class="tips-block np">
                    「如未预留手机，请致电<a class="tela" href="tel:400-002-0666">400-002-0666</a>预约」
                </div>

                <!-- 表单 -->
                <div class="my-form-block">
                    <my-form-v2
                        ref="form"
                        :meta="formMeta"
                    />
                </div>
            </div>

            <div>
                <!-- 按钮 -->
                <div 
                    class="submit-btn"
                    @click="submit"
                >
                    激活使用
                </div>
                <!-- 协议 -->
                <div class="other-block">
                    <div class="check-block">
                        <mu-checkbox
                            color="#16c5b0"
                            v-model="agree"
                        />
                        <span>
                            <a @click="agree = !agree">同意视源健康《<a @click="showProcotol=true">用户服务协议</a>》</a>
                        </span>
                    </div>
                </div>
            </div>

            <!-- 服务协议 --> 
            <my-drawer
                title="用户服务协议"
                :show.sync="showProcotol"
            >
                <my-protocol />
            </my-drawer>

            <!-- 关注公众号 -->
            <my-filter-modal
                :show.sync="showFollow"
            >
                <div class="my-modal">
                    <div class="modal-content">
                        <img
                            class="img"
                            v-if="qrcodeTicket"
                            :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${qrcodeTicket}`"
                        />
                        <div class="title">
                            长按二维码 关注关注号
                        </div>
                        <div class="tips mt">
                            恭喜，您的健康卡已激活成功。
                        </div>
                        <div class="tips">
                            关注微信公众号快去预约体检吧！
                        </div>
                    </div>
                    <div class="modal-desc">
                        <div class="tips">
                            「预约体检 操作提示」
                        </div>
                        <div class="tips">
                            关注公众号-服务中心-体检卡预约
                        </div>
                    </div>
                </div>
            </my-filter-modal>

            <!-- 查看预约 -->
            <my-filter-modal
                v-if="recorded"
                :show.sync="showRecord"
            >
                <div class="my-modal">
                    <div class="modal-content">
                        <img
                            class="img"
                            src="/public/img/girl.png"
                        />
                        <div class="tips">
                            您已预约体检，请准时到达！
                        </div>
                    </div>
                    <div class="modal-desc">
                        <div class="tips">
                            「查看预约 操作提示」
                        </div>
                        <div class="tips">
                            关注公众号-服务中心-体检卡预约
                        </div>
                    </div>
                    <div class="btn-block">
                        <div
                            @click="goRecord"
                            class="modal-btn"
                        >
                            查看预约
                        </div>
                    </div>
                </div>
            </my-filter-modal>

            <!-- 引导预约 -->
            <my-filter-modal
                v-if="!recorded"
                :show.sync="showGoRecord"
            >
                <div class="my-modal">
                    <div class="modal-content">
                        <img
                            class="img"
                            src="/public/img/girl.png"
                        />
                        <div class="tips mt">
                            恭喜，您的健康卡已激活成功。
                        </div>
                        <div class="tips">
                            快去预约体检吧！
                        </div>
                    </div>
                    <div class="modal-desc">
                        <div class="tips">
                            「预约 操作提示」
                        </div>
                        <div class="tips">
                            关注公众号-服务中心-体检卡预约
                        </div>
                    </div>
                    <div class="btn-block">
                        <div
                            @click="goReservation"
                            class="modal-btn"
                        >
                            去预约
                        </div>
                    </div>
                </div>
            </my-filter-modal>

            <!-- 验证失败 -->
            <my-filter-modal
                v-if="!recorded"
                :bgclose="false"
                :show.sync="showErr"
            >
                <div class="my-modal">
                    <div class="modal-content">
                        <img
                            class="img"
                            src="/public/img/girl.png"
                        />
                        <div class="tips mt">
                            验证失败
                        </div>
                        <div class="tips">
                            请仔细核对电话信息
                        </div>
                    </div>
                    <div class="modal-desc">
                        <div class="tips">
                            「如未预留手机号」
                        </div>
                        <div class="tips">
                            请致电进行体检预约
                        </div>
                        <div class="tips">
                            <a class="tel" href="tel:400-002-0666">400-002-0666</a>
                        </div>
                    </div>
                </div>
            </my-filter-modal>

        </div>
    </window-title>
</template>
<script lang="ts">
import { observe, toJS } from "mobx";
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../components/window-title/index.vue';
import MyDrawer from '../../../components/my-drawer/index.vue';
import MyFormV2 from '../../../components/my-form-v2/index.vue';
import MyProtocol from '../../../container/service-protocol/index.vue';
import MyFilterModal from '../../../components/my-filter-modal/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyDrawer,
        MyFormV2,
        MyProtocol,
        windowTitle,
        MyFilterModal
    }
})
export default class AccountBind extends Vue {

    /** 批次id */
    private cid = '';

    /** 协议 */
    private agree = false;

    /** 验证 */
    private hasChecked = false;

    /** 展示协议 */
    private showProcotol = false;

    /** 展示关注 */
    private showFollow = false;

    /** 展示已预约 */
    private showRecord = false;

    /** 展示去预约 */
    private showGoRecord = false;

    /** 展示验证失败 */
    private showErr = false;

    /** 是否验证失败 */
    private hasErr = false;

    /** 是否已关注 */
    private followed = false;

    /** 是否已激活 */
    private actived = false;

    /** 是否已预约 */
    private recorded = false;

    /** 是否已绑定 */
    private bound = false;

    /** 二维码 */
    private qrcodeTicket = '';

    /** 区号列表 */
    private smsCountryOpt = [ ];

    /** 表单数据 */
    get formMeta( ) {
        const { smsCountryOpt } = this;
        return [
            [
                {
                    key: 'country',
                    type: 'select',
                    label: '国际区号',
                    options: smsCountryOpt,
                    rules: [{
                        validate: val => !!val,
                        message: '请选择区号'
                    }]
                }, {
                    key: 'telephone',
                    label: '手机',
                    type: 'number',
                    value: undefined,
                    color: '#16c5b0',
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写手机号码'
                    }]
                }
            ], [{
                    border: false,
                    color: '#16c5b0',
                    saveKey: 'activity-gys',
                    label: '验证码',
                    key: 'verifycode',
                    type: 'verifycode',
                    smsCountryKey: 'country',
                    phonekey: 'telephone',
                    url: '/api/common/verifycode',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写验证码'
                    }]
            }]
        ];
    }

    /** 生成关注二维码 */
    private wxQrcode( ) {    
        this.http$.get({
            params: {
                q: `f=1&tt=3`
            },
            url: `/api/common/wx-qrcode`
        }).then(( res: any ) => {
            this.qrcodeTicket = ( res.ticket );
        });
    }

    /** 获取国际区号 */
    private getSmsCountry( ) {
        this.http$.get({url: `/api/common/sms-country`
        }).then(( res: any ) => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.smsCountryOpt = data.internationalSMSCountryTypes.map( x => ({
                value: x.code,
                label: `${x.name} +${x.code}`
            }));
        });
    }

    /** 根据url参数 初始化 */
    private init( ) {
        const { e, f, a, u, r, cid } = this.$route.query;
        this.cid = cid;

        this.followed = !!f && (f === 'true' || f === '1');
        this.actived = !!a && (a === 'true' || a === '1');
        this.recorded = !!r && (r === 'true' || r === '1');
        this.bound = !!u && (u === 'true' || u === '1');
        this.hasErr = !!e && (e === 'true' || e === '1');

        setTimeout(( ) => {
            this.showErr = !!this.hasErr;
            this.showFollow = !!this.actived && !this.followed && !this.recorded;
            this.showRecord = !!this.actived && !!this.recorded;
            this.showGoRecord = !!this.actived && !!this.followed && !this.recorded;
        }, 50 );
    }

    /** 查看预约 */
    private goRecord( ) {
        // this.$router.push('/appointment/record');
        this.$router.push('/health-card/my?tab=1')
    }

    /** 去预约 */
    private goReservation( ) {
        this.$router.push('/health-card/my');
    }

    /** 检查验证码 */
    private checkCode( phone, verifycode, smsCountry ) {
        return new Promise( r => {
            const { hasChecked } = this;
            if ( hasChecked ) { return r( true );}
            this.http$.post< any >({
                url: `/api/common/check-verifycode`,
                data: {
                    phone,
                    internationalType: smsCountry,
                    verifycode: String( verifycode ).slice( 0, 6 )
                }}, {
                    errMsg: '验证码错误',
                    loadMsg: '校验中...'
                }).then( res => {
                    r( res.status === 200 ); 
                    this.hasChecked = res.status === 200;
                }).catch( e => r( false ));
        })
    }

    /** 提交 */
    private submit( ) {
        const { data, result } = (this as any).$refs.form.getData( );
        const wxData: App.wxAccount = toJS(this.account$.wx.data);
        const { telephone, verifycode, country } = data;
        const { cid, followed, agree } = this;

        if ( !result ) {
            return this.$toast.error('请完善表单');
        }

        if ( !agree ) {
            return this.$toast.error('请阅读并勾选用户协议');
        }

        // 检查验证码
        this.checkCode( telephone, verifycode, country )
            .then( isOK => {
                if ( !isOK ) { return;}

                this.http$.put< any >({
                    url: `/api/health-check/active`,
                    params: {
                        cardBatchId: cid,
                        openId: wxData.openid,
                        mobile: telephone,
                    }}, {
                        loadMsg: '激活中...',
                        successMsg: '激活成功!'
                    }).then( res => {
                        const { status, data } = res;
    
                        if ( status !== 200 ) { return; }

                        if ( !followed ) {
                            this.showFollow = true;
                        } else {
                            this.showGoRecord = true;
                        }
                });
            });
    }

    /**
     * @description
     * query参数：
     * cid: 卡的批次id
     * f: 是否关注 1、0
     * a: 是否激活 1、0
     * r: 此卡是否已预约 1、0
     * u: 用户是否已绑定 1、0
     * e: 出错：该用户不存在健康卡
     * 
     * 1、未激活+未关注+未预约：激活-引导关注-消息推送（带【预约入口】链接）  【已完成】
     * 2、未激活+已关注+未预约：激活-跳预约页面                          【已完成】
     * 3、已激活+未关注+未预约：引导关注-消息推送（带【预约入口】链接）      【已完成】
     * 6、已激活+已关注+未预约：引导预约                                【已完成】
     * 4、已激活+未关注+已预约：查看预约                                【已完成】
     * 7、已激活+已关注+已预约：查看预约                                【已完成】
     */
    mounted( ) {
        this.init( );
        this.wxQrcode( );
        this.getSmsCountry( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

