<template>
    <div
        class="c-text-switch"
        :style="{ background: active === 0 ? this.color : this.activecolor }"
    >
        <div
            @click="onTab"
            class="text-container"
        >
            <div
                :key="k"
                class="options-text"
                v-for="(item, k) in options"
            >
                {{ item.label }}
            </div>
            <div
                class="switch-round"
                :class="active === 0 ? 'left' : 'right'"
            >
            </div>
        </div>
    </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
    
    }
})
export default class C extends Vue {

    /** 背景颜色 */
    @Prop({ default: '#19b391' }) color!: string;

    @Prop({ default: '#19b391' }) activecolor!: string;

    /** 目前的值 */
    @Prop({ type: String, required: true }) value!: string

    /** 选项，只能有两个 */
    @Prop({ type: Array, required: true }) options!: C.TextSwitch.options

    @Watch('value')
    onChange( val ) {
        this.checkValue( );
    }

    /** 当前下标的位置 */
    private active = 0;

    /** 点击选项 */
    private onTab( ) {
        const target: any = this.options.find( x => x.value !== this.value );
        this.$emit('update:value', target.value );
    }

    /** 根据value改变圆的位置 */
    private checkValue( ) {
        const targetIndex = this.options.findIndex( x => x.value !== this.value );
        this.active = targetIndex;
    }

    mounted( ) {
        this.checkValue( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

