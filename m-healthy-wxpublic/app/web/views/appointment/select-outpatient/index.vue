<template>
  <div>
    <div class="header" v-if="!loading">
      <div :class="dic.length > 4 ?' list class-list' : 'list'">
        <horizontal-list :meta="dic"
          :change="handleChange"
          :select="defaultSelectIndex" />
      </div>
      <!-- <div class="more">
        <mu-icon value="today" @click="showTimePicker = true"></mu-icon>
      </div> -->
    </div>
    <skt-list :loading="loading">
      <mu-paper :z-depth="1"
        v-if="childDept.length>0"
        class="demo-list-wrap dept-list">
        <mu-list textline="two-line" >
          <mu-list-item avatar
            @click="handleToDocList(item)"
            button
            :ripple="true"
            :key="index"
            v-for="(item, index) in childDept">
            <mu-list-item-action>
              <mu-avatar :color="item.images? '' :'blue'">
                <img v-if="item.images"
                  :src="getPhotoUrl(item.images)"
                  alt="" />
                <mu-icon v-if="!item.images"
                  value="account_circle"></mu-icon>
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.name}}</mu-list-item-title>
              <mu-list-item-sub-title>{{item.description}}</mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    </skt-list>
    <!-- 时间选择器 -->
    <div class="date-picker">
        <mu-bottom-sheet :open.sync="showTimePicker">
          <mu-paper :z-depth="1" class="date-picker">
            <mu-date-picker :date.sync="selectTime" color="#00D0B9" @change="handleSelectTime" no-display></mu-date-picker>
          </mu-paper>
        </mu-bottom-sheet>
    </div>
    <p class="empty-tips"
      v-if="childDept.length===0 && alreadyLoad">
      <span>
        {{ '空空如也' }}
      </span>
    </p>
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { toJS } from "mobx";
import HorizontalList from "../../../components/horizontal-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";

Vue.component("horizontal-list", HorizontalList);

@inject({
  selector: ["account$", "globalStore$", "appointment$"]
})
@Component({
  components: { HorizontalList, SktList }
})
export default class SelectOutPatient extends Vue {

  /** 当前选中时间 */
  private selectTime = undefined;

  private showTimePicker = false;

  /** 加载 */
  private loading = true;

  /** 子科室列表 */
  private childDept: any[] = [];

  /** 数据字典 */
  private dic: any[] = [];

  private alreadyLoad = false;

  /** tab默认选中index */
  private defaultSelectIndex = 0;

  /** 已分组的科室列表 */
  private allDeptGroup = {};

  private handleSelectTime(value) {
    this.selectTime = value;
    this.showTimePicker = false;
  }

  private handleChange(value) {
    this.handleSetChildDept(value);
  }

  private handleSetChildDept(index) {
    this.childDept = this.allDeptGroup[this.dic[index].itemValue] || [];
  }
  /** 跳转到选择医生的页面 */
  private handleToDocList(item: any) {
    (this as any).$router.push(
      `/appointment/doctors?id=${item.centerId}&deptId=${item.id}`
    );
  }

  private getPhotoUrl(url){
    const urls = url.split('/');
    return `/api/order/getPhoto/${urls[urls.length-1]}`
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.loading = true;
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_CLINIC_FIRST_DEPT`
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
        this.dic = data.HMS_CLINIC_FIRST_DEPT.map(item => {
          return Object.assign(item, { content: item.name });
        }).filter(item => {
          return item.attribute1 === "OUTPATIENT_DEPT";
        });
        this.fetchDeptGroup();
      });
  }
  /** 拉取科室 */
  private fetchDeptGroup() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/order/reserve/dept/group?centerId=${(this as any).$router.history.current.query.id}&pageSize=1000`
        },
        {
          errMsg: "加载错误",
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        let index = 0;
        if (status !== 200) {
          return;
        }
        this.allDeptGroup = data;
        if (
          (this as any).$router.history.current.query.hasOwnProperty(
            "firstsort"
          )
        ) {
          index = this.dic.findIndex(item => {
            return (
              item.itemValue ===
              (this as any).$router.history.current.query.firstsort
            );
          });
        }
        this.defaultSelectIndex = index;
        this.handleSetChildDept(index >= 0 ? index : 0);
        this.alreadyLoad = true;
        this.loading = false;
      });
  }

  mounted() {
    // this.fetchDeptList();
    this.fetchDic();
    // this.fetchDeptGroup();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
