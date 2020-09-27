<template>
  <div class="main-page">
    <div class="component-group">
      <section v-show='showIndex === "0"'>
        <homePage></homePage>
      </section>
      <section v-show='showIndex === "1"'>
        <lessons></lessons>
      </section>
      <section v-show='showIndex === "2"'>
        <healthCheck></healthCheck>
      </section>
      <section v-show='showIndex === "3"'>
        <bodyCheck></bodyCheck>
      </section>
      <section v-show='showIndex === "4"'>
        <person></person>
      </section>
    </div>
    <!-- 底部导航栏 -->
    
    <div class="bottom-bar">
      <mu-container>
        <mu-bottom-nav ripple="true"
          :value.sync="showIndex"
          @change='handleChangeNav'>
          <mu-bottom-nav-item v-for="(item , index)  in navs"
            :key="index"
            :title="item.title"
            :value="String(index)"
            active-class="active-classs"
            :icon="item.icon"></mu-bottom-nav-item>
        </mu-bottom-nav>
      </mu-container>
    </div>
    
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import homePage from "../home-page/index.vue";
import person from "../person/index.vue";
import knowledge from "../knowledge/index.vue";
import bodyCheck from "../../record/list/index.vue";
import healthCheck from "../../health-check/package/index.vue";
import lessons from "../lesson/index.vue";
import WarmTips from "../../../components/warm-tips/index.vue";
import aboutProgram from "../about-program/index.vue";

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: { homePage , person, bodyCheck, healthCheck, knowledge, WarmTips, aboutProgram, lessons}
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

  /** 底部导航当前位置 */
  private showIndex = '0';

  /** 底部导航菜单配置 */
  private get navs() {
    return [
      {
        title: "首页",
        icon: "home",
        class: ""
        // path: '/appointment/main'
      },
      {
        title: "知识",
        icon: "class",
        class: ""
      },
      {
        title: "优选",
        icon: "stars",
        class: ""
        // path: "/health-check/package?tab=0"
      },
      {
        title: "报告",
        icon: "description",
        class: ""
      },
      {
        title: "我",
        icon: "person",
        class: ""
        // path:'/appointment/person'
      }
    ];
  }

  private handleChangeNav(value) {
    this.showIndex = value;
    // this.$router.replace(`${this.navs[value].path}&tab=0`);
    this.$router.replace(`/appointment/main?nav=${value}&tab=0`);
  }

  @Watch('showIndex')
  onNavChange(val) {
     this.showIndex = this.$route.query.hasOwnProperty('nav') ? this.$route.query.nav : '0';
  }

  mounted() {
    this.$route.query.hasOwnProperty('nav') && (this.showIndex = this.$route.query.nav);
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
