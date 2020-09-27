<template>
    <div class="p-chemical-examination-detail my-page">

        <!-- 个人检查信息 -->
        <div class="person-info">
             <div class="header">
                <!-- <mu-icon value="note" class="icon"></mu-icon><span class="text"> {{examResult.clinicName}} </span> -->
                {{examResult.clinicName}}
            </div>
            <div class="content">
                <div class="item">
                <div>姓名：{{examResult.userName}}</div>
                <div>性别：{{
                                        dic.HMS_COMM_SEX.find( x => x.value === examResult.userGender ) ?
                                            dic.HMS_COMM_SEX.find( x => x.value === examResult.userGender ).label :
                                            ''
                                    }}</div>
                <div>年龄：{{examResult.userAge}}</div>
                </div>
                <div class="item" v-if="examResult.reportType === 'EXAM'">
                <div>申请科室： {{examResult.deptName}}</div>
                <div>报告ID： {{examResult.clinicNumber}}</div>
                </div>
                <div class="item" v-if="examResult.reportType === 'EXAM'">
                <div>检查日期： {{examResult.checkTime | dateformat}}</div>
                <div>申请医生： {{examResult.applyDoctorName}}</div>
                </div>
                <div class="item" v-if="examResult.reportType === 'EXAM'">
                <div>报告日期： {{examResult.reportTime | dateformat}}</div>
                <div>报告医生： {{examResult.auditDoctorName}}</div>
                </div>
                <div class="item" v-if="examResult.reportType === 'CHECK'">
                <div>申请科室： {{examResult.deptName}}</div>
                <div>审核时间： {{examResult.auditTime?examResult.auditTime:'' | dateformat}}</div>
                </div>
                <div class="item" v-if="examResult.reportType === 'CHECK'">
                <div>报告时间： {{examResult.reportTime | dateformat}}</div>
                </div>
            </div>
        </div>
        <!-- 检查位置 -->
        <!-- <div class="position" v-if="examResult.reportType === 'CHECK'">
            <div class="header">
                部位
            </div>
            <div class="content">
                <div>{{examResult.checkpoint}}</div>
            </div>
        </div> -->
        <!-- 检查结果 -->
        <div class="suggestion" v-if="examResult.reportType === 'CHECK'">
            <div class="header">
                检查所见
            </div>
            <div class="content">
                <div class="text" :key="item" v-for="(item ) in examResult.checkFind.split('。')" >{{item}}</div>
            </div>
        </div>
        <!--  诊断建议  -->
        <div class="result">
            <div class="header"> 
                 <!-- <mu-icon value="chat_bubble_outline" class="icon"></mu-icon><span class="text">诊断建议 </span> -->
            诊断建议
            </div>
            <div class="content">
                <div>{{examResult.diagnose ? examResult.diagnose : '暂无'}}</div>
            </div>
        </div>
        

        <!-- 异常检查项目 -->
        <div class="unusual-examination" v-if="examResult.reportType === 'EXAM' && this.examResult.reportItemList.filter(i => {return i.target!==1}).length!==0">
            <mu-expansion-panel :zDepth="0"
                :expand="true">
                <div slot="header"
                    class="header"> <mu-icon class="icons"  color="#ff2e2e" value="error_outline"></mu-icon><span class="text">异常汇总</span> </div>
                <div class="check-item" :key="index" v-for="(item , index) in this.examResult.reportItemList.filter(i => {return i.target!==1})">
                     <div class="drugs">
                        <p class="name">{{item.itemName}}({{item.itemCode}})</p>
                        <p class="range">参考范围：{{item.reference}} ({{item.itemUnit}})</p>
                    </div>
                    <div class="value">{{item.result}}({{item.itemUnit}})
                        <span class="down"
                            v-if="item.target === 0">↓</span>
                        <span v-else-if="item.target === 2" class="up">↑</span>
                        <span v-else >&nbsp;</span>
                    </div>
                </div>
            </mu-expansion-panel>
        </div>
        <!-- 所有检查项 -->
        <div class="all-examination"  v-if="examResult.reportType === 'EXAM'">
            <mu-expansion-panel :zDepth="0"
                >
                <div slot="header"
                    class="header"><mu-icon class="icons"  color="" value="list"></mu-icon><span class="text">全部检查项目</span></div>
                <div class="check-item" :key="index" v-for="(item , index) in this.examResult.reportItemList">
                    <div class="drugs">
                        <p class="name">{{item.itemName}}({{item.itemCode}})</p>
                        <p class="range">参考范围：{{item.reference}} ({{item.itemUnit}})</p>
                    </div>
                    <div class="value">{{item.result}}({{item.itemUnit}})
                        <span class="down"
                            v-if="item.target === 0">↓</span>
                        <span v-if="item.target === 2" class="up">↑</span>
                    </div>
                </div>
            </mu-expansion-panel>
        </div>

        <div class="warning">
            注意：最终结果请以纸质报告为准！
        </div>

        <!-- 下载按钮 -->
        <a v-if="medicalNo"
            class="download-btn"
            @click="download">
            下载
        </a>

    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as moment from 'moment';

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD') {
    return (moment as any)(dataStr).format(pattern)

})

@Component({
  components: {
  }
})
export default class RecordDetailBodyCheck extends Vue {
  /** 体检编号 */
  private medicalNo: null | string = null;

  /** 检验编号 */
  private examResult = {
    reportItemList: []
  };

   /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_COMM_SEX: [],
    HMS_COMM_RELATIONSHIP: []
  };

  /** 拉取体检报告的详情 */
  private fetchDetail() {
    this.http$
      .get<any>(
        {
          url: `/api/record/report/${this.$route.params.id}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
            res.data.reportItemList.map(item => {
                const range = item.reference.split('-');
                if(Number(item.result) < Number(range[0])){
                    item.target = 0;
                }else if(Number(item.result) > Number(range[1])) {
                    item.target = 2;
                }else {
                    item.target = 1;
                }
            })
            this.examResult = res.data;
        }
      });
  }

    /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX,HMS_COMM_RELATIONSHIP`
        },
        {
          errMsg: "加载错误",
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        this.dic = Object.assign({}, this.dic, {
          HMS_COMM_SEX: data.HMS_COMM_SEX.map(x => ({
            label: x.name,
            value: x.itemValue
          })),
          HMS_COMM_RELATIONSHIP: data.HMS_COMM_RELATIONSHIP.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
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
        window.location.href = `/api/record/download?medicalNo=${
          this.medicalNo
        }&x=${res}`;
      });
  }

  mounted() {
    this.fetchDic();
    this.fetchDetail(  );
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>


