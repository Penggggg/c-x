<template>
    <a
        color="success"
        class="c-countdown-btn"
        @click="clickHandler"
        :disabled="counting"
        :class="{ disabled: counting, border: border }"
        :style="{ color: color, border: '1px solid ' + color }"
    >
        <slot v-if="!counting"></slot>
        <template v-else > 
            {{ countingSecond }}秒
        </template>
    </a>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
/**
 * @description 倒计时按钮
 * 用法一：@click 增加点击事件
 * 用法二：<countdown-btn :start="start" > 开启计时
 * 用法三：<countdown-btn saveKey="my-save-key" > 区别多个到计时按钮
 * 用法四：<countdown-btn :time="6000" > 指定倒计时时间
 */
@Component({ })
export default class CountDownBtn extends Vue {

    /** ls - 前缀 */
    private readonly preKey = 'countDown'

    /** 存时间的key */
    @Prop({ required: true }) saveKey!: string | number;

    /** 开始计时 */
    @Prop({ required: true, type: Boolean }) start!: boolean;

    /** 倒计时 */
    @Prop({ type: Number, default: 60 * 1000 }) time!: number;

    /** 颜色 */
    @Prop({ type: String, default: '#4caf50' }) color!: string;

    /** 是否边框 */
    @Prop({ type: Boolean, default: true }) border!: boolean;

    /** 倒数状态 */
    private counting = true;

    /** 倒计时钟 */
    private countingSecond = 0;

    @Watch('start')
    onStart( val ) {
        if ( !val || this.counting ) { return; }
        const originSave = this.getItem( this.preKey );
        const saveTarget = Object.assign({ }, originSave || { }, {
            [ this.saveKey ]: this.time
        });
        this.setItem( this.preKey, saveTarget );
        this.countTime( this.time );
    }

    /** ls -setItem */
    private setItem( key, val ) {
        localStorage.setItem(
            key,
            typeof val === 'string' ? 
                val :
                JSON.stringify( val )
        );
    }

    /** ls - getItem */
    private getItem( key ) {
        const result = localStorage.getItem( key );
        try {
            return !!result ?
                        JSON.parse( result ) :
                        null
        } catch( e ) {
            return null;
        }
    }

    /** 获取ls时间 */
    private getCurrentTime( ) {
        const saveData = this.getItem( this.preKey );
        if ( !saveData || ( saveData && !saveData[ this.saveKey ])) {
            this.counting = false;
            return;
        }
        const currentTime = saveData[ this.saveKey ];
        if ( currentTime ) {
            this.countTime( currentTime );
        } else {
            this.counting = false;
        } 
    }

    /** 倒计时 */
    private countTime( time ) {

        let sencond = Math.ceil( time / 1000 );
        const clock = setInterval(( ) => {

            this.counting = true;
            this.countingSecond = sencond--;

            const originSave = this.getItem( this.preKey );
            const saveTarget = Object.assign({ }, originSave || { }, {
                [ this.saveKey ]: sencond * 1000
            });
            this.setItem( this.preKey, saveTarget );

            if ( this.countingSecond === 0 ) {

                this.counting = false;
                this.countingSecond = 0;
                
                const originSave = this.getItem( this.preKey );
                if ( originSave ) {
                    delete originSave[ this.saveKey ]
                    this.setItem( this.preKey, originSave );
                }
                clearInterval( clock );
            }
        }, 1000 );
    }

    /** 点击 */
    private clickHandler( e ) {
        if ( this.counting ) { return; }
        this.$emit('click', e );
    }

    private init() {
        this.counting = false;
        this.countingSecond = 0;
    }

    mounted( ) {
        // this.getCurrentTime( );
        this.init();
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

