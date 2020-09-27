<template>
  <div>
    <active-tab :fixed="true"
      :meta="tabMeta"
      :inverse="true"
      indicator-color="#16CCB9"
      @change="outter" />
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import ActiveTab from "../../../components/active-tab/index.vue";
import bodyCheck from '../body-check/index.vue'
import chemicalExamination from '../chemical-examination/index.vue'
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

Vue.component('chemical-examination', chemicalExamination);
Vue.component('body-check', bodyCheck);

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: { ActiveTab }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

  /** tab */
  private tabMeta: C.ActiveTab.meta = [
    {
      tab: "体检报告",
      component: 'body-check'
    },
    {
      tab: "门诊检查报告",
      component: 'chemical-examination'
    }
  ];

  private outter() {
  }
  mounted() {
    // this.fetchDetail( this.$route.params.id );
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
