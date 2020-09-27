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
                我的订单
            </span>
        </my-header>

        <skt-list
            :loading="loading"
        >
            <div class="container-block">
                <!-- 预约记录列表 -->
                <ul class="record-list">
                    <li
                        :key="k"
                        v-for="(record, k) in recordList$"
                        @click="$router.push(`/my-order/detail/${record.id}`)"
                    >
                        <div class="header inline-container">
                            <mu-icon value="person" color="green" />
                            <!-- 个人健康体检 -->
                            <span class="type-text">
                                个人健康体检
                            </span>
                            <span
                                :class="{ active: record.appointStatus }"
                                v-if="record.appointStatus !== '1'"
                            >
                                {{ dic.HMS_PERSONAL_APPOINT_STATUS.find( x => x.value === record.appointStatus) ? dic.HMS_PERSONAL_APPOINT_STATUS.find( x => x.value == record.appointStatus).label : '' }}
                            </span>
                            <span
                                :class="{ active: record.appointStatus }"
                                v-if="record.appointStatus === '1'"
                            >
                                {{ record.isPay === '1' ? '待确认': 
                                        dic.HMS_PERSONAL_APPOINT_STATUS.find( x => x.value === record.appointStatus) ? dic.HMS_PERSONAL_APPOINT_STATUS.find( x => x.value == record.appointStatus).label : ''
                                }}
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small">
                                <div class="big">
                                    {{ record.onLinePackageName }}
                                </div>
                            </div>
                             <div class="inline-container small">
                                <div>
                                    体检人：{{ record.medicalUserName }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                 <div>
                                    <!-- 体检时间：{{ record.appointMedicalDate && new Date(record.appointMedicalDate).getTime()}} -->
                                    体检时间：{{ record.appointMedicalDate }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    体检地点：{{ dic.HMS_MEDICAL_SITE.find( x => x.value === record.medicalSite) ? dic.HMS_MEDICAL_SITE.find( x => x.value == record.medicalSite).label : '' }}
                                </div>
                            </div>
                             <div class="inline-container small" v-if="record.cancelReason">
                                <div>
                                    取消原因：{{ record.cancelReason }}
                                </div>
                            </div>
                        </div>
                        <div
                            class="order-pay-info"
                            v-if="record.appointStatus === '1' && record.isPay === '0' && !!record.countdown "
                        >
                            <span>
                                应付：¥{{ record.price }}
                            </span>
                            <span
                                class="order-pay-price"
                                @click="e => goPay( record.id, e )"
                            >
                                去支付 {{ record.countdown.length > 0 ? `${record.countdown[ 0 ]}${record.countdown[ 1 ]} : ${record.countdown[ 2 ]}${record.countdown[ 3 ]}` : ''
                                }}
                            </span>
                        </div>
                        <div
                            class="btn"
                            @click="cancelConfirm(record.id)"
                            v-if="record.canCancel"
                        >
                            取消订单
                        </div>
                    </li>
                </ul> 
                <p class="tips">
                    <span>
                        {{
                            recordList.length !== 0 ?
                                '没有更多数据了' :
                                '空空如也'
                        }}
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
import { timestampToTime } from '../../../common/function';
import { setInterval } from 'timers';

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

   /** 现在的时间 */
   private now = new Date( ).getTime( );

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
    HMS_MEDICAL_SITE: []
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

  /** 记录列表 */
  private recordList: any = [];

  get recordList$( ) {

      return this.recordList.map( x => {

          const temp = x;

          if ( this.now - x.crtTime < 30 * 60 * 1000 ) {

            // 超出时间
            const exceed = new Date( ).getTime( ) - x.crtTime;
            if ( exceed >= 30 * 60 * 1000 ) {
                return temp;
            }

            // 剩余时间
            const surplus = 30 * 60 * 1000 - exceed;
            // 秒的余数
            const secondTimestamp = surplus % ( 60 * 1000 );

            const minutes = Math.floor( surplus / ( 60 * 1000 ));
            const second = Math.floor( secondTimestamp / 1000 );

            const Minutes = String( minutes ).length === 1 ? `0${minutes}` : String( minutes );
            const Seconds = String( second ).length === 1 ? `0${second}` : String( second );

            temp['countdown'] = [ Minutes[ 0 ], Minutes[ 1 ], Seconds[ 0 ], Seconds[ 1 ]];

          } else if ( this.now - x.crtTime >= 30 * 60 * 1000 && x.appointStatus === '1' ){
              temp['appointStatus'] = '6'
          }
          return temp;
      });
  }

  @Watch("$route", { deep: true })
  onRoute(route) {
    const { tab } = route.query;
    if (Number(tab) === 1) {
      this.fetchRecord();
    }
  }

  /** 付款 */
  private goPay( orderId, e ) {
      e.stopPropagation( );
      this.$router.push(`/common/order-pay-preview/${orderId}?next=/my-order/list`);
  }

  /** 取消预约 */
  private cancel() {
    const { result, data } = (this.$refs.form as any).getData();
    if (!result) {
      return this.$toast.error("请填写取消原因");
    }
    const reqData = {
      cancelReason: data.reason,
      id: (this.recordList.find(x => x.id === this.selectingId) as any)
        .id
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
          this.fetchRecord();
          this.showDialog = false;
          (this.$refs.form as any).reset();
        }
      });
  }

  /** 拉取记录 */
  private fetchRecord() {
    // this.http$
    // //   .get<Api.get.bookingRecord>(
    //   .get<Api.get.bookingRecord>(
    this.http$.get< normalResult< any >>(
        {
          url: `/api/my-order`
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
        const now = new Date().getTime();
        data.map((x: any) => {
            // 预约状态为待确认的，时间在预约时间之前，都可以取消订单
            if(x.appointStatus === '2' && Number(now) <= Number(new Date(x.appointMedicalDate).getTime())) {
                x.canCancel = true;
            }
            // 预约状态为已预约的，时间在预约时间24小时之前，都可以取消订单
            if(x.appointStatus === '3' && Number(now) <= Number(new Date(x.appointMedicalDate).getTime()) - 3600*1000*24) {
                x.canCancel = true;
            }
            // x.appointMedicalDate = timestampToTime(x.appointMedicalDate);
            const d = new Date( x.appointMedicalDate );
            x.appointMedicalDate = `${d.getFullYear( )}-${d.getMonth( ) + 1}-${d.getDate( )}`;
        });
        this.recordList = data;
        (document as any).documentElement.scrollTop = (document as any).body.scrollTop = 0;
      });
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
          url: `/api/common/dic?typeCode=HMS_CLINIC_CANCEL_REASON,HMS_CLINIC_TYPE,HMS_PERSONAL_APPOINT_STATUS,HMS_MEDICAL_SITE`
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
          }))
        });
      });
  }

  /** 倒计时 */
  private countDown( ) {
      setInterval(( ) => {
          this.now = new Date( ).getTime( );
      }, 500 );
  }

  mounted() {
    this.fetchDic();
    this.fetchRecord();
    this.countDown();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
