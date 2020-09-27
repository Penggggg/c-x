<template>
  <div class="p-chemical-examination-detail my-page">

    <!-- 个人检查信息 -->
    <div class="person-info">
      <div class="header">
        <!-- <mu-icon value="person_outline" class="icon"></mu-icon><span class="text"> 就诊信息 </span> -->
        就诊信息
      </div>
      <div class="content">
        <div class="item">
          <div>姓名：{{detailInfo.userName}}</div>
          <div>性别：{{ dic.HMS_COMM_SEX.find( x => x.value === detailInfo.userGender ) ? dic.HMS_COMM_SEX.find( x => x.value === detailInfo.userGender ).label : '' }}
          </div>
          <div>年龄：{{detailInfo.userAge}}</div>
        </div>
        <div class="item">
          <div>就诊时间：{{ detailInfo.clinicTime |dateformat()}} </div>
          <div>就诊地点：{{detailInfo.clinicAgencyName}} </div>
        </div>
        <div class="item">
          <div>就诊科室：{{detailInfo.deptName}} </div>
          <div>就诊医生：{{detailInfo.doctorName}} </div>
        </div>
      </div>
    </div>
    <!-- 检查位置 -->
    <div class="position"
      v-if="detailInfo.illDescription">
      <div class="header">
        病情
      </div>
      <div class="content">
        <div :key="index"
          v-for="(item , index ) in detailInfo.illDescription.split('/n')">{{item.replace(/;/,'')}}</div>
      </div>
    </div>
    <!-- 检查结果 -->
    <div class="result"
      v-if="detailInfo.doctorAdvice">
      <div class="header">
        医嘱
      </div>
      <div class="content advice">
        <div :key="index"
          v-for="(item , index ) in detailInfo.doctorAdvice">
          <p :class="!isNaN(item.trim()[0]) ? 'title' : 'body'">{{item.trim()[0] !== '0'?item.trim():item.trim().replace('0', '')}}</p>
        </div>
      </div>
    </div>

    <!-- 下载按钮 -->
    <!-- <a v-if="medicalNo"
            class="download-btn"
            @click="download">
            下载
        </a> -->

  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as moment from "moment";

Vue.filter("dateformat", function(dataStr, pattern = "YYYY-MM-DD") {
  return (moment as any)(dataStr).format(pattern);
});

@Component({
  components: {}
})
export default class RecordDetailBodyCheck extends Vue {
  /** 体检编号 */
  private medicalNo: null | string = null;

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

  private detailInfo = {};

  /** 格式化医嘱 */
  private formatDevice(info) {
    const res = info.replace(/总量/g, ";总量").replace(/治疗：/g, '0治疗：');
    const index = res.indexOf("处方：") + 3;
    let temp: any[] = [];
    const pattern = /\d/;
    console.log('结果',res.slice(index).split(';'));
    res.slice(index).split(';').map(item => {
      const obj = pattern.exec(item.slice(1));
      if(!isNaN(Number(item[0])) && item[0] !== '0' && obj){
        item = `${item.slice(0,[obj.index+1])};规格:${item.slice([obj.index+1])}`;
        // const res1 = item.split(";");
        temp = [...temp , ...item.split(";")];
        return ;
      }
      temp.push(item);
    })
    return temp;
  }
  /** 拉取体检报告的详情 */
  private fetchDetail() {
    this.http$
      .get<any>(
        {
          url: `/api/service/clinic/record/${this.$route.params.id}/info`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
          res.data.doctorAdvice &&
            (res.data.doctorAdvice = this.formatDevice(res.data.doctorAdvice));
          res.data.illDescription &&
            (res.data.illDescription = res.data.illDescription.replace(new RegExp(/(主诉|现病史|既往史|个人史|过敏史|体格检查|诊断)/g) , "/n$1"));
          this.detailInfo = res.data;
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
        window.location.href = `/api/record/download?medicalNo=${
          this.medicalNo
        }&x=${res}`;
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

  mounted() {
    this.fetchDic();
    this.fetchDetail();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>


