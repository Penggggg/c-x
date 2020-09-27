<template>
  <div class="personal">
    <div class="head-card"
      @click="handleLinkTo('/account/personal')">
      <div class="info">
        <div class="avatar">
          <smart-avatar :size="70"
            :img="account$.wx.data.avatar" />
        </div>
        <div>
          <p class="name">{{account$.wx.systemUser.name}}</p>
          <p class="extra-detail">{{account$.wx.systemUser.email}}</p>
        </div>
      </div>
      <div class="to-detail">
        <mu-button icon>
          <mu-icon size="36"
            value="keyboard_arrow_right"></mu-icon>
        </mu-button>
      </div>
    </div>
    <div class="list">
      <mu-list>
        <mu-list-item avatar
          button
          :ripple="false"
          :key="index"
          v-for="(item , index) in list"
          @click="item.event">
          <mu-list-item-action>
            <!-- <mu-avatar> -->
            <mu-icon :value="item.leftIcon"></mu-icon>
            <!-- </mu-avatar> -->
          </mu-list-item-action>
          <mu-list-item-content>
            <mu-list-item-title>{{item.text}}</mu-list-item-title>
          </mu-list-item-content>
          <mu-list-item-action>
            <mu-button icon>
              <mu-icon :value="item.rightIcon"></mu-icon>
            </mu-button>
          </mu-list-item-action>
        </mu-list-item>
      </mu-list>
    </div>
    <!-- <Main/> -->
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Main from "../main/index.vue";
import SmartAvatar from "../../../components/smart-component/index.vue";

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: { Main, SmartAvatar }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

  private list = [
    {
      leftIcon: "face",
      text: "我的家属成员",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/account/family-members");
      }
    },
    {
      leftIcon: "chrome_reader_mode",
      text: "我的健康卡",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/health-card/my");
      }
    },
    {
      leftIcon: "format_list_bulleted",
      text: "我的订单",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/my-order/list");
      }
    },
    // {
    //   leftIcon: 'aspect_ratio',
    //   text:'我的优惠券',
    //   rightIcon:'keyboard_arrow_right',
    //   event:() => {
    //     this.handleLinkTo('');
    //   }
    // },
    {
      leftIcon: "poll",
      text: "我的体征",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/body-sign/list");
      }
    },
    {
      leftIcon: "library_books",
      text: "我的报告",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/record/body-check");
      }
    },
    {
      leftIcon: "computer",
      text: "关于公众号",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        this.handleLinkTo("/appointment/about-program");
      }
    },
    {
      leftIcon: "link",
      text: "了解视源",
      rightIcon: "keyboard_arrow_right",
      event: () => {
        window.location.href = "http://syjk.baiduux.com/h5/yulan01.html";
      }
    }
  ];

  private handleLinkTo(url) {
    this.$router.push(url);
  }

  mounted() {}
}
</script>
<style lang="less">
@import "./index.less";
</style>
