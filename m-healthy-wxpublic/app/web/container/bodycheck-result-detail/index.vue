<template>
    <div class="con-record-bodycheck-detail">
        <skt-list :loading="loading">
            <mu-container class="detail-block">
                <!-- 放射科 -->
                <mu-expansion-panel :key="k"
                    :zDepth="0"
                    :expand.sync="expand[ k ]"
                    v-for="(resultItem, k) in resultList">
                    <div class="item-header"
                        slot="header">
                        <mu-icon size="16"
                            color="orange"
                            value="insert_chart_outlined" /> {{ resultItem.title }}
                        <span v-if="resultItem.content.length > 0">(
                            <span class="tips"> {{ resultItem.content.length }} </span>)</span>
                    </div>
                    <div class="item-content grey">
                        <ul class="radiation-list">
                            <li :key="k"
                                v-for="(contentItem, k) in resultItem.content">
                                <div class="radiation-item">

                                    <div class="base">
                                        {{ contentItem.name }}
                                    </div>

                                    <div class="difference"
                                        v-if="contentItem.difference && contentItem.reference">
                                        <span class="red">
                                            {{ contentItem.tips }}
                                        </span>
                                        {{ contentItem.difference }}
                                    </div>

                                    <div class="reference"
                                        :class="{
                                            'align-left': contentItem.reference && contentItem.reference.length > 10,
                                            'align-left': !contentItem.reference && contentItem.difference && contentItem.difference.length > 10
                                        }"
                                    >
                                        {{ contentItem.reference || contentItem.difference }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </mu-expansion-panel>

            </mu-container>

        </skt-list>
    </div>
</template>
<script lang="ts">
import SktList from "../../components/skeleton-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 * @description 体检报告的 - 体检详情
 */
@Component({
  components: {
    SktList
  }
})
export default class BodyCheckResultSummary extends Vue {
  /** 当前报告的id */
  @Prop({ type: String, required: true })
  id!: string;

  /** load */
  private loading = true;

  /** 展开 */
  private expand: boolean[] = [];

  /** 报告列表 */
  private resultList: App.bodyCheckResulteItem[] = [];

  /** 拉取体检报告的详情 */
  private fetchDetail(id) {
    this.http$
      .get<Api.get.clinicRecordDetail>(
        {
          url: `/api/record/clinic/report_items?reportId=${id}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        const dangerous: any = [];

        this.expand = Object.keys(data).map((x, index) => {
            return !index?true:false;
        });
        this.resultList = Object.keys(data).map(x => {
          data[x].map(y => {
            if (y.isYang === "1") {
              dangerous.push({
                  name: y.itemName,
                  tips: y.tipsContent,
                  difference: y.medicalValue,
                  reference: y.referenceRange
              });
            }
          });
          return {
            title: x,
            content: data[x].map(y => ({
              name: y.itemName,
              tips: y.tipsContent,
              difference: y.medicalValue,
              reference: y.referenceRange
            }))
          };
        });

        // this.resultList['异常汇总'] = dangerous;
        this.resultList.splice(0,0,{
            title: '异常汇总',
            content: dangerous
        })

        console.log('6666666',dangerous,this.resultList);

        this.loading = false;
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
