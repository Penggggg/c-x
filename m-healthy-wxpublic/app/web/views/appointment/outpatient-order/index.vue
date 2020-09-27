<template>
  <div>
    <active-tab :fixed="true"
      :meta="tabMeta"
      :inverse="true"
      indicator-color="#16CCB9"
      @change="outter" />
    <div v-if="showModal" class="tip-modal">
      <warm-tips :callback="closeModal" >
      <about-program></about-program>
      </warm-tips>
      </div>
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import ActiveTab from "../../../components/active-tab/index.vue";
import selectOutpatient from '../select-outpatient/index.vue'
import selectDoctor from '../select-doctor/index.vue'
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import WarmTips from "../../../components/warm-tips/index.vue";
import aboutProgram from "../about-program/index.vue";

Vue.component('select-outpatient', selectOutpatient);
Vue.component('select-doctor', selectDoctor);

@inject({
  selector: ["account$", "globalStore$","appointment$"]
})
@Component({
  components: { ActiveTab, WarmTips, aboutProgram }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

   /** 是否显示modal */
  private showModal = false;


  /** tab */
  private tabMeta: C.ActiveTab.meta = [
    {
      tab: "科室",
      component: 'select-outpatient'
    },
    {
      tab: "医生",
      component: 'select-doctor'
    }
  ];

  private outter() {
  }

   private getNotNotify() {
        const sessionValue = sessionStorage.getItem("hasShowModal");
        if(!sessionValue) {
          const localValue = localStorage.getItem("notNotify");
          if(!localValue || localValue === 'false'){
            this.fixedBody();
            this.showModal = true;
            sessionStorage.setItem("hasShowModal", "true");
          }
        }

    }

  private closeModal() {
    this.showModal = false;
    this.looseBody();
  }

  private fixedBody() {
    var scrollTop = (document as any).body.scrollTop || (document as any).documentElement.scrollTop;
    document.body.style.cssText += 'position:fixed;top:-' + scrollTop + 'px;';
  }

  //关闭模态框后调用
  private looseBody() {
    var body = document.body;
    body.style.position = 'static';
    const top = body.style.top || '';
    document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
    body.style.top = '';
}

  mounted() {
    this.getNotNotify();
    this.appointment$.order.loadCommonDic()
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
