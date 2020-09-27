<template>
  <div class="horizontal-list">

    <ul class="list"
      @click="handleClick">
      <li :key='index'
        :data-index="index"
        :class="currentSelect === index && 'selected'"
        v-for="(item , index) in meta">{{item.content}}</li>
    </ul>

  </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/**
 * @description 横向滚动列表
 */
@Component({})
export default class ActiveTab extends Vue {
  /** 是否固定在顶部 */
  @Prop({ default: 0 })
  select!: number;

  private currentSelect = 0;

  private handleClick(e) {
    this.currentSelect = Number(e.target.getAttribute("data-index"));
    this.change(this.currentSelect);
  }

  /** 传入的组件列表 */
  @Prop({ required: true })
  meta!: C.HorizontalList.meta;

  /** tab切换回调函数 */
  @Prop({ type: Function, default: select => {} })
  change!: (select) => void;

  /** tab */
  private active = 0;

  @Watch("select") 
  onSelectChange(value){
    this.currentSelect = value;
  }
  // /** 当前活动的组件 */
  // get activeComponent() {
  //   return this.meta[this.active].component;
  // }

  // /** 点击tab，则replace histroy */
  // @Watch("active")
  // onTab(tab) {
  //   this.$router.replace(`${this.$route.path}?tab=${tab}`);
  // }

  // /** watch history tab */
  // @Watch("$route", { deep: true })
  // onAnyChange(route) {
  //   const { tab } = route.query;
  //   this.active = Number(tab);
  //   this.onActiveChange( );
  // }

  // /** 广播active */
  // private onActiveChange( ) {
  //     this.$emit('change', this.active );
  // }

  // /** 初始化state */
  // private initState() {
  //   const { tab } = this.$route.query;
  //   this.active = tab ? Number(tab) : 0;
  //   this.onActiveChange( );

  //   if (!tab) {
  //     this.$router.replace(`${this.$route.path}?tab=0`);
  //   }
  // }

  mounted() {
    this.currentSelect = this.select;
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

