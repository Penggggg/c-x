<template>
    <window-title name="记录数据" >
        
        <div class="p-bodysign-xueya-input">
            <div class="p-input-content">

                <!-- 头部图标、输入框 -->
                <div class="iconInput-block">
                    
                    <!-- 图标 -->
                    <div class="icon-container">
                        <svg class="my-icon big" aria-hidden="true">
                            <use xlink:href="#icon-xieya"></use>
                        </svg>
                    </div>

                    <!-- 标题 -->
                    <div class="title">
                        血压
                    </div>

                    <!-- 高压 -->
                    <div class="round-input">
                        <input
                            id="hight"
                            type="number"
                            placeholder="请输入收缩压"
                            v-model="formData.hight"
                        />
                        <label for="hight" >mmHg</label>
                    </div>

                    <!-- 低压 -->
                    <div class="round-input">
                        <input
                            id="low"
                            type="number"
                            placeholder="请输入舒张压"
                            v-model="formData.low"
                        >
                        <label for="low" >mmHg</label>
                    </div>

                    <!-- 数据展示 -->
                    <div class="data-show">
                        <div>
                            收缩压/舒张压
                        </div>
                        <div class="high-line">
                            {{ formData.hight !== undefined && formData.hight !== null ? formData.hight : '-' }}/{{ formData.low !== undefined && formData.low !== null ? formData.low : '-' }}
                        </div>
                    </div>

                    <!-- 心率 -->
                    <div class="round-input">
                        <input
                            id="rate"
                            type="number"
                            placeholder="请输入脉率"
                            v-model="formData.rate"
                        >
                    </div>

                     <!-- 数据展示 -->
                    <div class="data-show">
                        <div>
                            心率
                        </div>
                        <div class="high-line">
                            {{ formData.rate !== undefined && formData.rate !== null ? formData.rate : '-' }}
                        </div>
                    </div>

                </div>

                <!-- 时间、备注 -->
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../../components/window-title/index.vue';
import MyForm from '../../../../components/my-form-v2/index.vue';

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
        hight: null,
        low: null,
        rate: null,
        desc: null,
        time: new Date( )
    }

    /** interval */
    private clock: any = null;

    /** 当前时间 */
    private time = new Date( );

    /** 表单1 */
    get formMeta( ) {
        const { time } = this.formData;
        return [
            [
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

    /** 设置时间 */
    private setTime( ) {
        this.clock = setInterval(( ) => {
            this.time = new Date( );
        }, 1000 );
    }

    /** 表单 */
    private onFormChange( e ) {
        const { time } = e;
        this.formData = Object.assign({ }, this.formData, {
            time
        });
    }

    /** 提交 */
    private submit( ) {

        const hasError = Object.keys( this.formData ).some( formKey => {
            const current = this.formData[ formKey ];
            if ( formKey === 'hight' && !current ) {
                this.$toast.error('请输入收缩压')
                return true;
            }
            if ( formKey === 'hight' && Number( current ) > 200 ) {
                this.$toast.error('收缩压不能大于200')
                return true;
            }
            if ( formKey === 'hight' && Number( current ) < 0 ) {
                this.$toast.error('收缩压不能小于0')
                return true;
            }
            if ( formKey === 'low' && !current ) {
                this.$toast.error('请输入舒张压')
                return true;
            }
            if ( formKey === 'low' && Number( current ) > 200 ) {
                this.$toast.error('舒张压不能大于200')
                return true;
            }
            if ( formKey === 'low' && Number( current ) < 0 ) {
                this.$toast.error('舒张压不能小于0')
                return true;
            }
            if ( formKey === 'rate' && !current ) {
                this.$toast.error('请输入脉率')
                return true;
            }
            if ( formKey === 'rate' && Number( current ) > 200 ) {
                this.$toast.error('脉率不能大于200')
                return true;
            }
            if ( formKey === 'rate' && Number( current ) < 0 ) {
                this.$toast.error('脉率不能小于0')
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

        const { hight, low, rate, desc, time } = this.formData;
        const data = {
            signType: 'bp',
            remark: desc,
            systolic: Number( hight ),
            diastolic: Number( low ),
            heartrate: Number( rate ),
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
    }

    beforeDestroy( ) {
        clearInterval( this.clock );   
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

