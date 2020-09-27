<template>
    <div class="con-booking-record-bodycheck">
        <skt-list :loading="loading">
            <div class="container-block">
                <!-- 预约记录列表 -->
                <ul class="record-list">
                    <li :key="k"
                        v-for="(record, k) in recordList">
                        <div class="header inline-container">
                            <span class="m-title">
                                <span class="m-icon-hospital">
                                    <mu-icon value="local_hospital"></mu-icon>
                                </span>
                                <span class="m-text-hospital">{{ record.reserveType }}</span>
                            </span>
                            <span :class="{ active: record.canCancel }"
                                :style="{color:((new Date().getTime() - record.orderCreateTime - 30*60*1000) < 0 &&( record.payStatus === '2' || record.payStatus === '6')?'#00D0B9':'#666')}">
                                {{handlePayStatus(record)}}
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small">
                                <div>
                                    就诊时间：{{ record.visitDate }}
                                </div>
                                <div>
                                    {{record.deptName}}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    就诊人：{{ record.patientName }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    主治医生：{{ record.doctorName }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    订单时间：{{ record.orderCrtTime }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    订单编号：{{ record.orderNo }}
                                </div>
                            </div>
                            <div class="inline-container small"
                                v-if="record.cancelReason">
                                <div>
                                    取消原因：{{ record.cancelReason }}
                                </div>
                            </div>
                        </div>
                        <div class="audit-btns btn-group" v-if="record.payStatus === '2' && (new Date().getTime() - record.orderCreateTime - 10*60*1000) < 0">
                            <div class="money">￥ {{record.orderPrice.toFixed(2)}}</div>
                            <div class="operation">
                                <button @click="handleAudit(record)">去支付 {{times[k]}}
                                </button>
                            </div>
                        </div>
                        <div class="audit-btns btn-group" v-if="record.payStatus === '1' || record.payStatus === '6'">
                            <div class="money">￥ {{record.orderPrice.toFixed(2)}}</div>
                            <div class="operation">
                                <button @click="handleAudit(record)">订单详情 
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <p class="tips">
                    <span>
                        {{ recordList.length !== 0 ? '没有更多数据了' : '空空如也' }}
                    </span>
                </p>
            </div>
        </skt-list>

        <!-- 删除确认 -->
        <mu-dialog title="提示"
            class="booking-list-dialog"
            width="360"
            :open.sync="showDialog">
            确认取消该预约吗?
            <my-form ref="form"
                :meta="meta" />
            <mu-button flat
                slot="actions"
                color="primary"
                @click="cancel">
                确认
            </mu-button>
            <mu-button flat
                slot="actions"
                color="error"
                @click="showDialog=false">
                取消
            </mu-button>
        </mu-dialog>

        <!-- 输入好取消预约的原因 -->

    </div>
</template>
<script lang="ts">
import { observe, toJS } from "mobx";
import { inject } from "../../../service/inject";
import MyForm from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import SktList from "../../../components/skeleton-list/index.vue";

/**
 * @description 体检预约记录
 */
@inject({ selector: ["globalStore$", "account$"] })
@Component({
  components: {
    MyForm,
    SktList
  }
})
export default class BookingRecordBodyCheck extends Vue {
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
  private loading = false;

  private times: string[] = [];

  /** 记录列表 */
  private recordList: App.bodyCheckRecord = [];

  @Watch("$route", { deep: true })
  onRoute(route) {
    const { tab } = route.query;
    if (Number(tab) === 1) {
      this.fetchRecord();
    }
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
      callback(`${String(shengyuM).length === 1 ? `0${shengyuM}` :shengyuM}:${String(S).length === 1 ? `0${S}` :S}`);
      if (
        new Date().getTime() -new Date(endTime).getTime()  <=
        100
      ) {
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

  private handlePayStatus(item) {
    if(item.payStatus === '0'){
      return '已取消';
    }
    if(item.payStatus === '1'){
      return '已支付';
    }
    if(item.payStatus === '3'){
      return '已退款';
    }
    if(item.payStatus === '4'){
      return '支付失败';
    }
    if(item.payStatus === '6'){
      return '预约中';
    }
    return (new Date().getTime() - item.orderCreateTime - 10*60*1000) < 0 ?'待支付':'支付过期';
  }

  /** 路由跳转到地址 */
  private handleToForm(url) {
    (this as any).$router.push(url);
  }

  /** 微信清算 */
  private handleAudit(item) {
    this.handleToForm(`/appointment/wechatpay?id=${item.orderId}`);
  }

  /** 取消预约 */
  private cancel() {
    const { result, data } = (this.$refs.form as any).getData();
    if (!result) {
      return (this as any).$toast.error("请填写取消原因");
    }
    const reqData = {
      cancelReason: data.reason,
      reservationId: this.selectingId,
      shopId: (this.recordList.find(x => x.id === this.selectingId) as any)
        .shopId
    };

    this.http$
      .put<any>(
        {
          data: reqData,
          url: `/api/booking/clinic/cancel`
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
    this.loading = true;
    this.http$
      .get<Api.get.bookingRecord>(
        {
          url: `/api/booking/clinic`,
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
        if (status !== 200) {
          return;
        }

        this.loading = false;
        const now = new Date().getTime();
        this.recordList = data.map(x => {
          return {
            id: x.id,
            stage: x.reservationType,
            place: x.shopName,
            time: x.reservationTime,
            department: x.department,
            status: x.cancelReason
              ? "cancel"
              : now <= new Date(x.reservationTime.replace(/-/g, "/")).getTime()
                ? "ing"
                : "done",
            name: x.name,
            sex: x.sex,
            age: x.age,
            shopId: x.shopId,
            desc: x.reservationContent,
            cancelReason: x.cancelReason,
            canCancel:
              now <= new Date(x.reservationTime.replace(/-/g, "/")).getTime() &&
              !x.cancelReason
          };
        });
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

  private fetchRecordList() {
    this.loading = true;
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/order/list`,
          params: {
            applyUserId: this.account$.wx.systemUser.id,
            pageSize: 1000
          }
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
        this.recordList = data.dataList;
        this.recordList.map((item: any, index) => {
          (new Date().getTime() - item.orderCreateTime - 10*60*1000) < 0 &&
            this.handleCountDown(item.orderCreateTime + 10*60*1000, value => {
              this.times[index] = value;
              this.times = [...this.times];
            });
        });
      });
  }
  mounted() {
    if(this.account$.wx.systemUser.id !== '') {
      this.fetchRecordList();
    }else {
      observe(this.account$.wx, "systemUser", (change: any) => {
        this.fetchRecordList();
      });
    }
    this.fetchDic();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
