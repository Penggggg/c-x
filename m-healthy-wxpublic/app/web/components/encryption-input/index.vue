<template>
    <div class="c-encryption-input">
        <mu-text-field
            full-width
            label-float
            @focus="onFocus"
            @blur="onBlur"
            :label="label"
            v-model="value$"
            :disabled="disabled"
            :help-text="helpText"
            :error-text="errorText"
        />
        <span
            v-if="inputState === 0"
            class="encryption-text"
        >
            {{ encryptionViewValue }}
        </span>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Model } from 'vue-property-decorator';

enum inputState {
    bluring,
    focusing
}

/**
 * @description 密文输入框，在blur状态时选择打星号，在focus一开始，全清空
 */
@Component({ })
export default class EncryptionInput extends Vue {

    /** muse-input的props */
    @Prop({ default: false }) disabled!: boolean;

    /** muse-input的props */
    @Prop( ) label!: string;

    /** muse-input的props */
    @Prop( ) helpText!: string;

    /** muse-input的props */
    @Prop( ) errorText!: string;

    /** 密文星星的下标位置 */
    @Prop({ default: ( ) => [ ]}) encryptions!: [ number, number ][ ];

    @Model('change') value;

    /** 文本框状态 */
    private inputState: inputState = inputState.bluring;

    get value$( ): string {
        return this.value;
    }

    set value$( val: string ) {
        this.$emit('change', val)
    }

    /** 加密视图文本 */
    get encryptionViewValue( ) {
        if ( !this.value$ ) { return ''; }

        const sortedStarts = this.encryptions.sort(( x, y ) => x[0] - y[0]);
        const getStarts = ( count: number ) => {
            let starts = '';
            for( let i = 0; i < count; i++ ) {
                starts += '*';
            }
            return starts;
        }

        let result = '';
        let startIndex = 0;

        sortedStarts.map( sortedStart => {
            // 非加密
            result += this.value$.substring( startIndex, sortedStart[ 0 ]);
            // 加密
            result += getStarts( sortedStart[ 1 ] - sortedStart[ 0 ] + 1 );
            // 重置
            startIndex = sortedStart[ 1 ] + 1;
        });
        // 补上最后一截
        result += this.value$.substring( sortedStarts[ sortedStarts.length - 1 ][ 1 ] + 1 );

        return result;
    }

    /** 文本框聚焦事件 */
    private onFocus( ) {
        this.$emit('focus');
        this.value$ = '';
        this.inputState = inputState.focusing;
    }

    /** 文本框失焦事件 */
    private onBlur( ) {
        this.$emit('blur');
        this.inputState = inputState.bluring;
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
