<template>
  <!-- 顶部选择器 -->
  <div class="main-page">
      <!-- 视源健康课 -->
      <div class='health-lesson'>
         <div class="lesson-list">
            <div class="item" :key="index" v-for="(item , index) in lessonList" @click="handleToHref(item.linkUrl)">
              <div class="imgs"><img :src="getPhotoUrl(item.image)" ></div>
              <div class="content">
                <p>{{item.title}}</p>
                <div class="time">{{item.time}}</div>
              </div>
            </div>
          </div>
      </div>
  </div>

</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { serviceClassify, healthyService, healthLesson } from "../home-page/config";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Main from "../main/index.vue";
import { setTimeout } from "timers";

@inject({
  selector: ["account$", "globalStore$", "appointment$"]
})
@Component({
  components: { Main }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

  private service = serviceClassify;

  private healthy = healthyService;

  private selectHospitalId = "";

  /** 是否打开modal框 */
  private openModal = false;

  /** 广告展示图片列表 */
  private adPhotoList = {
    carousel: [],
    outpatient: [],
    hotPoint: []
  };

  /** 课程列表 */
  private lessonList = healthLesson;

  /** 当前健康中心id */
  private currentHostipal = {
    id: "",
    name: ""
  };

 

  /** 健康中心列表 */
  private hostipalList = [];

  /** 首页科室列表 */
  private mainPageDept = [];

  private handleOpenModal() {
    this.openModal = true;
  }

  private getPhotoUrl(url){
    const urls = url.split('/');
    return `/api/order/getPhoto/${urls[urls.length-1]}`
  }

  private handleCloseModal() {
    const res: any[] = this.hostipalList.filter((item: any) => {
      return this.selectHospitalId === item.id;
    });
    res.length > 0 &&
      (this.currentHostipal = Object.assign(
        {},
        { name: res[0].name, id: res[0].id }
      )) &&
      (this.appointment$.order.currentHospital = Object.assign(
        {},
        { name: res[0].name, id: res[0].id }
      )) &&
      this.handleInit(res[0]);
    this.openModal = false;
  }

  /** 链接跳转 */
  private handleToHref(url) {
    if(url === '') {
      this.$toast.warning(' 链接为空 ');
      return;
    }
    window.location.href = url;
  }

  /** 路由跳转到url */
  private handleJumpTo(url) {
    if(url === '') {
      this.$toast.warning('暂未开放哦 ～ ');
      return;
    }
    (this as any).$router.push(`${url}`);
  }

  /** 获取首页广告图片 */
  private fetchAdPhoto(id, pos = ["0", "1", "2"]) {
    pos.map(item => {
      this.http$
        .get<any>(
          {
            url: `/api/order/reserve/ad?showLocation=${item}&orgId=${id}`
          },
          {
            loadMsg: "加载中..."
          }
        )
        .then(res => {
          const { status, data } = res;
          
          if (status === 200) {
            const finalRes = data.filter(item => {
              if(item.expiredTime){
              return new Date().getTime() - item.expiredTime <= 0;}
              return true;
            });
            item === "0" && (this.adPhotoList.carousel = finalRes);
            item === "1" && (this.adPhotoList.outpatient = finalRes);
            item === "2" && (this.adPhotoList.hotPoint = finalRes);
          }
        });
    });
  }
  /** 获取首页科室 */
  private fetchMainPageDept(id) {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/index/dept?centerId=${id}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.mainPageDept = data;
        }
      });
  }
  /** 获取健康中心列表 */
  private fetchAllHostipal() {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/hospital`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.hostipalList = data;
          !this.appointment$.order.currentHospital.id &&
            (this.currentHostipal = Object.assign(
              {},
              { name: data[0].name, id: data[0].id }
            )) &&
            (this.appointment$.order.currentHospital = Object.assign(
              {},
              { name: data[0].name, id: data[0].id }
            ));
          this.appointment$.order.currentHospital.id &&
            (this.currentHostipal = Object.assign(
              {},
              this.appointment$.order.currentHospital
            ));
          console.log('数据',this.currentHostipal);
          this.handleInit(this.appointment$.order.currentHospital);
        }
      });
  }

  private handleInit(val) {
    const res: any[] = this.hostipalList.filter((item: any) => {
      return val.name === item.name;
    });

    if (res.length > 0) {
      this.fetchAdPhoto(res[0].id);
      this.fetchMainPageDept((res[0] as any).id);
    }
  }

  mounted() {
    this.fetchAllHostipal();
    // this.fetchDetail( this.$route.params.id );
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
