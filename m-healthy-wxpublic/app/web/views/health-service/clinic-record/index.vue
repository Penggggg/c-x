<template>
    <div class="p-record-bodycheck my-page">
        <skt-list
            :loading="loading"
        >
            <div>
                 <div
                    class="tips-block"
                    v-if="!loading && list.length === 0"
                >
                    <svg class="my-icon" aria-hidden="true">
                        <use xlink:href="#icon-baogao2"></use>
                    </svg>
                    <p class="tips">
                        暂无记录
                    </p>
                </div>
                <!-- 报告列表 -->
                <ul v-else class="record-list">
                    <li
                        class="report"
                        :key="k"
                        v-for="(item, k) in list"
                        @click="$router.push(`/health-service/clinic-list/${item.userId}`)"
                    >
                        <p class="identity">{{item.isMyself === '1' ? '本人' : '亲属'}}</p>
                        <div class="info">
                            <div class="base">
                                <span class="name">
                                    {{ item.userName }}
                                </span>
                                <span class="tips" >
                                    {{
                                        dic.HMS_COMM_SEX.find( x => x.value === item.userGender ) ?
                                            dic.HMS_COMM_SEX.find( x => x.value === item.userGender ).label :
                                            ''
                                    }}
                                </span>
                                <!-- <span class="tips" v-else>
                                    {{
                                        dic.HMS_COMM_RELATIONSHIP.find( x => x.value === item.relationship ) ?
                                            dic.HMS_COMM_RELATIONSHIP.find( x => x.value === item.relationship ).label :
                                            ''
                                    }}
                                </span> -->
                            </div>
                            <div class="detail">
                                <span>最近体检：{{ item.recentVisitDate }}</span>
                                <span>年龄：{{ item.userAge }}</span>
                                <span>就诊次数：{{ item.visitNumber }}</span>
                            </div>
                        </div>
                        <div class="btn">
                            查看
                        </div>
                    </li>
                </ul>
                <!-- <div
                    v-if="!loading && this.$route.query.tab === '1'"
                    class="btn-block"
                >
                    <mu-button
                        full-width
                        color="success"
                        @click="addMembers"
                    >
                        添加家属成员
                    </mu-button>
                </div> -->
            </div>
        </skt-list>
    </div>
</template>
<script lang="ts">
import SktList from "../../../components/skeleton-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { throws } from 'assert';
import { resolve } from 'path';
import * as  moment  from 'moment';
// import ActiveTab from "../../../../components/active-tab/index.vue";

@Component({
  components: {
    SktList
    // ActiveTab
  }
})
export default class RecordBodyCheck extends Vue {

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

  /** 加载状态 */
  private loading = false;

  /** 列表 */
  private list: object[] = [
  ];

  /** 拉取列表 */
  private fetchRecord() {
    this.http$.get<any>(
        {
          url: '/api/service/statistic'
        },
        {
          loadMsg: "加载中..."
        }
      )
    .then(res => {
      this.loading = false;
      const { status, data } = res;
        if (status !== 200) {
          return;
        }
      this.list = data;
    })
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

  /** 添加家属成员 */
  private addMembers() {
    this.$router.push(`/account/add-members`);
  }

  mounted() {
    this.fetchDic();
    this.fetchRecord();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

