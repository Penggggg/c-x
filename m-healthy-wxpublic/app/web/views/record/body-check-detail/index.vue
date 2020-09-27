<template>
    <div class="p-record-bodycheck-detail my-page">

        <!-- tab -->
        <div>
            <active-tab inverse
                :fixed="true"
                :meta="tabMeta"
                color="#4caf50"
                indicator-color="#4caf50"
                :aditional-props="{ id: '1' }" />
        </div>

        <!-- TODO: 此处是因为影响正式环境，因此不做上线 -->
        <a v-if="medicalNo"
            class="download-btn"
            @click="download">
            下载
        </a>

        <down-load :id="this.$route.params.id" :download="toDownload" :callback="callback"/> 

    </div>
</template>
<script lang="ts">
import ActiveTab from "../../../components/active-tab/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ResultDetail from "../../../container/bodycheck-result-detail/index.vue";
import ResultSummary from "../../../container/bodycheck-result-summary/index.vue";
import DownLoad from "../../../container/download/index.vue";

Vue.component("result-detail", ResultDetail);
Vue.component("result-summary", ResultSummary);

@Component({
  components: {
    ActiveTab,
    DownLoad
  }
})
export default class RecordDetailBodyCheck extends Vue {
  /** 体检编号 */
  private medicalNo: null | string = null;

  private cbFn = () => {};

  /** tab */
  private tabMeta: C.ActiveTab.meta = [
    {
      tab: "总结结论",
      component: "result-summary"
    },
    {
      tab: "报告详情",
      component: "result-detail"
    }
  ];

  /** 拉取体检报告的详情 */
  private fetchDetail(id) {
    this.http$
      .get<Api.get.clinicRecordDetail>(
        {
          url: `/api/record/clinic/${id}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.medicalNo = res.data.medicalNo;
          console.log('结果',this.medicalNo);
        }
      });
  }

  private callback = (fn) => {
    this.cbFn = fn();
  }

  /** 下载 */
  private download = () => {
    this.cbFn();
  }
  /** 下载 */
  private toDownload() {
    // 先拿到xauthtoken
    this.http$
      .get({
        url: "/api/common/client-xauthtoken"
      })
      .then((res: any) => {
        // 再下载
        window.location.href = `/api/record/download?medicalNo=${
          this.medicalNo
        }&x=${res}`;
      });
  }

  mounted() {
    this.fetchDetail(this.$route.params.id);
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>


