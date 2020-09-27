<template>
    <div class="about-program">
        <div class="tip-header">
         <mu-icon class="tips-icon"  value="notifications_none" color="#1FBC9C"></mu-icon>
         <p>温馨提示(tips)</p>
       </div>
       <!-- <div class="mini-tips">
         为了可以在您的使用过程中更好的为您服务，请您阅读以下注意事项。您还可以在关闭后该页面后，通过<span>公众号首页 -> 我 -> 关于公众号</span>中找到我哦 ~
       </div> -->
       <div class="content">
         <div class="item" :key="item.text" v-for="(item , index) in listData">
           <p class="title">{{index+1}}. {{item.title}}</p>
           <p class="text">{{item.text}}</p>
         </div>
       </div>
    </div>
</template>
<script lang="ts">
import { observe, toJS } from "mobx";
import { inject } from "../../../service/inject";
import MyForm from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";

import listData from './config';

/**
 * @description 体检预约记录
 */
@inject({ selector: ["globalStore$", "account$"] })
@Component({
  components: {
    MyForm,
    SktList
  }
})
export default class BookingRecordBodyCheck extends Vue {
  /** 当前选中的预约ID */
  private selectingId = "";

  /** 取消预约的原因 */
  private reason = "";

  private listData = listData;
}
</script>
<style lang="less">
@import "./index.less";
</style>
