<template>
    <div class="c-active-tab">

        <!-- tab栏 -->
        <div
            class="tab-block"
            :class="{ fixed: fixed }"
        >
            <mu-tabs
                full-width
                :color="color"
                :inverse="inverse"
                :value.sync="active"
                :text-color="textColor"
                :indicator-color="indicatorColor"
                @change="changeCallBack"
            >
                <mu-tab
                    :key="k"
                    active-class="active"
                    v-for="(item, k) in meta"
                >
                    {{ item.tab }}
                </mu-tab>
            </mu-tabs>
        </div>

        <!-- 动态组件 -->
        <div
            class="container-block"
            :class="{ fixed: fixed }"
        >
            <keep-alive>
                <component
                    v-bind="aditionalProps"
                    v-bind:is="activeComponent"
                />
            </keep-alive>
        </div>

    </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/**
 * @description 动态tab组件
 * 特性一：tab数量和页面可配置
 * 特性二：页面刷新会跳转到上次的tab页面
 * 特性三：tab间为keep-alive，会保留切页前后的数据
 * ! 使用前，必须全局注册tab底下的目标组件
 */
@Component({})
export default class ActiveTab extends Vue {
  /** 是否固定在顶部 */
  @Prop({ default: false })
  fixed!: boolean;

  /** muse-ui-tab的文字颜色 */
  @Prop()
  color!: string;

  /** muse-ui-tab的文字颜色 */
  @Prop()
  textColor!: string;

  /** muse-ui-tab的下划线颜色 */
  @Prop()
  indicatorColor!: string;

  /** 传入的组件列表 */
  @Prop({ required: true })
  meta!: C.ActiveTab.meta;

  /** muse-ui-tab的反转 */
  @Prop({ default: false })
  inverse!: boolean;

  /** 传递给动态组件的props */
  @Prop({ type: Object, required: false })
  aditionalProps!: object;

  /** tab切换回调函数 */
  @Prop({ type: Function, default: () => {} })
  changeCallBack!: () => void;

  /** tab */
  private active = 0;

  /** 当前活动的组件 */
  get activeComponent() {
    return this.meta[this.active].component;
  }

  /** 点击tab，则replace histroy */
  @Watch("active")
  onTab(tab) {
    let query$ = '';
    delete this.$route.query['tab'];
    Object.keys( this.$route.query )
        .map( key => query$ += `${key}=${this.$route.query[ key]}&`)
    this.$router.replace(`${this.$route.path}?${query$}tab=${tab}`);
  }

  /** watch history tab */
  @Watch("$route", { deep: true })
  onAnyChange(route) {
    const { tab } = route.query;
    this.active = Number(tab);
    this.onActiveChange( );
  }

  /** 广播active */
  private onActiveChange( ) {
      this.$emit('change', this.active );
  }

  /** 初始化state */
  private initState() {
    let query$ = '';
    const { tab } = this.$route.query;
    const current = tab ? Number(tab) : 0;
    this.active =current
    this.onActiveChange( );

    delete this.$route.query['tab'];
    Object.keys( this.$route.query )
        .map( key => query$ += `${key}=${this.$route.query[ key]}&`)

    this.$router.replace(`${this.$route.path}?${query$}tab=${current}`);
    // if (!tab) {
    //   this.$router.replace(`${this.$route.path}?tab=0`);
    // }
  }

  mounted() {
    this.initState();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

