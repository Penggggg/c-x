<template>
    <div class="con-booking-record-bodycheck">
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
                订单详情
            </span>
        </my-header>

        <skt-list
            :loading="loading"
        >
            <div class="container-block" v-if="detail">
                <!-- 详情 -->
                <ul class="record-list">
                    <li
                    >
                        <div class="header inline-container">
                            <span>
                                预约信息
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small">
                                <div>
                                    体检人：{{ detail.medicalUser.name }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    手机号：{{ detail.medicalUser.telephone }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    身份证号：{{ detail.medicalUser.identityCard }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                 <div>
                                    体检时间：{{ detail.appointMedicalDate }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    体检地点：{{ dic.HMS_MEDICAL_SITE.find( x => x.value === detail.medicalSite) ? dic.HMS_MEDICAL_SITE.find( x => x.value == detail.medicalSite).label : '' }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    体检说明：{{ detail.remark }}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li
                    >
                        <div class="header inline-container">
                            <span>
                                订单信息
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small">
                                <div>
                                    订单号：{{ detail.orderNumber }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    下单时间：{{ detail.crtTime }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    预约渠道：{{ dic.HMS_PERSONAL_APPOINT_CHANNEL.find( x => x.value === detail.appointChannel) ? dic.HMS_PERSONAL_APPOINT_CHANNEL.find( x => x.value == detail.appointChannel).label : '' }}
                                </div>
                            </div>
                             <div class="inline-container small" v-if="detail.cancelReason">
                                <div>
                                    取消原因：{{ detail.cancelReason }}
                                </div>
                            </div>
                        </div>
                    </li>
                    <li
                    >
                        <div class="header inline-container">
                            <span>
                                {{detail.packageName}}
                            </span>
                            <span>
                                ¥{{detail.price && detail.price.toFixed(2) || 0.00}}
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small right">
                                <div class="account">
                                    总计：<span class="active">¥{{detail.price && detail.price.toFixed(2) || 0.00}}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="btn"
                            @click="cancelConfirm(detail.id)"
                            v-if="detail.canCancel"
                        >
                            取消订单
                        </div>
                    </li>
                    <li v-if="detail && detail.appointStatus === '1' && (new Date( ).getTime( ) - detail.crtTime ) < 30 * 60 * 1000">
                        <div class="pay-block">
                            <div class="pay-title">
                                <div class="pay-label">剩余时间:</div>
                                <div
                                    v-if="countDownText.length > 0"
                                    class="pay-time"
                                >
                                    {{ countDownText[ 0 ]}}{{ countDownText[ 1 ]}} : {{ countDownText[ 2 ]}}{{ countDownText[ 3 ]}}
                                </div>
                            </div>
                            <div class="pay-btns">
                                <div
                                    class="pay-btn"
                                    @click="showDialog = true"
                                >
                                    取消订单
                                </div>
                                <div class="pay-btn2" @click="e => goPay( detail.id )">去支付</div>
                            </div>
                        </div>
                    </li>
                </ul> 
                <p class="tips" v-if="detail.length === 0">
                    <span>
                       空空如也
                    </span>
                </p>
            </div>
        </skt-list>

         <!-- 删除确认 -->
        <mu-dialog title="提示" class="booking-list-dialog" width="360" :open.sync="showDialog">
            确认取消该预约吗?
            <my-form
                ref="form"
                :meta="meta"
            />
            <mu-button
                flat
                slot="actions"
                color="primary"
                @click="cancel"
            >
                确认
            </mu-button>
            <mu-button
                flat
                slot="actions"
                color="error"
                @click="showDialog=false"
            >
                取消
            </mu-button>
        </mu-dialog>

        <!-- 输入好取消预约的原因 -->


    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import MyForm from "../../../components/my-form-v2/index.vue";
import MyHeader from "../../../components/my-header/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";
import { timestampToTime } from "../../../common/function";

/**
 * @description 体检预约记录
 */
@inject({})
@Component({
  components: {
    MyHeader,
    MyForm,
    SktList
  }
})
export default class MyOrderList extends Vue {
  /** 当前选中的预约ID */
  private selectingId = "";

  /** 取消预约的原因 */
  private reason = "";

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_CLINIC_CANCEL_REASON: [],
    HMS_CLINIC_TYPE: [],
    HMS_PERSONAL_APPOINT_STATUS: [],
    HMS_MEDICAL_SITE: [],
    HMS_PERSONAL_APPOINT_CHANNEL: []
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

  get countDownText( ) {
    const Minutes = String( this.minutes ).length === 1 ? `0${this.minutes}` : String( this.minutes );
    const Seconds = String( this.second ).length === 1 ? `0${this.second}` : String( this.second );
    return [ Minutes[ 0 ], Minutes[ 1 ], Seconds[ 0 ], Seconds[ 1 ]];
  }

  /** 订单创建时间 */
  private crtTime!: number;

  /** 对话框 */
  private showDialog = false;

  /** 加载中 */
  private loading = true;

  /** 详情 */
  private detail: App.healthCardDetail | null = null;

  /** 倒计时 - 分 */  
  private minutes = 30;

  /** 倒计时 - 秒 */
  private second = 0;

  /** 付款 */
  private goPay( orderId ) {
      this.$router.replace(`/common/order-pay-preview/${orderId}?next=/my-order/list`);
  }

  /** 取消预约 */
  private cancel() {
    const { result, data } = (this.$refs.form as any).getData();
    if (!result) {
      return this.$toast.error("请填写取消原因");
    }
    const reqData = {
      cancelReason: data.reason,
      id: this.$route.params.id
    };

    this.http$
      .post<normalResult<any>>(
        {
          data: reqData,
          url: `/api/my-order/cancel`
        },
        {
          successMsg: "取消成功",
          loadMsg: "取消中..."
        }
      )
      .then(res => {
        const { status } = res;
        if (status === 200) {
          this.fetchDetail(this.$route.params.id);
          this.showDialog = false;
          (this.$refs.form as any).reset();
        }
      });
  }

  /** 取消订单 */
  private cancelOrder( ) {
      const orderId = this.$route.params.id;
  }

  /** 拉取 */
  private fetchDetail(id) {
    // this.http$.get< normalResult< App.healthCardDetail >>({
    this.http$
      .get<normalResult<any>>(
        {
          url: `/api/my-order/detail/${id}`
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

        this.crtTime = res.data.crtTime;
        if ( new Date( ).getTime( ) - res.data.crtTime < 30 * 60 * 1000 ) {
            this.countDown( );
        }
        
        const now = new Date().getTime();
        // 预约状态为待确认的，时间在预约时间之前，都可以取消订单
        if (
          data.appointStatus === "2" &&
          Number(now) <= Number(new Date(data.appointMedicalDate).getTime())
        ) {
          data.canCancel = true;
        }
        // 预约状态为已预约的，时间在预约时间24小时之前，都可以取消订单
        if (
          data.appointStatus === "3" &&
          Number(now) <=
            Number(new Date(data.appointMedicalDate).getTime()) - 3600 * 1000 * 24
        ) {
          data.canCancel = true;
        }
        const d1 = new Date( data.appointMedicalDate );
        data.appointMedicalDate = `${d1.getFullYear( )}-${d1.getMonth( ) + 1}-${d1.getDate( )}`;
        // data.appointMedicalDate = timestampToTime(data.appointMedicalDate);
        data.crtTime = timestampToTime(data.crtTime);
        this.detail = data;
        this.loading = false;
      });
  }

    private countDown( ) {

        const clock = setInterval(( ) => {

            // 超出时间
            const exceed = new Date( ).getTime( ) - this.crtTime;

            if ( exceed >= 30 * 60 * 1000 ) {
                clearInterval( clock );
                return this.fetchDetail( this.$route.params.id );
            }

            // 剩余时间
            const surplus = 30 * 60 * 1000 - exceed;
            // 秒的余数
            const secondTimestamp = surplus % ( 60 * 1000 );
            
            this.minutes = Math.floor( surplus / ( 60 * 1000 ));
            this.second = Math.floor( secondTimestamp / 1000 );

        }, 500 );

    }

  /** 取消预约 */
  private cancelConfirm(id) {
    this.selectingId = id;
    this.showDialog = true;
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_CLINIC_CANCEL_REASON,HMS_CLINIC_TYPE,HMS_PERSONAL_APPOINT_STATUS,HMS_MEDICAL_SITE,HMS_PERSONAL_APPOINT_CHANNEL`
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
          })),
          HMS_PERSONAL_APPOINT_STATUS: data.HMS_PERSONAL_APPOINT_STATUS.map(
            x => ({
              label: x.name,
              value: x.itemValue
            })
          ),
          HMS_MEDICAL_SITE: data.HMS_MEDICAL_SITE.map(x => ({
            label: x.name,
            value: x.itemValue
          })),
          HMS_PERSONAL_APPOINT_CHANNEL: data.HMS_PERSONAL_APPOINT_CHANNEL.map(
            x => ({
              label: x.name,
              value: x.itemValue
            })
          )
        });
      });
  }

  mounted() {
    this.fetchDic();
    this.fetchDetail(this.$route.params.id);
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
