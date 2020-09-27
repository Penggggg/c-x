<template>
    <div
        class="warm-tips-warper"
    >
        <div class="modal">
            <div class="slot">
            <slot></slot>
            </div>
            <div class="btn-group">
                <div class='not-notify' @click="setNotNotify">不再提醒</div>
                <div class="confirm" @click="confirm">确定</div>
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
    // @Prop({ type: String, required: true }) value!: string

    /** 选项，只能有两个 */
    // @Prop({ type: Array, required: true }) options!: C.TextSwitch.options
    /** 选项，只能有两个 */
    @Prop({ required: true }) callback!: () => {}

    @Watch('value')
    onChange( val ) {
        // this.checkValue( );
    }

    private setNotNotify() {
        localStorage.setItem("notNotify", 'true');
        this.callback();
    }

    private confirm() {
        this.callback();
    }

    mounted( ) {
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

