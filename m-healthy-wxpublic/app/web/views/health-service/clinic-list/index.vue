<template>
  <div class="container-block">
    <div class="m-pay-card" :key="index" v-for="(item , index) in recordList" @click="$router.push(`/health-service/clinic-detail/${item.id}`)">
      <div class="header inline-container">
        <span class="m-title">
          <span class="m-icon-hospital">
            <mu-icon value="stars"></mu-icon>
          </span>
          <span class="m-text-hospital">{{item.deptName}}</span>
        </span>
        <span>{{item.doctorName}}</span>
      </div>
      <div class="content">
        <div class="inline-container small">
          <div>
            就诊时间：{{item.clinicTime | dateformat()}}
          </div>
        </div>
        <div class="inline-container small">
          <div>
            就诊机构：{{item.clinicAgencyName}}
          </div>
        </div>
      </div>
    </div>
    <p class="tips">
                    <span>
                        {{ recordList.length !== 0 ? '没有更多数据了' : '空空如也' }}
                    </span>
                </p>
  </div>
</template>
<script lang="ts">
import ActiveTab from "../../../components/active-tab/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ResultDetail from "../../../container/bodycheck-result-detail/index.vue";
import ResultSummary from "../../../container/bodycheck-result-summary/index.vue";
import * as  moment  from 'moment';

Vue.component("result-detail", ResultDetail);
Vue.component("result-summary", ResultSummary);
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD') {
    return (moment as any)(dataStr).format(pattern)

})

@Component({
  components: {
    ActiveTab
  }
})
export default class RecordDetailBodyCheck extends Vue {
  /** 体检编号 */
  private medicalNo: null | string = null;
  private recordList  = [];
  // private recordList = [{
  //         clinicAgencyId: 'X0123',
  //         clinicAgencyName: '机构',
  //         clinicNumber: '456',
  //         userNumber: 'user123',
  //         userName: '章三',
  //         userAge: 14,
  //         userGender: 'M',
  //         userPhone: 15627273838,
  //         userIdCard: 1234567890,
  //         clinicTime: 1562297000906,
  //         diagnose: '身体还不错啊',
  //         deptName:'口腔洁牙',
  //         deptId: 'sdjhasgdkajs23423456876',
  //         doctorName: '刘思',
  //         doctorId: '878458347983482348298',
  //         srcSystem: 'HMS'
  //     },
  //     {
  //         clinicAgencyId: 'X0456',
  //         clinicAgencyName: '机构',
  //         clinicNumber: '456',
  //         userNumber: 'user123',
  //         userName: '王五',
  //         userAge: 14,
  //         userGender: 'F',
  //         userPhone: 15627273838,
  //         userIdCard: 1234567890,
  //         clinicTime: 1562297000906,
  //         diagnose: '身体还不错啊',
  //         deptName:'口腔洁牙',
  //         deptId: 'sdjhasgdkajs23423456876',
  //         doctorName: '刘思',
  //         doctorId: '878458347983482348298',
  //         srcSystem: 'HMS'
  //     }];

  /** 拉取体检报告的详情 */
  private fetchDetail() {
    this.http$
      .get<any>(
        {
          url: `/api/service/clinic/record/list`,
          params: {
            userId: this.$route.params.id,
            pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.recordList = res.data.dataList;
          // this.medicalNo = res.data.medicalNo;
        }
      });
  }

  /** 下载 */
  private download() {
    // 先拿到xauthtoken
    this.http$
      .get({
        url: "/api/common/client-xauthtoken"
      })
      .then((res: any) => {
        // 再下载
        window.location.href = `/api/hservice/clinic/record/${213456}/download`;
      });
  }

  mounted() {
    this.fetchDetail( );
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>


