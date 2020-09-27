<template>
    <window-title name="记录数据" >
        
        <div class="p-bodysign-xueya-input">
            <div class="p-input-content">

                <!-- 头部图标、输入框 -->
                <div class="iconInput-block">
                    
                    <!-- 图标 -->
                    <div class="icon-container">
                        <svg class="my-icon big" aria-hidden="true">
                            <use xlink:href="#icon-xietang"></use>
                        </svg>
                    </div>

                    <!-- 标题 -->
                    <div class="title">
                        血糖
                    </div>

                    <!-- 高压 -->
                    <div class="round-input">
                        <input
                            id="glucose"
                            type="number"
                            placeholder="请输入血糖值"
                            v-model="formData.glucose"
                        />
                        <label for="glucose" >mmol/L</label>
                    </div>

                    <!-- 数据展示 -->
                    <div class="data-show">
                        <div class="high-line">
                            {{ formData.glucose !== undefined && formData.glucose !== null ? formData.glucose : '-' }}
                        </div>
                        mmol/L
                    </div>

                </div>

                <!-- 时段、时间、备注 -->
                <div class="other-block">

                    <my-form
                        ref="form"
                        :meta="formMeta"
                        @change="onFormChange"
                    />

                    <!-- <div class="time-block">
                        {{ time$ }}
                    </div> -->

                    <div class="round-input big">
                        <input
                            id="desc"
                            type="text"
                            v-model="formData.desc"
                            placeholder="添加健康数据备注"
                        >
                    </div>

                    <div
                        class="save-btn"
                        @click="submit"
                    >
                        保存
                    </div>

                </div>

            </div>
        </div>
    </window-title>
</template>
<script lang="ts">
import { inject } from '../../../../service/inject';
import { setInterval, clearInterval } from 'timers';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyForm from '../../../../components/my-form-v2/index.vue';
import windowTitle from '../../../../components/window-title/index.vue';

@inject({ 
    selector: ['account$']
})
@Component({
    components: {
        MyForm,
        windowTitle
    }
})
export default class P extends Vue {

    /** 表单数据 */
    private formData = {
        glucose: null,
        glucosePeriod: null,
        desc: null,
        time: new Date( )
    }

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        'HMS_SIGN_SUGAR_TYPE': [ ]
    }

    /** interval */
    private clock: any = null;

    /** 当前时间 */
    private time = new Date( );

    /** 当前时间（中文 */
    get time$( ) {
        const { time } = this;
        const y = time.getFullYear( );
        const m = time.getMonth( ) + 1;
        const d = time.getDate( );
        const h = time.getHours( );
        const mm = time.getMinutes( );
        const fixZero = n => `${ String( n ).length === 1 ? '0' + n : n }`;
        return `${y}-${fixZero( m )}-${fixZero( d )} ${fixZero(h)}:${fixZero( mm )}`
    }

    /** 表单1 */
    get formMeta( ) {
        const { desc, time } = this.formData;
        return [
            [
                {
                    key: 'glucosePeriod',
                    label: '时段选择',
                    type: 'select',
                    value: null,
                    options: this.dic.HMS_SIGN_SUGAR_TYPE,
                    rules: [ ]
                }
            ], [
                {
                    key: 'time',
                    label: '时间',
                    type: 'dateTime',
                    value: time,
                    rules: [ ]
                }
            ]
        ];
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        const dicType = 'HMS_SIGN_SUGAR_TYPE';
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=${dicType}`
        }, {
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

    /** 设置时间 */
    private setTime( ) {
        this.clock = setInterval(( ) => {
            this.time = new Date( );
        }, 1000 );
    }

    /** 表单 */
    private onFormChange( e ) {
        const { glucosePeriod, time } = e;
        this.formData = Object.assign({ }, this.formData, {
            time,
            glucosePeriod
        });
    }

    /** 提交 */
    private submit( ) {

        const hasError = Object.keys( this.formData ).some( formKey => {
            const current = this.formData[ formKey ];
            if ( formKey === 'glucose' && !current ) {
                this.$toast.error('请输入血糖')
                return true;
            }
            if ( formKey === 'glucose' && Number( current ) > 200 ) {
                this.$toast.error('血糖不能大于200')
                return true;
            }
            if ( formKey === 'glucose' && Number( current ) < 0 ) {
                this.$toast.error('血糖不能小于0')
                return true;
            }
            if ( formKey === 'glucosePeriod' && !current ) {
                this.$toast.error('请选择时段')
                return true;
            }
            if ( formKey === 'desc' && (( !!current && !!current.trim( )) && current.length > 100 )) {
                this.$toast.error('备注不能大于100字')
                return true;
            } 
            return false;
        });

        if ( hasError ) {
            return;
        }

        const { glucose, desc, glucosePeriod, time } = this.formData;
        const data = {
            glucose,
            signType: 'bg',
            glucosePeriod,
            remark: desc,
            // timestamp: this.time.getTime( ),
            timestamp: time.getTime( ),
            userId: this.account$.wx.systemUser.id
        };

        this.http$.post< any >({
            data,
            url: `/api/body-sign/device-data`
        }, {
            loadMsg: '提交中...',
            successMsg: '提交成功！'
        }).then( res => {
            if ( res.status === 200 ) {
                this.$router.back( );
            }
        })
    }

    mounted( ) {
        this.setTime( );
        this.fetchDic( );
    }

    beforeDestroy( ) {
        clearInterval( this.clock );   
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

