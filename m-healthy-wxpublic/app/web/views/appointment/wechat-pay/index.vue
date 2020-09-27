<template>
    <div class="wechat-pay-page">
      <skt-list :loading="loading">
        <div class="container-block">
          <!-- 预约记录列表 -->
          <div class="m-pay-card">
            <div class="header inline-container">
              <span class="m-title">
                <span class="m-icon-hospital">
                  <mu-icon value="info"></mu-icon>
                </span>
                <span class="m-text-hospital">预约信息</span>
              </span>
            </div>
            <div class="content">
              <div class="inline-container small">
                <div>
                  就诊人：{{orderData.reserveInfo.patient.name}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  手机号：{{orderData.reserveInfo.patient.mobileNumber}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  身份证号码：{{orderData.reserveInfo.patient.cardNumber}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  就诊科室：{{orderData.reserveInfo.dept.name}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  就诊地点：{{orderData.reserveInfo.center.name}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  预约就诊时间：{{orderData.reserveInfo.reserveDate}}
                </div>
              </div>
              <!-- <div class="inline-container small">
                            <div>
                                就诊说明：你得憋尿
                            </div>
                        </div> -->
            </div>
          </div>
          <div class="m-pay-card">
            <div class="header inline-container">
              <span class="m-title">
                <span class="m-icon-hospital">
                  <mu-icon value="book"></mu-icon>
                </span>
                <span class="m-text-hospital">订单信息</span>
              </span>
            </div>
            <div class="content">
              <div class="inline-container small">
                <div>
                  订单号：{{orderData.orderInfoDTO.orderNo}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  下单时间：{{orderData.orderInfoDTO.crtTime}}
                </div>
              </div>
              <div class="inline-container small">
                <div>
                  预约渠道：{{orderData.orderInfoDTO.channel}}
                </div>
              </div>
            </div>
          </div>
          <div class="m-pay-card">
            <div class="record inline-container">
              <!-- 原价显示 -->
              <div :key="index"
                class="item-list"
                v-for="(item , index) in orderData.orderInfoDTO.item">
                <span class="m-title">
                  <span class="m-text-pay">{{item.detail.itemName}}</span>
                </span>
                <span class="m-text-money">
                  ￥ {{(item.detail.originItemPrice).toFixed(2)}}
                </span>
              </div>
             <!-- 折扣价格显示 -->
             <div 
                class="item-list"
                v-if="orderData.orderInfoDTO.discountPrice!==0"
                >
                <span class="m-title">
                  <span class="m-text-pay">员工优惠</span>
                </span>
                <span class="m-text-money">
                  ￥ {{(0 - orderData.orderInfoDTO.discountPrice).toFixed(2)}}
                  
                </span>
              </div>
            </div>
            <!-- <div class="record inline-container">
               
              <div :key="index"
                class="item-list"
                v-for="(item , index) in orderData.orderInfoDTO.item">
                <span class="m-title">
                  <span class="m-text-pay">{{item.detail.itemName}}(减免)</span>
                </span>
                <span class="m-text-money">
                  ￥ {{((item.detail.originItemPrice-item.detail.discountAmount)/100)}}
                </span>
              </div>
            </div> -->
            <div class="audit-btns m-btn-pay">
              <div class="money"> </div>
              <div class="operation">总计:
                <span class="m-btn-money"> ￥ {{(orderData.orderInfoDTO.actualPrice).toFixed(2)}}
                </span>
              </div>
            </div>
          </div>

        </div>
      </skt-list>

      <div class="pay-bottom-bar"
        v-if="orderData.orderInfoDTO.hasOwnProperty('orderId') && alreadyFetch">
        <div class="time"
          v-if="this.orderData.orderInfoDTO.orderStatusCode === '2'">
          剩余时间：
          <span>{{remainingTime}}</span>
        </div>
        <div class='btns'
          v-if="this.orderData.orderInfoDTO.orderStatusCode === '2' &&new Date().getTime() - new Date(this.orderData.orderInfoDTO.crtDate ).getTime() - 30*60*1000 < 0">
          <button class='cancle'
            @click="cancelConfirm">取消订单</button>
          <button class='confirm'
            @click="submit">{{ orderData.orderInfoDTO.actualPrice !== 0?(paying ? '支付中...' : '微信支付' ) : '确认预约'}}</button>
        </div>
        <div class='btns return-good'
          v-if="this.orderData.orderInfoDTO.orderStatusCode === '1' || this.orderData.orderInfoDTO.orderStatusCode === '6'">
          <button class='confirm'
            @click="cancelConfirm">{{orderData.orderInfoDTO.payMethodCode === '3' ? '取消预约' : '退款'}}</button>
        </div>
      </div>
      <mu-bottom-sheet :key="2"
        :open.sync="showDialog">
        <mu-flex justify-content="between">
          <mu-flex justify-content="center">
            <mu-button flat
              @click="showDialog=false">
              取消
            </mu-button>
          </mu-flex>
          <mu-flex justify-content="center">
            <mu-button flat
              color="primary"
              @click="cancel">
              确认
            </mu-button>
          </mu-flex>
        </mu-flex>
        <div class="cancle-warper"
          ref="form">
          <van-picker :values="reason"
            title="请选择原因"
            :columns="cancleReasonList"
            @change="onSelectChange" />
        </div>
      </mu-bottom-sheet>
    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import MyForm from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";
import Picker from "vant/lib/picker";
import { setTimeout } from "timers";
import {debounce} from 'lodash';

/**
 * @description 体检预约记录
 */
@inject({ selector: ["account$", "globalStore$", "appointment$"] })
@Component({
  components: {
    MyForm,
    SktList,
    "van-picker": Picker
  }
})
export default class BookingRecordBodyCheck extends Vue {
  /** 当前选中的预约ID */
  private selectingId = "";

  /** 取消的原因列表 */
  private cancleReasonList = [
    "计划变更",
    "信息填写有误",
    "重复预约",
    "医生停诊",
    "其他"
  ];

  private alreadyFetch = false;

  /** 取消预约的原因 */
  private reason = this.cancleReasonList[0];

  /** 订单详情 */
  private orderData: any = {
    orderInfoDTO: {
      orderStatusCode: "",
      orderNo: "",
      orderId: "",
      crtTime: "",
      channel: "",
      totalPrice: 0,
      discountPrice: 0,
      actualPrice: 0,
      payMethodCode: 0,
      item: [
        {
          detail: {
            itemName: "",
            originItemPrice: 0,
            discountAmount: 0
          }
        }
      ]
    },
    reserveInfo: {
      reserveDate: "",
      patient: {
        name: "",
        mobileNumber: "",
        cardNumber: ""
      },
      center: {
        name: ""
      },
      dept:{
        name: ''
      }
    }
  };

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_CLINIC_CANCEL_REASON: [],
    HMS_CLINIC_TYPE: []
  };

  /** form */
  get meta(): C.MyForm.meta {
    return [
      [
        {
          key: "reason",
          type: "select",
          label: "取消原因",
          options: this.dic.HMS_CLINIC_CANCEL_REASON,
          rules: [
            {
              validate: val => !!val,
              message: "请选择取消原因"
            }
          ]
        }
      ]
    ];
  }

  /** 对话框 */
  private showDialog = false;

  /** 加载中 */
  private loading = true;

  /** 支付loading */
  private paying = false;

  /** 付款剩余时间 */
  private remainingTime = 0;

  /** 记录列表 */
  private recordList: App.bodyCheckRecord = [];

  @Watch("$route", { deep: true })
  onRoute(route) {
    const { tab } = route.query;
    if (Number(tab) === 1) {
      //   this.fetchRecord();
    }
  }

  private onSelectChange(picker, value, index) {
    this.reason = value;
  }

  private submit =  debounce( this.handlePay , 300 );

  /** 付款 */
  private handlePay() {
    if (this.paying || !this.orderData.orderInfoDTO.orderId) {
      return;
    }

    // return ;
    this.paying = true;
    this.http$
      .post(
        {
          url: `/api/order/reserve/pay`,
          data: {
            createIp: this.account$.wx.ip,
            orderId: this.orderData.orderInfoDTO.orderId,
            /** 改正 */
            // orderPrice: this.orderData.orderInfoDTO.item.reduce(
            //   (sumSoFar, item) => {
            //     return (sumSoFar += item.detail.originItemPrice);
            //   },
            //   0
            // )
            orderPrice: this.orderData.orderInfoDTO.actualPrice.toFixed(2)>0?this.orderData.orderInfoDTO.actualPrice.toFixed(2):0
          }
        },
        {
          errMsg: this.orderData.orderInfoDTO.actualPrice===0? '确认失败...': '支付失败...',
          loadMsg: this.orderData.orderInfoDTO.actualPrice===0? '确认中...': '支付中...'
        }
      )
      .then((res: any) => {
        this.paying = false;
        if (res.status !== 200) {
          this.$toast.message(res.message||"操作错误，请重试...");
          return ;
        }
        if(this.orderData.orderInfoDTO.actualPrice===0) {
          setTimeout(() => {
                this.$router.replace(`/appointment/record`);
              }, 1500);
          return ;
        }

        // 发起微信支付
        (window as any).WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          res.data,
          res => {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              const load = this.loading$.msg('处理中...');
              setTimeout(() => {
                load.close();
                this.$router.replace(`/appointment/record`);
              }, 3000);
            } else {
              /** 调用后端改变状态接口 */
               this.http$
                .put({
                  // url: `/api/order/reserve/order/${this.orderData.orderInfoDTO.orderId}?status=${2}`
                  url: `/api/v1/reserve/order/${this.orderData.orderInfoDTO.orderId}?status=${2}`
                })
                .then(res => {
                  this.orderData.orderInfoDTO.orderStatusCode = '2';
                });
            }
          }
        );
      })
      .catch(e => {
        this.paying = false;
        this.$toast.error("网络错误，请重试"); 
      });
  }

  /** 倒计时器 */
  private clock(endTime: number, callback: (value) => void) {
    return () => {
      var today = new Date(); //当前时间
      const h = today.getHours();
      const m = today.getMinutes();
      const s = today.getSeconds();
      var stopTime = new Date(endTime); //结束时间

      var shenyu = stopTime.getTime() - today.getTime(); //倒计时毫秒数
      const shengyuD = parseInt(String(shenyu / (60 * 60 * 24 * 1000))); //转换为天
      const D =
        parseInt(String(shenyu)) -
        parseInt(String(shengyuD * 60 * 60 * 24 * 1000)); //除去天的毫秒数
      const shengyuH = parseInt(String(D / (60 * 60 * 1000))); //除去天的毫秒数转换成小时
      const H = D - shengyuH * 60 * 60 * 1000; //除去天、小时的毫秒数
      const shengyuM = parseInt(String(H / (60 * 1000))); //除去天的毫秒数转换成分钟
      const M = H - shengyuM * 60 * 1000; //除去天、小时、分的毫秒数
      const S = parseInt(
        String(
          (shenyu -
            shengyuD * 60 * 60 * 24 * 1000 -
            shengyuH * 60 * 60 * 1000 -
            shengyuM * 60 * 1000) /
            1000
        )
      ); //除去天、小时、分的毫秒数转化为秒
      callback(
        `${String(shengyuM).length === 1 ? `0${shengyuM}` : shengyuM}:${
          String(S).length === 1 ? `0${S}` : S
        }`
      );
      if (new Date().getTime() - new Date(endTime).getTime() <= 100) {
        const handle = this.clock(endTime, callback);
        setTimeout(handle, 1000);
      }
    };
  }

  /** 开启定时器 */
  private handleCountDown(endTime: number, callback: (value) => void) {
    const handle = this.clock(endTime, callback);
    setTimeout(handle, 1000);
  }

  /** 取消预约 / 退款 */
  private cancel() {
    if (!this.reason.length) {
      return (this as any).$toast.error("请填写取消原因");
    }
    const reqData = {
      orderId: this.orderData.orderInfoDTO.orderId,
      remark: this.reason[0]
    };

    this.http$
      .post<any>(
        {
          data: reqData,
          url: `/api/order/reserve/cancel`
        },
        {
          successMsg: "操作成功",
          loadMsg: "请稍等..."
        }
      )
      .then(res => {
        const { status } = res;
        if (status === 200) {
          (this as any).$router.replace("/appointment/record");
        }
      });
  }

  /** 取消预约 / 退款 */
  private cancelConfirm(id) {
    this.selectingId = id;
    this.showDialog = true;
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_CLINIC_CANCEL_REASON,HMS_CLINIC_TYPE`
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
          HMS_CLINIC_CANCEL_REASON: data.HMS_CLINIC_CANCEL_REASON.map(x => ({
            label: x.name,
            value: x.itemValue
          })),
          HMS_CLINIC_TYPE: data.HMS_CLINIC_TYPE.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
      });
  }
  /** 拉取预约订单 */
  private fetchOrderRecord() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/order/reserve/order/${
            (this as any).$router.history.current.query.id
          }`
        },
        {
          errMsg: "加载错误",
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        this.loading = false;
        if (status !== 200) {
          return;
        }
        this.alreadyFetch = true;
        this.orderData = data;
        this.handleCountDown(
          new Date(this.orderData.orderInfoDTO.crtDate).getTime() +
            10 * 60 * 1000,
          value => {
            if (
              new Date().getTime() -
                new Date(this.orderData.orderInfoDTO.crtDate).getTime() -
                10 * 60 * 1000 <
              0
            ) {
              this.remainingTime = value;
            }
          }
        );
      });
  }

  mounted() {
    this.fetchOrderRecord();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
