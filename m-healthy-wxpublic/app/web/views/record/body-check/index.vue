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
                        暂无报告
                    </p>
                </div>
                <!-- 报告列表 -->
                <ul v-else class="record-list">
                    <li
                        :key="k"
                        v-for="(item, k) in list"
                        @click="$router.push(`/record/body-check-detail/${item.id}`)"
                    >
                        <div class="info">
                            <div class="base">
                                <span class="name">
                                    {{ item.name }}
                                </span>
                                <span class="tips">
                                    {{
                                        dic.HMS_COMM_SEX.find( x => x.value === item.sex ) ?
                                            dic.HMS_COMM_SEX.find( x => x.value === item.sex ).label :
                                            ''
                                    }}
                                </span>
                            </div>
                            <div class="detail">
                                <span>{{ item.department }}</span>
                                <span>体检时间：{{ item.time }}</span>
                                <span>体检编号：{{ item.number }}</span>
                            </div>
                        </div>
                        <div class="btn">
                            查看
                        </div>
                    </li>
                </ul>
                <p class="my-tips" v-if="list.length !== 0 && this.$route.query.tab === '0'">
                    <span>
                        没有更多数据了
                    </span>
                </p>
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
  private loading = true;

  /** 列表 */
  private list: App.bodyCheckListItem[] = [];

  /** 拉取列表 */
  private fetchRecord() {
    const urls = ["/api/record/clinic","/api/record/relative"];
    Promise.all(urls.map(item => {
      return this.http$.get<any>(
        {
          url:item
        },
        {
          loadMsg: "加载中..."
        }
      )
    })).then(data => {
      let res = [];
      data.map((item: any | never) => {
        // res.push(...item.data);
        res = res.concat(item.data);
      });
      this.loading = false;
      this.list = res.sort((a: any , b: any) => b.medicalDate - a.medicalDate).map((x: any) => ({
          id: x.id,
          name: x.name,
          sex: x.sex,
          number: x.medicalNo,
          department: x.medicalSite,
          time: new Date(x.medicalDate).toLocaleDateString()
        }));
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

