<template>
    <div class="p-account-bind my-page">

        <!-- 头像 -->
        <div class="avatar-block">
            <smart-avatar
                :size="120"
                :img="account$.wx.data.avatar"
            />
        </div>

        <!-- 表单 -->
        <div class="my-form-block">
            <my-form-v2
                ref="form"
                :meta="formMeta"
                :disabled="!isEditing"
            />
        </div>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                @click="save"
                color="success"
                v-if="isEditing"
            >
                保存
            </mu-button>
            <mu-button
                full-width
                @click="isEditing=true"
                color="success"
                v-else
            >
                编辑
            </mu-button>
            <a
                class="cancel-btn"
                v-if="isEditing"
                @click="isEditing=false"
            >
                取消编辑
            </a>
            <mu-button
                full-width
                color="success"
                v-if="user && !isEditing"
                class="cancel-bind-btn"
                @click="openSimple = true"
            >
                取消绑定
            </mu-button>
        </div>

        <!-- 提示 -->
        <mu-dialog title="提示" width="360" :open.sync="openSimple">
            确定取消账号绑定吗？
            <mu-button slot="actions" flat color="primary" @click="cancelBind">确认</mu-button>
            <mu-button slot="actions" flat @click="openSimple = false">取消</mu-button>
        </mu-dialog>

    </div>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
const tools = require('@cvte/wuli-tools').default;
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyFormV2 from '../../../components/my-form-v2/index.vue';
import SmartAvatar from '../../../components/smart-component/index.vue';

const { IDCard } = tools;

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyFormV2,
        SmartAvatar
    }
})
export default class AccountBind extends Vue {

    /** 用户数据 */
    private user: App.systemUser | null = null;

    /** 已加载初始数据 */
    private hasLoad = false;

    /** 编辑状态 */
    private isEditing = false;

    /** 警告 */
    private openSimple = false;

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        HMS_COMM_SEX: [ ]
    };

    /** 表单数据 */
    get formMeta( ): C.MyForm.meta {

        const phone: any = [
            {
                key: 'telephone',
                label: '手机',
                type: 'encryption',
                value: undefined,
                encryptions: [[ 3,6 ]],
                rules: !this.isEditing ? [ ] : [{
                    validate: val => (/^1\d{10}$/g).test( String( val )),
                    message: '号码为1开头的11位数字'
                }, { 
                    validate: val => !!val,
                    message: '必须填写手机号码'
                }]
            }
        ];

        const idCard: any = [
            {
                key: 'identityCard',
                label: '身份证号',
                type: 'encryption',
                value: undefined,
                encryptions: [[ 0, 2 ], [ 14, 17 ]],
                rules: !this.isEditing ? [ ]: [{ 
                    validate: val => val && IDCard( val ).isValid,
                    message: '请填写有效的身份证'
                }]
            }
        ]

        const origin: C.MyForm.meta = [
            [
                {
                    key: 'name',
                    label: '姓名',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写姓名'
                    }]
                }
            ], [
                {
                    key: 'gender',
                    label: '性别',
                    type: 'select',
                    value: undefined,
                    options: this.dic.HMS_COMM_SEX,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择性别'
                    }]
                }
            ], [
                {
                    key: 'birthday',
                    type: 'date2',
                    value: undefined,
                    label: '出生年月(阳历)',
                    rules: [{
                        validate: val => !!val,
                        message: '请选择生日日期'
                    }]
                }
            ], idCard, phone, [
                {
                    saveKey: 'personal-bind',
                    label: '验证码',
                    key: 'verifycode',
                    type: 'verifycode',
                    phonekey: 'telephone',
                    url: '/api/common/verifycode',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写验证码'
                    }]
                }
            ]
        ];
      
        return this.isEditing ? origin : [ ...origin.slice( 0, -1 )]
    } 

    @Watch('isEditing')
    onEdit( edit: boolean ) {
        if ( edit ) {
            // (this.$refs.form as any).set({
            //     identityCard: this.user.identityCard,
            //     telephone: this.user.telephone
            // });
        } else {
            const wxData: App.wxAccount = toJS( this.account$.wx.data );
            this.account$.wx
                .getSysData( wxData.appid, wxData.openid )
                .then( data => {
                    if ( data ) {
                        this.user = data;
                        this.setFormData( data );
                    }
                });
        }
    }

    /** 设置表单信息 */
    private setFormData( data ) {
        const { name, gender, identityCard, telephone, birthday } = data;
        (this.$refs.form as any).set({
            name,
            gender,
            telephone,
            identityCard: identityCard || '',
            birthday: birthday ? (new Date( birthday )) : null
            // identityCard: identityCard ? `***${identityCard.substr( 3, 11 )}****` : '',
            // telephone: `${telephone.substring( 0, 3 )}****${telephone.substring( 7, 11 )}`
        });
    }

    /** 拿到用户数据 */
    private onUserUpdate( user: App.systemUser ) {
        if ( this.hasLoad ) { return; }
        if ( user.id ) {
            this.hasLoad = true;
        }
        if ( !user.id ) { return; }

        this.user = user;
        this.setFormData( user );
    }

    /** 信息保存 */
    private save( ) {

        const { result, data } = (this.$refs.form as any).getData( );
        const { verifycode, telephone, name, birthday, identityCard, gender } = data;

        if ( !result ) {
            return this.$toast.error('请完善表单后重新提交');
        }

        this.http$.post<normalResult<any>>({
            data: {
                verifycode,
                phone: telephone
            },
            url: '/api/common/check-verifycode'
        }, {
            loadMsg: '验证中...',
            errMsg: '验证码或手机号码错误'
        }).then( res => {
            const { status } = res;
            if ( status !== 200 || !this.user ) { return; }

            const { id } = this.user;
            const { openid, appid } = this.account$.wx.data;
            const reqData = {
                name,
                gender,
                telephone,
                identityCard,
                appId: appid,
                openId: openid,
                birthday: new Date( birthday ).getTime( )
            };
            
            this.http$.put<normalResult<any>>({
                data: reqData,
                url: `/api/account/system/${id}`
            }, {
                loadMsg: '更新中...',
                successMsg: '更新成功'
            }).then( res => {

            });
        })

    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_COMM_SEX`
        }, {
            errMsg: '加载错误',
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.dic = Object.assign({ }, this.dic, {
                HMS_COMM_SEX: data.HMS_COMM_SEX.map( x => ({
                    label: x.name,
                    value: x.itemValue
                }))
            })
        });
    }

    /** 取消绑定 */
    private cancelBind( ) {
        const { openid, appid } = this.account$.wx.data;
        this.http$.delete<normalResult<any>>({
            url: `/api/account/system?appId=${appid}&openId=${openid}`
        }, {
            loadMsg: '取消绑定中...',
            successMsg: '取消绑定成功!'
        }).then( res => {
            if ( res.status === 200 ) {
                this.openSimple = false;
                setTimeout(( ) => {
                    try {
                        this.$router.replace('/account/bind');
                        (window as any).WeixinJSBridge.call('closeWindow');
                    } catch (e) {

                    }
                }, 1000 );
            }
        });
    }

    mounted( ) {
        this.fetchDic( );
    }

    beforeUpdate( ) {
        this.onUserUpdate( toJS( this.account$.wx.systemUser ));
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

