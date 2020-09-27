<template>
  <div>

    <div v-if="$router.history.current.query.tab && !loading" :class="dic.HMS_CLINIC_FIRST_DEPT.length > 4 ?' list class-list' : 'list'">
      <horizontal-list :meta="dic.HMS_CLINIC_FIRST_DEPT"
        :change="handleChange" />
    </div>
    <skt-list :loading="loading">
      <mu-paper :z-depth="1"
        v-if="doctorList.length>0"
        class="demo-list-wrap doctor-list">
        <mu-list textline="three-line">
          <mu-list-item avatar
            :ripple="false"
            :key="index"
            @click="handleOrderDoctor(doctor.doctor, doctor.hasExcessSchedule)"
            v-for="(doctor, index) in doctorList"
            button>
            <!-- :disabled="!doctor.hasExcessSchedule" -->
            <div class="confirm">
                  <mu-button 
                    :class="doctor.hasExcessSchedule?'canOrder' :'notOrder'"
                    small
                    :flat="true"
                    
                    > {{doctor.hasExcessSchedule?`¥ ${(doctor.scheduleInfoList[0].regFee/100).toFixed(0)}` : ((doctor.scheduleInfoList&&doctor.scheduleInfoList.length>0) ? '约满':'未开放')}}</mu-button>
                </div>
            <mu-list-item-action>
              <mu-avatar :color="doctor.doctor.images? '' :'grey'" size="60" class="doctor-avatar">
                <img 
                  :src="getPhotoUrl(doctor.doctor.images)"
                  alt="" />
                <!-- <mu-icon v-if="!doctor.doctor.images"
                  value="account_circle"></mu-icon> -->
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>
                <div class="detial-info">
                  <p class="name">{{doctor.doctor.name}}
                  </p>
                </div>
              </mu-list-item-title>
              <mu-list-item-sub-title>
                <div class="date-list">
                  {{doctor.doctor.deptName}} | {{dic.HMS_DOCTOR_POSITION.filter(item => { return item.itemValue === doctor.doctor.doctorLevel; })[0].name}}
                </div><br/>
                <div class="medical-list" v-if="doctor.doctor.areasOfExpertise">
                  <span :key="project" v-for="project in doctor.doctor.areasOfExpertise.split(',')">{{project}}</span> 
                </div>
              </mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    </skt-list>
    <p class="empty-tips"
      v-if="alreadyLoad && doctorList.length===0">
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
  /** 加载 */
  private loading = false;

  /** 医生列表 */
  private doctorList = [];

  private alreadyLoad = false;

  /** 数据字典 */
  private dic: any = {
    HMS_CLINIC_FIRST_DEPT: [],
    HMS_DOCTOR_POSITION: []
  };
  /** tab切换回调事件 */
  private handleChange(value) {
    this.fetchDoctorList(
      (this.dic.HMS_CLINIC_FIRST_DEPT[value] as any).itemValue
    );
  }

  /** 路由跳转到地址 */
  private handleToForm(url) {
    (this as any).$router.push(url);
  }

  /** 预约医生 */
  private handleOrderDoctor(doctor, hasExcessSchedule) {
    // TODO: 这里是为了暂时使用新表单代替了旧表单
    // this.handleToForm(
    //   `/appointment/orderform?centerId=${doctor.centerId}&deptId=${
    //     doctor.deptId
    //   }&doctorId=${doctor.id}&firstDept=${
    //     (this as any).$router.history.current.query.firstDept
    //   }`
    // );
    // if(!hasExcessSchedule) {
    //   this.$toast.info( '该医生暂不可选哦～' );
    //   return;
    // }
    this.handleToForm(
      `/appointment/deptorderform?centerId=${doctor.centerId}&deptId=${
        doctor.deptId
      }&doctorId=${doctor.id}&firstDept=${
        (this as any).$router.history.current.query.firstDept
      }`
    );
  }

  /** 聚合医生排期时间 */
  private handleGatherDrTime(data) {
    let temp = [];
    let res = [];
    data.map(cItem => {
      const time = new Date(cItem.regDate).getTime();
      if ((temp as any).indexOf(time) < 0) {
        (temp as any).push(time);
        (res as any).push(
          `${new Date(time).getMonth() + 1}.${new Date(time).getDate()}`
        );
      }
    });
    return res;
  }

  /** 获取医生列表 */
  private fetchDoctorList(deptType?: string) {
    const load = this.loading$.msg('加载中...');
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/doctor/list`,
          params: {
            centerId: (this as any).$router.history.current.query.id,
            deptType: deptType,
            deptId: (this as any).$router.history.current.query.deptId,
            pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(async res => {
        const { status, data } = res;
        if (status === 200) {
          this.doctorList = [];
          await Promise.all(
            data.dataList.map((item, index) => {
              return this.fetchDoctorScedule((item as any).id, index);
            })
          ).then((data) => {
            (this.doctorList as any) = [...toJS(data)];
          });
          this.alreadyLoad = true;
          this.loading = false;
          load.close();
        }
      });
  }

  private getPhotoUrl(url){
    if(url){
      const urls = url.split('/');
      return `/api/order/getPhoto/${urls[urls.length-1]}`
    }
    return '/public/img/man.png'
    
  }

  private fetchDoctorScedule(dcoId: string, index: number) {
    return this.http$
      .get<any>(
        {
          url: `/api/order/reserve/doctor/schedule`,
          params: {
            doctorId: dcoId,
            endTime: new Date().setDate(new Date().getDate() + 364),
            pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
        //  (this.doctorList[index] as any) = data;
        //  (this.doctorList[index] as any).push(data);
        return Promise.resolve( data );
          // (this.doctorList[index] as any).schedule = this.handleGatherDrTime(
          //   data.scheduleInfoList
          // );
          // (this.doctorList[index] as any).hasExcessSchedule = data.hasExcessSchedule;
          // (this.doctorList[index] as any).regFee =  data.scheduleInfoList[0].regFee;
        }
      });
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.loading = true;
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode= ${"HMS_CLINIC_FIRST_DEPT,HMS_DOCTOR_POSITION"}`
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
        data['HMS_CLINIC_FIRST_DEPT'] = data['HMS_CLINIC_FIRST_DEPT'].map(item => {
          return Object.assign(item, {content: item.name});
        });
        if (
          (this as any).$router.history.current.query.hasOwnProperty(
            "firstDept"
          )
        ) {
          const res =
            (this as any).$router.history.current.query.firstDept ===
            "PSYCHOLOGY_DEPT"
              ? {
                  HMS_CLINIC_FIRST_DEPT: data["HMS_CLINIC_FIRST_DEPT"].filter(
                    item => {
                      return item.attribute1 === "PSYCHOLOGY_DEPT";
                    }
                  )
                }
              : {
                  HMS_CLINIC_FIRST_DEPT: data["HMS_CLINIC_FIRST_DEPT"].filter(
                    item => {
                      return item.attribute1 !== "PSYCHOLOGY_DEPT";
                    }
                  )
                };
          this.dic = Object.assign(data, res);
        } else {
          this.dic = data;
        }

        if (
          (this as any).$router.history.current.query.hasOwnProperty("deptId")
        ) {
          this.fetchDoctorList();
        } else {
          this.fetchDoctorList(
            (this.dic.HMS_CLINIC_FIRST_DEPT[0] as any).itemValue
          );
        }
      });
  }

  mounted() {
    this.fetchDic();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
