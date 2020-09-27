<template>
    <div class="con-create-health-card">
        <my-drawer
            title="添加健康卡"
            :show.sync="theShow"
        >
            <div class="container-block">

                <!-- 标题 -->
                <p class="sub-title">
                    请输入您的健康卡号和密码，添加后就可以使用该健康卡进行体检预约，消费使用。
                </p>

                <!-- 表单 -->
                <div class="form-block">
                    <my-form
                        ref="form"
                        :meta="formMeta"
                    />
                </div>

                <!-- 按钮 -->
                <div class="btn-block">
                    <mu-button
                        full-width
                        color="#4caf50"
                        @click="onSubmit"
                    >
                        确定
                    </mu-button>
                </div>

                <!-- 提示 -->
                <!-- <div class="the-tips-block">
                    <p>验证说明：</p>
                    <p>1.卡号、密码不能为空；</p>
                    <p>2.账号或密码错误；</p>
                    <p>3.健康卡已被绑定，添加失败；</p>
                    <p>4.健康卡未激活，添加失败；</p>
                </div> -->

            </div>
        </my-drawer>
    </div>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../service/inject';
import MyHeader from '../../components/my-header/index.vue';
import MyDrawer from '../../components/my-drawer/index.vue';
import MyForm from '../../components/my-form-v2/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyForm,
        MyDrawer,
        MyHeader
    }
})
export default class CreateHealthCard extends Vue {

    /** 展开 */
    @Prop({ type: Boolean, required: true }) show!: boolean;

    get theShow( ) {
        return this.show;
    }

    get formMeta( ): C.MyForm.meta {
        return [
            [
                {
                    key: 'cardNumber',
                    label: '卡号',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写卡号'
                    }]
                }
            ], [
                {
                    key: 'cardPwd',
                    label: '密码',
                    type: 'input',
                    value: undefined,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须填写密码'
                    }]
                }
            ]
        ];
    }

    set theShow( val ) {
        this.$emit('update:show', val );
    }

    private onSubmit( ) {
        const { result, data } = (this.$refs.form as any).getData( );
        if ( !result ) {
            return this.$toast.error('请完整填写表单内容');
        }
        this.http$.post<normalResult<null>>({
            data,
            url: '/api/health-card/bind'
        }, {
            loadMsg: '添加中...',
            successMsg: '添加成功'
        }).then( res => {
            if ( res.status === 200 ) {
                this.theShow = false;
            }
        });
    }

    @Watch('show')
    onShow( show ) {
        if ( show ) {
            setTimeout(( ) => {
                (this.$refs.form as any).set({
                    cardNumber: undefined,
                    cardPwd: undefined
                });
            }, 0 );
        }
    }

}
</script>
<style lang="less" scoped>
@import './index.less';
</style>

