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
                        @click="$router.push(`/record/examination-detail/${item.id}`)"
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
                            </div>
                            <div class="detail">
                                <span>{{ item.reportTime | dateformat}}</span>
                                <span>{{ item.deptName }}-{{item.clinicName}}</span>
                                <span>检验编号：{{ item.clinicNumber }}</span>
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
import { inject } from "../../../service/inject";
import SktList from "../../../components/skeleton-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as moment from 'moment';

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD') {
    return (moment as any)(dataStr).format(pattern)

})

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: { SktList }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = false;

  /** 列表 */
  private list: object[] = [];

  private addMembers() {
  }

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

  /** 拉取列表 */
  private fetchRecord() {
    this.http$.get<any>(
        {
          url:'/api/record/report',
          params: {
              pageSize: 1000
          }
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
      this.loading = false;
      this.list = data.dataList.sort((x,y) => Number(y.reportTime) - Number(x.reportTime));
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
  mounted() {
     // TODO: 这里因为线上效果及数据有问题，先做下线处理
    //  this.$toast.error( '暂未开放哦' );
    //  return ;
     this.fetchDic();
     this.fetchRecord();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
