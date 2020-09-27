<template>
    <transition name="fade-c-drawer" v-if="show">
        <div class="c-my-drawer">
            <!-- 标题 -->
                <my-header
                    :isfixed="true"
                >
                <span
                    slot="left"
                    v-if="showIcon"
                    @click="backFromBtn"
                >
                    <mu-icon
                        size="25"
                        color="green"
                        value="keyboard_arrow_left"
                    />
                </span>
                <span slot="center">
                    {{ title }}
                </span>
            </my-header>
            <!-- 内容 -->
            <slot></slot>
        </div>
    </transition>
</template>
<script lang="ts">
import MyHeader from '../../components/my-header/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

/**
 * @description 支持历史返回、物理返回的全窗体弹层
 * 用法：<my-drawer :show.sync="theShow" title="sad" >xxxx</my-drawer>
 * 特性一：允许嵌套使用
 * 特性二：通过$refs.xx.close()关闭
 */
@Component({
    components: {
        MyHeader
    }
})
export default class MyDrawer extends Vue {

    /** 是否展示 */
    @Prop({ type: Boolean, required: true }) show!: boolean

    /** 标题 */
    @Prop({ default: '' }) title!: string

    /** 是否展示后退图标 */
    @Prop({ default: true }) showIcon!: boolean;

    /** ls存储的前缀 */
    private readonly pre = 'hzpDrawer';

    /** 标示当前弹窗的ID */
    private readonly id$ = Math.floor( Math.random( ) * 99999 );

    /** 返回是否来自于物理返回键 */
    private backFromHistory = false;

    /**
     * 监听
     * 支持物理键、历史返回
     * -------展开------
     * 插入ls，辨识各个drawer
     * 防止窗体滑动
     */
    @Watch('show')
    onShow( show ) {
        if ( show ) {
            const origin = this.localStorageGet( this.pre );
            origin.push( this.id$ );
            this.localStorageSet( origin );
            document.body.style.overflow = 'hidden';
            (history as any).pushState( null, undefined, location.href );
            window.addEventListener('popstate', this.onStopHistoryBack );

        } else {
            const origin = this.localStorageGet( this.pre );
            if ( this.id$ === origin[ origin.length -1 ]) {
                setTimeout(( ) => {
                    origin.pop( );
                    this.localStorageSet( origin );
                }, 100 );
            }
            document.body.style.overflow = 'auto';
            window.removeEventListener('popstate', this.onStopHistoryBack );
            this.checkHistory( );
        }
    }

    /** 检查物理返回键 */
    private checkHistory( ) {
        if ( !this.backFromHistory ) {
            history.go( -1 );
        }
    }

    /** 关闭外层 */
    private onBack( ) {
        this.$emit('update:show', false );
    }

    /** 历史返回
     *  辨识是否为自己的drawer，再去关闭
     */
    private onStopHistoryBack( ) {
        this.beforeOnBack(( ) => {
            this.backFromHistory = true;
        });
    }

    /** 左上角返回
     *  辨识是否为自己的drawer，再去关闭
     */
    private backFromBtn( ) {
        this.beforeOnBack(( ) => {
            this.backFromHistory = false;
        });
    }

    /** 返回前的操作
     *  另外drawer栈需要延迟处理，避免一些特殊情况
    */
    private beforeOnBack( cb ) {
        const origin = this.localStorageGet( this.pre );
        if ( this.id$ === origin[ origin.length -1 ]) {
            setTimeout(( ) => {
                origin.pop( );
                this.localStorageSet( origin );
            }, 100 );
            this.onBack( );
            cb && cb( );
        }
    }

    /** 暴露在外的close方法 */
    public close( ) {
        this.backFromBtn( );
    }

    /** ls存储 */
    private localStorageSet( val ) {
        localStorage.setItem( this.pre,
            typeof val !== 'string' ?
                JSON.stringify( val ) :
                val
        );
    }

    /** ls读 */
    private localStorageGet( key ) {
        const meta = localStorage.getItem( key );
        return meta ?
                JSON.parse( meta ) :
                [ ];
    }

    created( ) {
        try {
            this.localStorageSet([ ]);
        } catch ( e ) { }
    }
}
</script>
<style lang="less">
@import './index.less';
</style>


