<template>
  <window-title name="问卷详情" v-if="alreadyLoad">
    <div class="question-res-title">
      <div class="main"> 
        {{result.qnName}}
      </div>
      <div class="time"> 
        筛查时间: {{ result.answeredTime | dateformat}}
      </div>
      <div class="des" v-if="Object.keys(result.resultMap).length !== 0"> 
        <p class="tips"><mu-icon value="favorite_border" class="icon" color="#ff2e2e"></mu-icon><span>爱心提示:</span></p>
        <p class="text">通过肿瘤风险筛查问卷发现您有以下疾病存在风险增高的情况，建议您截图保留筛查结果并在体检时向医生咨询具体情况</p>
      </div>
    </div>
    <!-- 结果不正常 -->
    <div class="question-res-warper" v-if="Object.keys(result.resultMap).length !== 0">
      <div class="header">
        <div class="item less-width"></div>
        <div class="item">特异性症状筛查</div>
        <div class="item more-width">高危因素</div>
        <div class="item less-width">评估结果</div>
      </div>
      <div class="content">
        <div class="row" :key="index" v-for="(item, index) in Object.keys(result.resultMap)">
          <div class="item less-width">{{item}}</div>
          <div class="col-warper item">
            <div class="col" :key="sindex" v-for="(sitem, sindex) in result.resultMap[item].symptomList.filter(i => i.match === true)">{{sitem.content}}</div>
          </div>
          <div class="col-warper item more-width">
             <div class="col" :key="findex" v-for="(fitem, findex) in result.resultMap[item].factorList.filter(i => i.match === true)">{{fitem.content}}</div>
          </div>
          <div class="item less-width"><span class="res-assess">{{result.resultMap[item].message && result.resultMap[item].message}} </span></div>
        </div>
      </div>
    </div>
    <!-- 结果正常 -->
    <div class="success-result" v-if="Object.keys(result.resultMap).length === 0">
      <mu-icon value="thumb_up" size="128"  color="#36c67d"></mu-icon>
      <p>太棒了，未发现存在肿瘤风险，请继续保持!</p>
    </div>
  </window-title>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import MyForm from "../../../components/my-form-v2/index.vue";
import MyHeader from "../../../components/my-header/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";
import windowTitle from "../../../components/window-title/index.vue";
import * as moment from "moment";

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm') {
    return (moment as any)(dataStr).format(pattern)

})

/**
 * @description 体检预约记录
 */
@inject({})
@Component({
  components: {
    SktList,
    windowTitle
  }
})
export default class MyOrderList extends Vue {
  /** 当前选中的预约ID */
  private selectingId = "";

  /** 审查结果 */
  private result = {
    resultMap: {}
  };

  private alreadyLoad = false;

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_CLINIC_CANCEL_REASON: [],
    HMS_CLINIC_TYPE: [],
    HMS_PERSONAL_APPOINT_STATUS: [],
    HMS_MEDICAL_SITE: [],
    HMS_PERSONAL_APPOINT_CHANNEL: []
  };

  private getLeftCornerStyle(item) {
    return {
      lineHeight: item.itemMaxLength * 63,
      height: item.itemMaxLength * 65
    };
  }
  /** 获取问卷详情 */
  private fetchQ() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/q/tumors_result`,
          params:{
            // questionnaireUserId: '2ddc1b3b91a44167ab406ddc07261829'
            questionnaireUserId: this.$route.query.id
          }
        },
        {
          errMsg: "加载错误",
          loadMsg: "加载中..."
        }
      ).then(res => {
        const { status, data } = res; 
        if (status !== 200) {
          return;
        }
        this.result = {resultMap: {}};
        Object.keys(data.resultMap).map((item: any ) => {
          if((data.resultMap[item] as any).message) {
            this.result.resultMap[item] = data.resultMap[item];
          }
        })
        this.result = Object.assign(data, this.result);
        this.alreadyLoad = true; 
      })
  }

  mounted() {
    this.fetchQ();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
