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
import orderForm from '../order-form/index.vue'
import deptOrderForm from '../dept-order-form/index.vue'
import medicalRecord from '../medical-record/index.vue'
import selectDoctor from '../select-doctor/index.vue'
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

Vue.component('order-form', orderForm);
Vue.component('dept-order-form', deptOrderForm);
Vue.component('medical-record', medicalRecord);

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
      tab: "预约信息",
      component: 'order-form'
    },
    {
      tab: "就诊记录",
      component: 'medical-record'
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
