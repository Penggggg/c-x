<template>
    <div class="p-booking-health-card">

        <!-- 头部 -->
        <my-header
            :isfixed="true"
        >
            <span
                slot="left"
                @click="$router.back()"
            >
                <mu-icon
                    value="keyboard_arrow_left"
                />
            </span>
            <span slot="center">
                管理家属成员
            </span>
        </my-header>

        <!-- 选择家庭成员 -->
        <family-selector
            :show.sync="showSelector"
        />        

    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyHeader from "../../../components/my-header/index.vue";
import MyForm from "../../../components/my-form-v2/index.vue";
import FamilySelector from "../../../container/family-member-selector/index.vue";

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    MyForm,
    MyHeader,
    FamilySelector
  }
})
export default class BookingBodyCheck extends Vue {
  /** 家属成员选择 */
  private showSelector = true;

  mounted() {
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
