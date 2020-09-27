<template>
    <div class="c-wechat-nav">

        <!-- 一级菜单 -->
        <div class="level-one">
            <div
                :key="k"
                class="nav-item"
                v-for="(navitem, k) in navs"
                @click="handler( navitem, k )"
            >
                {{ navitem.label }}
            </div>
        </div>
        
        <!-- 二级菜单 -->
        <div class="level-two">
            <div
                :key="k"
                class="nav-item2"
                v-for="(navitem, k) in navs"
                :class="{ line: navitem.children && navitem.children.length > 0, hide: !openArr[ k ] }"
                :style="{ marginTop:  navitem.children ? `${-52 * navitem.children.length}px` : 0 }"
            >
                <div
                    :key="kk"
                    class="nav-item-child"
                    v-for="(item, kk) in navitem.children"
                >   
                    {{ item.label }}
                </div>
            </div>
        </div>
        
    </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

/**
 * @description
 * 底部导航栏，样式跟微信公众号下方的一致
 */
@Component({
    components: {
    }
})
export default class C extends Vue {

    @Prop({ type: Array, default: ( ) => [ ]})
    navs!: C.WechatNav.meta;

    /** 展开状态 */
    openArr: boolean[ ] = [ ];

    /** 地址跳转、打开二级菜单 */
    private handler( item: C.WechatNav.meta[ 0 ], k: number ) {
        if ( item.children && item.children.length > 0 ) {
            const temp = [ ...this.openArr ];
            const origin = temp[ k ];
            temp.splice( k, 1, !origin );
            this.openArr = temp;
        } else if ( item.url ) {
            this.$router.push( item.url );
        }
    }

    mounted( ) {
        this.openArr = this.navs.map( x => x.open || false );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>


