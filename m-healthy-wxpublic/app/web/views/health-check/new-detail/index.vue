<template>
    <div class="p-health-card-detail">

        <!-- 头部 -->
        <my-header :isfixed="true">
            <span slot="left"
                @click="$router.back( )">
                <mu-icon value="keyboard_arrow_left" />
            </span>
            <span slot="center">
                套餐详情
            </span>
        </my-header>

        <!-- 详情 -->
        <skt-list :loading="loading">
            <div class="container-block">

                <div v-if="detail"
                    class="overview">
                    <div class="content"
                        :style="{backgroundImage: 'url(' + getPhotoUrl( detail.formImage ) + ')', backgroundSize:'cover'}">
                        <div class="item">
                            <div class="ch-name">
                                <p>{{detail.onLinePackageName}}</p>
                                <p class="count">含{{detail.items.length}}项检查项目</p>

                            </div>
                            <div class="es-name">
                                yibicom.com
                            </div>
                        </div>
                        <div class="item bottom">
                            <div class="range"
                                :key="range.tagName"
                                v-for="(range, index) in detail.tagList">{{range.tagName}}</div>
                            <div class="price">
                                RMB:
                                <span class="money">¥{{detail.price.toFixed(2)}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div
                    v-if="detail"
                    class="title"
                >
                    {{ detail.onLinePackageName }}
                </div> -->

                <div class="info-block-container">

                    <!-- <div class="info-block space" v-if="detail">
                        <div class="sub-title bar">
                            适宜人群
                        </div>
                        <div class="content">
                            <div class="tags-block">
                                <div
                                    class="tag"
                                    :key="kk"
                                    v-for="(tag, kk) in detail.tagList"
                                >
                                    {{ tag.tagName }}
                                </div>
                            </div>
                        </div>
                    </div> -->

                    <div class="info-block"
                        v-if="detail && detail.attention">
                        <div class="sub-title bar">
                            注意事项
                        </div>
                        <div class="content">
                            <p :key="d"
                                v-for="(d, kkk) in detail.attention.split('\n').filter( x => !!x)">
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block"
                        v-if="detail && detail.serviceDesc">
                        <div class="sub-title bar">
                            套餐说明
                        </div>
                        <div class="content">
                            <p :key="d"
                                class="indent"
                                v-for="(d, kkk) in detail.serviceDesc.split('\n').filter( x => !!x)">
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block"
                        v-if="detail && detail.serviceDetail && detail.mitems">
                        <div class="sub-title bar">
                            包含项目
                        </div>
                        <!-- <div class="content fuwenben" v-html="detail.serviceDetail">
                            
                        </div> -->
                        <div class="item-detail"
                            :key="item"
                            v-for="(item) in Object.keys(detail.mitems)">
                            <p class="title"
                                v-if="item!=='null'">{{item}}</p>
                            <div class="project"
                                :key="p.id"
                                v-for="(p) in detail.mitems[item].project">
                                <p class="prj-name">
                                    <span>{{p.cName | formatBrackets()}}:</span>
                                    <span>
                                        <mu-icon value="info"
                                            color="grey"
                                            size="20"
                                            @click="showWorth(p.cWorth)"></mu-icon>
                                    </span>
                                </p>
                                <p class="prj-content">{{p.cContent}}</p>
                            </div>
                        </div>
                    </div>

                    <div class="info-block"
                        v-if="detail && detail.medicalNotice">
                        <div class="sub-title bar">
                            体检须知
                        </div>
                        <div class="content">
                            <p :key="kkk"
                                v-for="(d, kkk) in detail.medicalNotice.split('\n').filter( x => !!x)">
                                {{ d }}
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </skt-list>

        <mu-dialog title="体检项目意义"
            width="360"
            :open.sync="show">
            {{showModalText}}
        </mu-dialog>

        <!-- 底部按钮 -->
        <div class="btn-block"
            v-if="detail">
            <div class="info">
                套餐金额：
                <span class="price">
                    ¥{{ detail.price }}
                </span>
            </div>
            <div class="btn"
                @click="goBooking( $route.params.id )">
                预约体检
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyHeader from "../../../components/my-header/index.vue";
import SktList from "../../../components/skeleton-list/index.vue";
import vanPopup from "vant/lib/popup";

Vue.filter("formatBrackets", (str = "") => {
  return str.replace(/\[.+?\]/g, "");
});

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: {
    SktList,
    MyHeader,
    vanPopup
  }
})
export default class HealthCheckDetail extends Vue {
  /** 加载 */
  private loading = true;

  private show = false;

  private showModalText = "";

  private bodyCheckList = [];
  /** 详情 */
  private detail: App.healthCardDetail | null = null;

  private sorting(arrData: object[]) {
    const newObj = {};
    arrData.map((item: any) => {
      const tItem = this.convertItem(item.name);
      if (tItem) {
        if (newObj[item.categoryName]) {
          newObj[item.categoryName].project.push(Object.assign(item, tItem));
        } else {
          newObj[item.categoryName] = {
            project: [Object.assign(item, tItem)]
          };
        }
      }
    });
    return newObj;
  }

  /** 拉取 */
  private fetchDetail(id) {
    // this.http$.get< normalResult< App.healthCardDetail >>({
    this.http$
      .get<any>(
        {
          url: `/api/health-check/detail/${id}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        console.log("请求", data);
        if (status !== 200) {
          return;
        }
        this.detail = Object.assign(data, { mitems: this.sorting(data.items) });
        console.log(this.detail);
        this.loading = false;
      });
  }

  /** 预约 */
  private goBooking(id) {
    if (
      !!this.detail &&
      this.detail.ext &&
      this.$route.params.id !== "b6bf104ee7e24b24a2bd10256b1f257b"
    ) {
      //
      // https://m-health-wx.cvte.com
      this.globalStore$.Store.packageDetail.ext = this.detail.ext;
      this.$router.push(`/booking/health-check/${id}`); // 跳转至门诊
    } else {
      this.$router.push(
        `/appointment/doctors?id=35c6e14d4fdc4b80888b55b624155f7a&deptId=e5e16484a3cf47e18e5fc6d7ab5f143e`
      ); // 跳转至个人体检预约
    }
    // if ( !!this.detail && !this.detail.isUse && this.detail.cardState !== '6' ) {
    //     if(this.detail.ext && this.detail.ext.isRefClinic === '1'){
    //         // b6bf104ee7e24b24a2bd10256b1f257b
    //         // https://m-health-wx.cvte.com/appointment/deptorderform?centerId=35c6e14d4fdc4b80888b55b624155f7a&deptId=e5e16484a3cf47e18e5fc6d7ab5f143e&doctorId=96f410c72eed4a99a715dd434fdc82d9&firstDept=undefined
    //         this.globalStore$.Store.packageDetail.ext = this.detail.ext;
    //         this.$router.push(`/booking/body-check`); // 跳转至门诊
    //     } else {
    //         this.$router.push(`/booking/health-check/${id}`); // 跳转至个人体检预约
    //     }
    // }
  }

  private showWorth(item) {
    // Dialog.alert({
    //     message: item
    // })
    console.log(item);
    this.show = true;
    this.showModalText = item;
  }

  private fetchBodyCheckList() {
    this.http$
      .get<any>(
        {
          url: `/api/health-check/item/list`
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
        this.bodyCheckList = data;
        this.fetchDetail(this.$route.params.id);
      });
  }

  private convertItem(id) {
    const res: {
      name: string;
      id: string;
      content: string;
      worth: string;
    }[] = this.bodyCheckList.filter((item: any) => item.id === id);
    return res.length > 0
      ? { cName: res[0].name, cContent: res[0].content, cWorth: res[0].worth }
      : {};
  }

  /** 图片下载地址转换 */
  private convert(imgid) {
    const tanentId = "c69e6168-d231-4e2a-b0e1-580263f3f77b";
    const downBaseUrl =
      process.env.NODE_ENV === "dev"
        ? // `https://csbtest-api.gz.cvte.cn/cfile/${tanentId}/v1/download/` :
          `https://itapis.cvte.com/cfile/${tanentId}/v1/download/`
        : `https://itapis.cvte.com/cfile/${tanentId}/v1/download/`;
    return `${downBaseUrl}${imgid}`;
  }

  private getPhotoUrl(url) {
    const urls = url.split("/");
    return `/api/order/getPhoto/${urls[urls.length - 1]}`;
  }

  mounted() {
    this.fetchBodyCheckList();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
<style lang="less">
@import "~vant/lib/popup/index.less";
</style>
