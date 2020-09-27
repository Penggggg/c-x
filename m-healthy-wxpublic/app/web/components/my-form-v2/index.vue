<template>
    <div class="c-my-form-v2">
        <!-- 表单中的一行 -->
        <mu-flex
            fill
            :key="k"
            justify-content="start"
            v-for="(formLine, k) in meta"
        >
            <!-- 每行中的单个表单元 -->
            <mu-flex
                    fill
                    :key="kk"
                    v-for="(formItem, kk) in formLine"
                >
                <!-- 单选 -->
                <div
                    class="radio-block"
                    v-if="formItem.type === 'radio'"
                >
                    <div class="content">
                        <span class="title">
                            {{ formItem.label }}
                        </span>
                        <mu-radio
                            :key="kk"
                            :disabled="disabled || formItem.disabled"
                            :value="option.value"
                            :label="option.label"
                            v-for="(option, kk) in formItem.options"
                            v-model="formData[ formItem.key ]"
                            @change="formItem.onChange"
                        />
                    </div>
                    <!-- <p class="error-tips">
                        {{ errData[ formItem.key ]}}
                    </p> -->
                </div>
                <!-- 多选框 -->
                <div
                    class="check-box-block"
                    v-if="formItem.type === 'checkbox'"
                >
                    <div class="content">
                        <span class="title">
                            {{ formItem.label }}
                        </span>
                        <div>
                        <mu-checkbox
                            :key="kk"
                            :disabled="disabled"
                            :value="option.value"
                            :label="option.label"
                            v-for="(option, kk) in formItem.options"
                            v-model="formData[ formItem.key ]"
                            @change="formItem.onChange"
                        />
                        </div>
                    </div>
                    <!-- <p class="error-tips">
                        {{ errData[ formItem.key ]}}
                    </p> -->
                </div>
                <!-- input类型 -->
                <mu-text-field
                    :color="formItem.hasOwnProperty('color')?formItem.color:''"
                    full-width
                    label-float
                    @focus="onFocus"
                    @blur="onBlur"
                    :disabled="disabled || formItem.disabled"
                    :label="formItem.label"
                    :help-text="formItem.tips"
                    :error-text="errData[ formItem.key ]"
                    v-if="formItem.type === 'input'"
                    v-model="formData[ formItem.key ]"
                />
                <!-- number类型 -->
                <mu-text-field
                    full-width
                    label-float
                    type="number"
                    :color="formItem.hasOwnProperty('color')?formItem.color:''"
                    @blur="onBlur"
                    @focus="onFocus"
                    :disabled="disabled || formItem.disabled"
                    :label="formItem.label"
                    :help-text="formItem.tips"
                    :error-text="errData[ formItem.key ]"
                    v-if="formItem.type === 'number'"
                    v-model="formData[ formItem.key ]"
                />
                <!-- 加密input类型 -->
                <encryption-input
                    full-width
                    label-float
                    @focus="onFocus"
                    @blur="onBlur"
                    :disabled="disabled || formItem.disabled"
                    :label="formItem.label"
                    :help-text="formItem.tips"
                    :encryptions="formItem.encryptions"
                    :error-text="errData[ formItem.key ]"
                    v-if="formItem.type === 'encryption'"
                    v-model="formData[ formItem.key ]"
                />
                <!-- select类型 -->
                <mu-select
                    full-width
                    label-float
                    :disabled="disabled || formItem.disabled"
                    :label="formItem.label"
                    :help-text="formItem.tips"
                    :error-text="errData[ formItem.key ]"
                    v-if="formItem.type === 'select'"
                    v-model="formData[ formItem.key ]"
                    @change="formItem.onChange || defaultFormChange"
                >
                    <mu-option
                        :key="kkk"
                        :label="opt.label"
                        :value="opt.value"
                        v-for="(opt, kkk) in formItem.options"
                    />
                </mu-select>
                <!-- date类型 -->
                <mu-date-input
                    no-display
                    type="date" 
                    container="dialog"
                    :disabled="disabled || formItem.disabled"
                    v-if="formItem.type === 'date'"
                    :error-text="errData[ formItem.key ]"
                    v-model="formData[ formItem.key ]"
                    :label="formItem.label"
                    label-float
                    full-width
                />
                <!-- datetime类型 -->
                <mu-date-input
                    type="dateTime" 
                    container="dialog"
                    :disabled="disabled || formItem.disabled"
                    v-if="formItem.type === 'dateTime'"
                    :error-text="errData[ formItem.key ]"
                    v-model="formData[ formItem.key ]"
                    :label="formItem.label"
                    label-float
                    full-width
                />
                <!-- date2类型 -->
                <div
                    class="my-date-block"
                    @click="showdate2Obj[ formItem.key ] = true"
                    :class="{ 'content': formData[ formItem.key ], 'error': errData[ formItem.key ] }"
                    v-if="formItem.type === 'date2'"
                >
                    {{
                        formData[ formItem.key ] ?
                            '' : formItem.label
                    }}
                    {{ formData[ formItem.key ] ?
                        transferDate( formData[ formItem.key ]) :
                        ''
                    }}
                    <span class="my-date-tips" v-if="formData[ formItem.key ]">
                        {{ formItem.label }}
                    </span>
                    <span class="error-tt" v-if="errData[ formItem.key ]">
                        {{ errData[ formItem.key ] }}
                    </span>
                </div>
                <van-popup position="bottom" v-model="showdate2Obj[ formItem.key ]" v-if="formItem.type === 'date2'">
                    <van-datetime-picker
                        type="date"
                        @cancel="showdate2Obj[ formItem.key ] = false"
                        :min-date="new Date('1900/1/1')"
                        @confirm="val => onDateChange( val, formItem.key )"
                        :value="formData[ formItem.key ] || new Date( )"
                    />
                </van-popup>
                <!-- 验证码类型 -->
                <div
                    class="verify-block"
                    v-if="formItem.type === 'verifycode'"
                >
                    <mu-text-field
                        full-width
                        label-float
                        :label="formItem.label"
                        :help-text="formItem.tips"
                        @focus="onFocus"
                        @blur="onBlur"
                        type="number"
                        :color="formItem.color || ''"
                        :disabled="disabled || formItem.disabled"
                        :error-text="errData[ formItem.key ]"
                        v-model="formData[ formItem.key ]"  
                    />
                    <div class="btn-container">
                        <countdown-btn
                            :start="startCount"
                            @click="sendVerify"
                            :color="formItem.color"
                            :border="formItem.border"
                            :save-key="formItem.saveKey"
                        >
                            {{ formItem.btnLabel || '发送' }}
                        </countdown-btn>
                    </div>
                </div>
            </mu-flex>
            <!-- slot 表单底部 -->
        </mu-flex>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import CountdownBtn from '../countdown-btn/index.vue';
import EncryptionInput from '../encryption-input/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import vanPopup from 'vant/lib/popup';
import datePicker from 'vant/lib/datetime-picker';

/**
 * @description 动态表单
 * 用法一： @change获取表单最新的值
 * 用法二： 通过this.$refs.xxx.getData( key?: string ) 获取现在的表单值，或指定的单项值
 * 用法三：@blur
 * 用法三：@focus
 * 用法五：:disabled="x"
 * 用法六：this.$refs.xxx.set( obj: {[ key: string]: any }) 进行表单值的设置
 * 特性一： 支持onChange的时候进行表单校验
 * 特性二： 支持延迟的value
 * 特性三： 支持延迟的options
 * 特性四： 通过@focus、@blur事件，处理特殊场景
 * todo 单个formItem的校验规则数组顺序乱了
 */
@Component({
    components: {
        CountdownBtn,
        EncryptionInput,
        'van-popup': vanPopup,
        'van-datetime-picker': datePicker
    }
})
export default class MyFormV2 extends Vue {

    /** 表单数据源 */
    @Prop({ required: true })
    private meta!: C.MyForm.meta;

    @Prop({ default: false })
    private disabled!: boolean;

    @Prop({ default: () => {},required: false })
    private initializedData!:  {
        [ key: string ]: string | number | Date | string[ ] | boolean | undefined
    };

    /** 展示日期 */
    private showdate2 = false;

    /** 展示第二类日期 */
    private showdate2Obj = {

    };

     /** 开始验证码计时 */
    private startCount = false;

    /** 表单数据 */
    private formData: {
        [ key: string ]: string | number | Date | string[ ] | boolean | undefined
    } = { };

    /** 上一次的表单数据 */
    private oldFormData: {
        [ key: string ]: string | number | Date | string[ ] | boolean | undefined
    } = { };

    /** 表单的错误列表 */
    private errData: {
        [ key: string ]: string
    } = { };

    /** 首次change不需要emit、校验 */
    private initBlock = true;

    /** 默认change事件 */
    private defaultChange() {

    }

    /** 设置时间 */
    private onDateChange( val, key ) {
        this.formData = Object.assign({ }, this.formData, {
            [ key ]: val
        });
        // this.showdate2 = false;
        this.showdate2Obj = Object.assign({ }, this.showdate2Obj, {
            [ key ]: false
        });
    }

    @Watch('meta', { deep: true })
    onFormMetaChange( val ) {
        this.dealFormData( );
    }

    @Watch('initializedData', { deep: true, immediate: false})
    onForminitalChange( val ) {
       this.initializedData  && (this.formData = this.initializedData);
    }

    /**
     * onChange的时候进行表单校验
     * 旧表单数据的保存（因为这里框架有bug，watch一个obj，新旧值居然是一样的）
     */
    @Watch('formData', { deep: true })
    onFormChange( val, old ) {

        if ( this.initBlock ) { 
            return this.initBlock = false;
        }

        const changedFields = Object.keys( val ).filter( formItemKey => {
            return val[ formItemKey ] !== this.oldFormData[ formItemKey ];
        });
        
        if ( changedFields.length > 0 ) {
            this.$emit('change', val );
        }
        
        changedFields.map( this.validateItem );
        this.oldFormData = Object.assign({ }, val );
    }

    private defaultFormChange() {}

    /**
     * 校验某个表单元，并增加或清楚错误信息
     */
    private validateItem( key: string ) {
        let isExistedErr!: boolean;
        const currentLine = this.meta.filter( 
            formLine => formLine.find(
                formItem => formItem.key === key
            )
        );
        const currentFormItemMeta = currentLine[ 0 ].find(
            formItem => formItem.key === key
        );

        if ( !!currentFormItemMeta && !!currentFormItemMeta.rules ) {
            isExistedErr = currentFormItemMeta.rules.some( rule =>{
                const result = rule.validate( this.formData[ key ], this.formData );
                if ( !result ) {
                    this.errData = Object.assign({ }, this.errData, {
                        [ key ]: rule.message
                    });
                } else {
                    delete this.errData[ key ];
                }
                return !result;
            });
        }
        return !isExistedErr;
    }

    /** 初始化本地的state.formData */
    private dealFormData( ) {
        let obj = Object.assign({ }, this.formData ); 
        this.meta.map( formLine => {
            formLine.map( formItem => {

                obj = Object.assign({ }, obj, {
                    [ formItem.key ]: this.formData[ formItem.key ] || formItem.value
                });

                if ( formItem.type === 'date2' ) {
                    this.showdate2Obj = Object.assign({ }, this.showdate2Obj, {
                        [ formItem.key ]: this.showdate2Obj[ formItem.key ] || false
                    })
                }

                if ( formItem.type === 'checkbox' ) {

                    obj[formItem.key] = formItem.value ? formItem.value : [];
                }

            });
        });
        // 这里有点奇怪，需要触发formData的set，表单才能更新
        this.formData = obj;

    }

    /** 验证码发送 */
    private sendVerify( ) {

        const currentLine = this.meta.filter( 
            formLine => formLine.find(
                formItem => formItem.type === 'verifycode'
            )
        );
        const currentFormItemMeta = currentLine[ 0 ][ 0 ];

        const phoneData = this.getData( currentFormItemMeta.phonekey );
        let sms: any = undefined;
        if ( !!currentFormItemMeta.smsCountryKey ) {
            const smsData = this.getData( currentFormItemMeta.smsCountryKey );
            if ( !smsData.result ) {
                return this.$toast.error('请选择区号');
            }
            sms = smsData.data;
        }

        if ( !phoneData.result ) {
            return this.$toast.error('请准确填写手机号码');
        }

        this.http$.post<Api.post.verifyCode>({
            url: '/api/common/verifycode',
            data: {
                phone: phoneData.data,
                internationalType: sms
            }
        }, {
            loadMsg: '发送中...',
            successMsg: '验证码发送成功'
        }).then( req => {
            const { status } = req;
            if ( status !== 200 ) { return; }
            this.startCount = true;
        });
    }

    /** 外部获取表单数据的接口 */
    public getData( key?: string ) {
        return !key ? 
                this.validate( ) :
                {
                    data: this.formData[ key ],
                    result: this.validateItem( key )
                }
    }
    
    /** 外部清空表单数据的接口 */
    public reset( ) {
        this.errData = { };
        this.formData = { };
        this.oldFormData = { };
    } 

    /** 外部设置表单值的接口 */
    public set( obj: object ) {
        let temp = { };
        Object.keys( obj ).map( key => {
            temp[ key ] = obj[ key ];
        })
        this.formData = Object.assign({ }, this.formData, temp );
    }

    /** 外部进行表单整体校验的接口 */
    public validate( ) {
        const validateItemResult = Object.keys( this.formData ).map( this.validateItem );
        return {
            data: this.formData,
            result: !validateItemResult.some( x => !x )
        }
    }

    /** 文本框聚焦事件 */
    private onFocus( ) {
        this.$emit('focus');
    }

    /** 文本框失焦事件 */
    private onBlur( ) {
        this.$emit('blur');
    }

    /** 转化日期 */
    private transferDate( d: Date ) {
        const year = d.getFullYear( );
        const month = d.getMonth( ) + 1;
        const date = d.getDate( );
        return `${year}-${month}-${date}`;
    }

    mounted( ) {
        this.initializedData  && (this.formData = this.initializedData);
        this.dealFormData( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
<style lang="less">
@import '~vant/lib/popup/index.css';
@import '~vant/lib/picker/index.css';
</style>
<style lang="less">
ul {
    padding-left: 0 !important;

    li {
        list-style: none !important;
    }
}

.my-date-block {

    color: rgba(0,0,0,0.4);
    width: 100%;
    font-size: 14px;
    position: relative;
    padding: 20px 0 10px 0;

    .my-date-tips {
        font-size: 12px;
        position: absolute;
        left: 0;
        top: 0px;
        color: rgba(0,0,0,0.4);
    }

    .error-tt {
        font-size: 12px;
        position: absolute;
        left: 0;
        bottom: -20px;
        color: red;
    }
}

.my-date-block.error:after {
    background: red;
}

.my-date-block.content {
    color: #666;
}

.my-date-block:after {
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;;
    content: '';
    background: rgba(0,0,0,0.10);
    position: absolute;
}
</style>


