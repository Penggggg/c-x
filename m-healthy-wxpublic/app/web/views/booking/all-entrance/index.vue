<template>
    <div class="p-health-card-detail">

        <!-- 头部 -->
        <my-header
            :isfixed="true"
        >
            <span
                slot="left"
                @click="$router.back( )"
            >
                <mu-icon
                    value="keyboard_arrow_left"
                />
            </span>
            <span slot="center">
                服务大厅
            </span>
        </my-header>

        <!-- 详情 -->
        <skt-list
            :loading="loading"
        >
            <div class="container-block">

                <!-- 跑马灯 -->
                <my-carousel :configs="carouselConfigs">
                </my-carousel>

                <div class="info-block-container">
                    
                    <div class="menu-check space">
                        <div class="menu-check-item" @click="$router.push('/health-check/package?tab=0')">
                            个人健康体检
                            <mu-icon value="person" color="green" size="45"/>
                        </div>
                        <div class="menu-check-item" @click="()=>{$toast.info('暂未开发哦！')}" style="opacity: 0.6">
                            企业员工体检
                            <mu-icon value="people" color="black" size="45"/>
                        </div>
                    </div>

                    <div class="info-block">
                        <div class="sub-title bar">
                            便捷入口
                        </div>
                    </div>
                    <div class="menu-entrance space">

                            <div class="menu-entrance-item" @click="$router.push('/health-card/my?tab=0')">
                                <p class="icon-p">
                                    <mu-icon value="credit_card" color="green" size="45"/>
                                </p>
                                <p class="text-p">我的健康卡</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/my-order/list')">
                                <p class="icon-p">
                                    <mu-icon value="format_list_bulleted" color="green" size="45"/>
                                </p>
                                <p class="text-p">我的订单</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/record/body-check?tab=0')">
                                <p class="icon-p">
                                    <mu-icon value="description" color="green" size="45"/>
                                </p>
                                <p class="text-p">体检报告</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/account/family-members')">
                                <p class="icon-p">
                                    <mu-icon value="people" color="green" size="45"/>
                                </p>
                                <p class="text-p">家属成员</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/booking/body-check?tab=0&g=true&from=groupmessage')">
                                <p class="icon-p">
                                    <mu-icon value="alarm_add" color="green" size="45"/>
                                </p>
                                <p class="text-p">门诊预约</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/e/hall')">
                                <p class="icon-p">
                                    <mu-icon value="border_color" color="green" size="45"/>
                                </p>
                                <p class="text-p">自我探索</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/body-sign/list')">
                                <p class="icon-p">
                                    <mu-icon value="developer_board" color="green" size="45"/>
                                </p>
                                <p class="text-p">体征记录</p>
                            </div>
                            <div class="menu-entrance-item" @click="$router.push('/account/personal')">
                                <p class="icon-p">
                                    <mu-icon value="perm_contact_calendar" color="green" size="45"/>
                                </p>
                                <p class="text-p">个人中心</p>
                            </div>
                    </div>

                    <!-- 底部 -->
                    <div class="bottom">
                        <div class="logo-img">
                            <!-- <img src="../../../assets/logo-health.png"> -->
                            <img src="data:image/png;base64,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" />
                        </div>
                        <p class="address-name">广州视源健康管理中心</p>
                        <p class="address"><a href="https://uri.amap.com/marker?position=23.1551400000,113.5269200000&name=CVTE第二产业园"><mu-icon value="location_on" color="green" size="20"/></a>广州市黄埔区云埔四路6号1栋3、4 楼</p>
                        <div class="phone-button">
                            <a href="tel:4000-020-666"><mu-icon value="phone" color="green" size="20"/>4000-020-666</a>
                        </div>
                    </div>

                </div>

            </div>
        </skt-list>

        

    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyHeader from "../../../components/my-header/index.vue";
import SktList from "../../../components/skeleton-list/index.vue";
import MyCarousel from "../../../components/my-carousel/index.vue";

// import logoImg from "../../../assets/logo-health.png";

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    MyCarousel,
    SktList,
    MyHeader
  }
})
export default class AllEntrance extends Vue {
  /** 加载 */
  private loading = false;

  /** carousel配置 */
  private carouselConfigs = {
    interval: "3500",
    imgList: [
    //   this.convert("02a4acb8931f4789a9962138c02f7767"),
    //   this.convert("384aba94eb254559977d590791c03a5e")
    ]
  };

  /** 拉取 */
  private fetchImg() {
    this.http$
      .get<normalResult<any>>(
        {
          url: `/api/booking/carouselImages`,
          params: {
            type: 1
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
          const { status, data, message} = res;
          if(status === 200 ){
              const imgList = data.map(item => {
                  return this.convert(item.imgId);
              });
              this.carouselConfigs = {
                  interval: "3500",
                  imgList: imgList
              }
          }
      });
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

  mounted() {
    this.fetchImg();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
