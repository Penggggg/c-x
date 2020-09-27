<template>
    <div class="con-create-visiting-man">
        <my-drawer
            ref="drawer"
            title="体检人"
            :show.sync="theShow"
        >
            <div class="container-block">

                <!-- 表单 -->
                <div class="form-block">
                    <my-form
                        ref="form"
                        :meta="formMeta"
                        @blur="showBtn=true"
                        @focus="showBtn=false"
                        @change="onFormChange"
                    />
                </div>

                <!-- 按钮栏 -->
                <div
                    class="btn-block"
                >
                    <mu-button
                        full-width
                        color="#16c5b0"
                        @click="onSubmit"
                    >
                        保存
                    </mu-button>
                </div>

            </div>
        </my-drawer>
    </div>
</template>
<script lang="ts">
const tools = require('@cvte/wuli-tools').default;
import MyForm from '../../components/my-form-v2/index.vue';
import MyHeader from '../../components/my-header/index.vue';
import MyDrawer from '../../components/my-drawer/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

const { IDCard } = tools;

/**
 * @description 创建体检人
 */
@Component({
    components: {
        MyForm,
        MyDrawer,
        MyHeader
    }
})
export default class CreateVisitingMan extends Vue {

    /** 目标id */
    @Prop({ type: String, required: false }) id!: string;

    /** 展开 */
    @Prop({ type: Boolean, required: true }) show!: boolean;

    /** 当前就诊人 */
    private currentVistor: App.bodyCheckVisitor | null = null;

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        HMS_COMM_SEX: [ ],
        HMS_COMM_CARD_TYPE: [ ],
        HMS_COMM_MARITAL: [ ]
    };
    
    /** 表单数据 */
    get formMeta( ): C.MyForm.meta {
        return [
            [
                {
                    key: 'name',
                    label: '姓名',
                    type: 'input',
                    value: this.currentVistor ? this.currentVistor.name : undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写姓名'
                    }]
                }
            ], [
                {
                    key: 'sexCode',
                    label: '性别',
                    type: 'select',
                    value: this.currentVistor ? this.currentVistor.sexCode : undefined,
                    options: this.dic.HMS_COMM_SEX,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择性别'
                    }]
                }
            ], [
                {
                    key: 'birthDate',
                    label: '出生年月(阳历)',
                    type: 'date2',
                    value: this.currentVistor ? new Date(( this.currentVistor.birthDate as number )) : undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择出生年月(阳历)'
                    }]
                }
            ], [
                {
                    key: 'marriage',
                    label: '婚姻状况',
                    type: 'select',
                    value: this.currentVistor ? (this.currentVistor as any).marriage : undefined,
                    options: this.dic.HMS_COMM_MARITAL,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择婚姻状况'
                    }]
                }
            ], [
                {
                    key: 'mobileNumber',
                    label: '手机',
                    type: 'number',
                    value: this.currentVistor ? this.currentVistor.mobileNumber : undefined,
                    rules: [{
                        validate: val => (/^1\d{10}$/g).test( String( val )),
                        message: '号码为1开头的11位数字'
                    }, { 
                        validate: val => !!val,
                        message: '必须填写手机号码'
                    }]
                }
            ], [
                {
                    key: 'cardType',
                    label: '证件类型',
                    type: 'select',
                    value: !!this.id ?
                                this.dic.HMS_COMM_CARD_TYPE.length > 0 ?
                                    this.dic.HMS_COMM_CARD_TYPE[ 0 ].value :
                                    undefined :
                                undefined,
                    options: this.dic.HMS_COMM_CARD_TYPE,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择证件类型'
                    }]
                }
            ], [
                {
                    key: 'cardNumber',
                    label: '证件号',
                    type: 'input',
                    value: this.currentVistor ? this.currentVistor.cardNumber : undefined,
                    rules: [{ 
                        validate: ( val, formData ) => {
                            const currentCardType = this.dic.HMS_COMM_CARD_TYPE.find( x => x.value === formData['cardType']);
                            if ( currentCardType && currentCardType.label.includes('身份证')) {
                                return IDCard( val ).isValid
                            }
                            return true;
                        },
                        message: '请填写有效的身份证'
                    }]
                }
            ]
        ]
    }

    /** 展示按钮 */
    private showBtn = true;

    get theShow( ) {
        return this.show;
    }

    set theShow( val ) {
        this.closeShow( val );
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_COMM_SEX,HMS_COMM_CARD_TYPE,HMS_COMM_MARITAL `
        }, {
            errMsg: '加载错误',
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            Object.keys( data ).map( dicKey => {
                this.dic = Object.assign({ }, this.dic, {
                    [ dicKey ]: data[ dicKey ].map( x => ({
                        label: x.name,
                        value: x.itemValue
                    }))
                })
            });
        });
    }

    /** 拉取当前id人的信息 */
    private fetchDetail( id ) {
        if ( !id ) { return; }
        this.http$.get<normalResult<App.bodyCheckVisitor>>({
            url: `/api/booking//clinic_people/${id}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.currentVistor = data;
        });
    }

    /** 关闭外部show */
    private closeShow( val ) {
        this.$emit('update:show', val );
    }

    /** 保存 */
    private onSubmit( ) {
        const { result, data } = (this.$refs.form as any).getData( );

        if ( !result ) {
            return this.$toast.error('请完善表单后重新提交');
        }

        const reqData = Object.assign({ }, data, {
            birthDate: ( new Date( data.birthDate )).getTime( )
        });

        if ( !!this.id ) {
            this.http$.put<normalResult<any>>({
                data: reqData,
                url: `/api/booking/clinic_people/${this.id}`
            }, {
                loadMsg: '更新中...',
                successMsg: '更新成功'
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                (this.$refs.drawer as any).close( );
            });
        } else {
            this.http$.post<normalResult<any>>({
                data: reqData,
                url: `/api/booking/clinic_people`
            }, {
                loadMsg: '创建中...',
                successMsg: '创建成功'
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                (this.$refs.drawer as any).close( );
            });
        }
    }

    /** 表单更新 */
    private onFormChange( formData ) {
        if ( formData['cardType']) {
            (this.$refs.form as any).getData('cardNumber');
        }
    }

    @Watch('show')
    onShow( val ) {
        if ( !val ) { return; }
        this.fetchDic( );
        this.fetchDetail( this.id );
        setTimeout(( ) => {
            this.currentVistor = null;
            (this.$refs.form as any).reset( );
        }, 0 );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

