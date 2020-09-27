<template>
    <!-- carousel跑马灯 -->
    <div class="carousel-container">
        <mu-carousel 
            :active="configs.active"
            :cycle="configs.cycle"
            :interval="configs.interval"
            :transition="configs.transition"
            :hide-indicators="configs.hideIndicators"
            :hide-controls="configs.hideControls"
            :class="configs.className"
            @change="changeCallBack"
        >
            <mu-carousel-item :key="k" v-for="(item, k) in configs.imgList">
                <img :src="item">
            </mu-carousel-item>
        </mu-carousel>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/**
 * @description 跑马灯
 * 特性：加载跑马灯图片
 * 用法：<my-carousel :configs="configs"></my-carousel>
 */
@Component({})
export default class MyCarousel extends Vue {
  /** carousel配置
    * 
        参数	介绍	类型	可选值	默认值
        active	激活的下标	Number	—	0
        cycle	是否周期性自动切换	Boolean	—	true
        interval	切换时间间隔	Number	—	6000
        transition	过渡动画效果	String	slide / fade	slide
        hide-indicators	是否隐藏指示器	Boolean	—	false
        hide-controls	是否隐藏控制器	Boolean	—	false

        className  自定义样式
        imgList: [] 轮播的图片 数组
     */
  @Prop({ type: Object, required: true })
  configs!: Object;

  /** carousel改变回调函数 */
  @Prop({ type: Function, default: () => {} })
  changeCallBack!: () => void;
}
</script>
<style lang="less">
@import "./index.less";
</style>



