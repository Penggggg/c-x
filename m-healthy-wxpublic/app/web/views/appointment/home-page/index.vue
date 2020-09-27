<template>
  <!-- 顶部选择器 -->
  <div class="main-page">
    <div class="content">
      <!-- 轮播图 -->
      <div class="carousel"
        >
        <mu-carousel hide-controls>
          <mu-carousel-item :key="index"
            v-for="(item , index) in adPhotoList.carousel">
            <a @click="handleToHref(item.linkUrl)"><img class="imgs"
                :src="getPhotoUrl(item.images)"></a>
          </mu-carousel-item>
        </mu-carousel>
      </div>
      <!-- 联系方式控件 -->
      <div class="contact-way">
        <div class="address"
          @click="handleToHref('https://uri.amap.com/marker?position=23.1551400000,113.5269200000&name=CVTE第二产业园')">
          <span>
            <mu-icon value="location_on"
              color="green"
              size="20" />
          </span>
          <span class="text">广州市黄埔区云埔四路6号1栋3、4 楼</span>
        </div>
        <div class="phone">
          <a href="tel:4000-020-666">
            <mu-icon value="phone"
              color="green"
              size="28" />
          </a>
        </div>
      </div>
      <!-- 医疗服务卡片 -->
      <div class="service-card">
        <div class="card-item"
          :key="index"
          v-for="(item , index) in service">
          <div class="imgs">
            <img :src="item.backImg">
          </div>
          <div class="des">
            <p class="chinese-des"
              @click="handleJumpTo(item.url ? `${item.url}?id=${currentHostipal.id}&firstDept=${item.firstDept? item.firstDept.trim() : ''}`: '')">{{item.chineseDes}}</p>
            <p class="english-des">{{item.englishDes}}</p>
          </div>

        </div>
      </div>
      <!-- 健康服务 -->
      <div class="health-service">
        <h3>健康服务</h3>
        <div class="item-warper">
          <div class="service-item"
            :key="index"
            v-for="(item , index) in healthy"
            @click="handleJumpTo(`${item.url}`)">
            <img :src="item.iconImg"
              alt=""
              class="service-icon">
            <p>{{item.des}}</p>
          </div>
        </div>
      </div>
      <!-- 门诊讯息 -->
      <div class="out-patient"
        v-if="adPhotoList.outpatient.length>0 || mainPageDept.length>0">
        <div class="header">
          <h3>门诊讯息</h3>
          <div class="more">
            <span @click="handleJumpTo(`/appointment/order?id=${currentHostipal.id}`)">更多</span>
            <mu-icon value="chevron_right"></mu-icon>
          </div>
        </div>
        <div class="department-list">
          <div class="item"
            :key="index"
            v-for="(item , index) in mainPageDept"
            @click="handleJumpTo(`/appointment/order?firstsort=${item.type}&id=${currentHostipal.id}&firstDept=OUTPATIENT_DEPT`)">
            <span class="item-content">{{item.name}}</span>
          </div>
        </div>
        <div class="doctor-list">
          <mu-grid-list class="gridlist-inline-demo"
            :cols="4">
            <mu-grid-tile v-for="(tile , index) in adPhotoList.outpatient"
              :key="index"
              @click="handleToHref(tile.linkUrl)">
              <img :src="getPhotoUrl(tile.images)">
              <span slot="subTitle">
              </span>
            </mu-grid-tile>
          </mu-grid-list>
        </div>
        <!-- <div class="tips" v-if="adPhotoList.outpatient.length>2">
          右滑更精彩呦 
        </div> -->
      </div>
      <!-- 热门推荐 -->
      <div class="hot-point"
        v-if="adPhotoList.hotPoint.length>0">
        <div class="header">
          <h3>热门推荐</h3>
          <div class="more">
            <span @click="handleJumpTo('/health-check/package')">更多</span>
            <mu-icon value="chevron_right"></mu-icon>
          </div>
        </div>
        <div class="content">
          <div class="special"
            @click="handleToHref(adPhotoList.hotPoint[0].linkUrl)">
            <img :src="getPhotoUrl(adPhotoList.hotPoint[0].images)"
              alt="">
            <p class="text">{{adPhotoList.hotPoint[0].remark}}</p>
          </div>
          <mu-grid-list class="gridlist-inline-demo"
            :cols="4">
            <mu-grid-tile v-for="(tile , index) in adPhotoList.hotPoint.slice(1)"
              :key="index"
              @click="handleToHref(tile.linkUrl)">
              <img :src="getPhotoUrl(tile.images)">
              <!-- <span slot="title">{{tile.remark}}</span> -->
              <span slot="subTitle">
              </span>
            </mu-grid-tile>
          </mu-grid-list>
        </div>
        <!-- <div class="tips" v-if="adPhotoList.hotPoint.length>2">
          右滑更精彩呦 
        </div> -->
      </div>
      <!-- 视源健康课 -->
      <div class='health-lesson'>
         <div class="header">
          <h3>视源健康知识</h3>
          <div class="more">
            <!-- <span @click="handleJumpTo('/health-check/package')">更多</span> -->
            <!-- <mu-icon value="chevron_right"></mu-icon> -->
          </div>
        </div>
         <div class="lesson-list">
            <div class="item" :key="index" v-for="(item , index) in lesson" @click="handleToHref(item.articleUrl)">
              <div class="imgs"><img :src="item.images" ></div>
              <div class="content">
                <p>{{item.articleName}}</p>
                <div class="time">{{item.publishDate | dateformat}}</div>
              </div>
            </div>
          </div>
         <!-- <div class="lesson-list">
            <div class="item" :key="index" v-for="(item , index) in lessonList" @click="handleToHref(item.linkUrl)">
              <div class="imgs"><img :src="item.image" ></div>
              <div class="content">
                <p>{{item.title}}</p>
                <div class="time">{{item.time}}</div>
              </div>
            </div>
          </div> -->
      </div>
    </div>
  </div>

</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { serviceClassify, healthyService, healthLesson } from "./config";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Main from "../main/index.vue";
import { setTimeout } from "timers";
import * as moment from "moment";

Vue.filter("dateformat", function(dataStr, pattern = "YYYY-MM-DD") {
  return (moment as any)(dataStr).format(pattern);
});

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

  /** 首页健康课 */
  private lesson = [];

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
      this.$toast.info(' 链接为空 ');
      return;
    }
    window.location.href = url;
  }

  /** 路由跳转到url */
  private handleJumpTo(url) {
    if(!url) {
      this.$toast.info('暂未开放哦 ～ ');
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
            url: `/api/order/reserve/ad?showLocation=${item}&orgId=${id}`,
            params:{
            pageSize:1000
          }
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

  /** 获取健康课 */
  private fetchLesson(id) {
    this.http$
      .get<any>(
        {
          url: `/api/order/knowledge/list`,
          params:{
            pageSize:1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          console.log('课程', data);
          this.lesson = data;
        }
      });
  }
  /** 获取首页科室 */
  private fetchMainPageDept(id) {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/index/dept?centerId=${id}`,
          params:{
            pageSize:1000
          }
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
          url: `/api/order/reserve/hospital`,
          params:{
            pageSize:1000
          }
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
      this.fetchLesson(res[0].id);
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
