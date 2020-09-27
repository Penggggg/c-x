<template>
    <div class="p-booking-health-card">

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
                体检预约
            </span>
        </my-header>

        <div class="base-info">

            <!-- 基本表单 -->
            <my-form
                ref="form"
                :meta="formMeta"
                @change="onFormChange"
            >
                 
                <p
                    class="fade"
                    @click="$toast.error('请先选择体检中心')"
                    v-if="!formData.medicalSite"
                >
                    预约时间
                </p>
                <mu-date-input
                    v-else
                    full-width
                    label-float
                    label="预约时间"
                    container="dialog"
                    v-model="formData.date"
                    :should-disable-date="disableDate"
                >
                    <template slot="day" slot-scope="{ selected, date, disabled, now}">
                        <div class="mu-day-button-bg"></div>
                        <div class="mu-day-button-content">
                            <span class="mu-day-button-text">
                                {{ date.getDate( )}}
                                <span
                                    class="date-tips"
                                    v-if="
                                        date.getTime( ) >= new Date( ).getTime( ) &&
                                        disabledTime.notAllow.find( x => new Date( x ).toLocaleDateString( ) === date.toLocaleDateString( ))"
                                >
                                    未开放
                                </span>
                                <span
                                    class="date-tips"
                                    v-if="
                                        date.getTime( ) >= new Date( ).getTime( ) &&
                                        disabledTime.hasBeenFull.find( x => new Date( x ).toLocaleDateString( ) === date.toLocaleDateString( ))"
                                >
                                    已满人
                                </span>
                            </span>
                        </div>
                    </template>
                </mu-date-input>
                <div class="multiinput-block">
                    <p class="small tips">
                        备注信息
                    </p>
                    <mu-text-field
                        :rows="3"
                        multi-line
                        :rows-max="6"
                        full-width
                        class="no-border"
                        placeholder="请录入病史或加项说明（1000字以内）"
                        v-model="formData.desc"
                    />
                </div>
            </my-form>

        </div>

        <!-- 体检人 -->
        <div class="Visiting-person-block">
            <div class="title">
                <div class="left">体检人</div>
                <div
                    class="right green"
                    @click="showSelector=true"
                >
                    {{ 
                        visitingMan.name ?
                            '更换体检人' :
                            '请选择体检人'
                    }}
                </div>
            </div>
            <div class="info" v-if="visitingMan.name">
                <div class="item">{{ visitingMan.name }}</div>
                <div class="item" v-if="dic.HMS_COMM_SEX2.find( x => x.value === visitingMan.sexCode )">
                    {{ dic.HMS_COMM_SEX2.find( x => x.value === visitingMan.sexCode ).label }}
                </div>
                <div class="item">{{ visitingMan.birthDate ? new Date( visitingMan.birthDate ).toLocaleDateString( ) : '' }}</div>
                <div class="item">{{ visitingMan.mobileNumber }}</div>
            </div>
        </div>

        <!-- 套餐 -->
        <div class="base-info package-block">

            <div class="title">
                <div class="left">体检项目</div>
            </div>

            <div class="radio-block" v-if="packages">
                <div
                    class="radio-item"
                    v-for="(item, k) in packages.packages" :key="k"
                >
                    <mu-radio
                        :value="item.packageId"
                        v-model="formData.packagee"
                    />
                    <div
                        class="content-block"
                        @click="choicePackge( item.packageId )"
                    >
                        <div class="main">
                            <div class="name">
                                {{ item.packageName }}
                            </div>
                            <div class="fan" v-if="!!item.gender || !!item.maxEnd || !!item.minAge">
                                适用范围：{{ dic.HMS_COMM_SEX2.find( x => x.value === item.gender ) ? 
                                                dic.HMS_COMM_SEX2.find( x => x.value === item.gender ).label :
                                                ''
                                        }}{{ item.gender ? '，': '' }}{{
                                            ( item.minAge !== null && item.minAge !== undefined ) && ( item.maxEnd !== null && item.maxEnd !== undefined ) ?
                                                `${item.minAge} ～ ${item.maxEnd}岁` :
                                                ( item.minAge !== null && item.minAge !== undefined ) && ( item.maxEnd === null || item.maxEnd === undefined ) ?
                                                    `${item.minAge}岁以上` :
                                                    ( item.minAge === null || item.minAge === undefined ) && ( item.maxEnd !== null && item.maxEnd !== undefined ) ?
                                                        `${item.minAge}岁以下` :
                                                    ''
                                        }}
                            </div>
                        </div>
                        <div class="price">
                            ¥{{ packages.price && packages.price.toFixed(2) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                color="#4caf50"
                @click="onSubmit"
            >
                确定
            </mu-button>
        </div>

        <!-- 提示 -->
        <!-- <div class="the-tips-block">
            <p>验证说明：</p>
            <p>1.体检中心、预约时间不能为空</p>
            <p>2.体检人不能为空</p>
            <p>3.健康卡已预约过，不能重复预约</p>
        </div> -->

        <!-- 选择就诊人 -->
        <visiting-selector
            :show.sync="showSelector"
            @confirm="selectVisitor"
        />    

    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyHeader from "../../../components/my-header/index.vue";
import MyForm from "../../../components/my-form-v2/index.vue";
import VisitingSelector from "../../../container/visiting-man-selector/index.vue";

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    MyForm,
    MyHeader,
    VisitingSelector
  }
})
export default class BookingBodyCheck extends Vue {
  /** 套餐详情 */
  private detail!: any;

  /** 就诊人信息 */
  private visitingMan: App.bodyCheckVisitor = {};

  /** 推荐套餐 */
  private packages: App.healthCardPackage | null = null;

  /** 就诊人选择 */
  private showSelector = false;

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    /** 性别 */
    HMS_COMM_SEX2: [],
    /** 诊所 */
    HMS_MEDICAL_SITE: []
  };

  /** 表单数据 */
  private formData: {
    desc: string;
    userid: string;
    medicalSite?: string;
    date?: Date;
    packagee?: string;
  } = {
    desc: "",
    medicalSite: undefined,
    date: undefined,
    userid: "",
    packagee: undefined
  };

  /** 禁止点击的时间 */
  private disabledTime: {
    [key: string]: number[];
  } = {
    notAllow: [],
    hasBeenFull: []
  };

  /** 当前日历 */
  private rili = {
    year: 0,
    month: 0
  };

  /** 表单 */
  get formMeta(): C.MyForm.meta {
    return [
      [
        {
          key: "medicalSite",
          label: "体检中心",
          type: "select",
          value:
            this.dic.HMS_MEDICAL_SITE.length === 0
              ? undefined
              : this.dic.HMS_MEDICAL_SITE[0].value,
          options: this.dic.HMS_MEDICAL_SITE,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择体检中心"
            }
          ]
        }
      ]
    ];
  }

  /** 获取排期 */
  private fetchData(medicalSite, start, end) {
    this.disabledTime = {
      notAllow: [],
      hasBeenFull: []
    };

    this.http$
      .get<Api.get.healthCardDate>(
        {
          url: `/api/booking/health-card/scheduleDate?medicalSite=${medicalSite}&startTime=${start}&endTime=${end}&processType=${(this
            .detail &&
            this.detail.scheduleType) ||
            1}`
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
        data.map(item => {
          if (!item.isScheduling) {
            this.disabledTime.notAllow.push(item.date);
          } else if (item.appointmentNumber >= item.appointmentMaxLimit) {
            this.disabledTime.hasBeenFull.push(item.date);
          }
        });
        /** 如果返回日期少于目标查询，则剩下的显示为“未开放” */
        const dataLast = data[data.length - 1];
        const year = new Date(end).getFullYear();
        const month = new Date(end).getMonth() + 1;
        const currentLast = dataLast ? new Date(dataLast.date).getDate() : 1;
        const targetLast = new Date(end).getDate();
        if (currentLast < targetLast) {
          for (let i = currentLast; i <= targetLast; i++) {
            this.disabledTime.notAllow.push(
              new Date(`${year}/${month}/${i}`).getTime()
            );
          }
        }
      });
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX2,HMS_MEDICAL_SITE`
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
        Object.keys(data).map(dicKey => {
          this.dic = Object.assign({}, this.dic, {
            [dicKey]: data[dicKey].map(x => ({
              label: x.name,
              value: x.itemValue
            }))
          });
        });
      });
  }

  /** 拉取推荐套餐 */
  private fetchPackage(cardid, userid) {
    this.http$
      .get<normalResult<App.healthCardPackage>>(
        {
          url: `/api/health-check/package/${cardid}?userId=${userid}`
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
        this.packages = data;
        this.formData = Object.assign({}, this.formData, {
          packagee: data.packages[0].packageId
        });
      });
  }

  /** 拉取卡详情 */
  private fetchDetail(id) {
    this.http$
      .get<normalResult<any>>(
        {
          url: `/api/health-check/detail/${id}`
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
        this.detail = data;
      });
  }

  /** 体检中心选择 */
  private onFormChange(val) {
    const { medicalSite } = val;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    const start = new Date(`${year}/${month + 1}/1`);
    const end = new Date(year, month + 1, 0);

    this.fetchData(medicalSite, start.getTime(), end.getTime());
    this.formData = Object.assign({}, this.formData, {
      medicalSite
    });
  }

  /** 禁止选择 */
  private disableDate(date: Date) {
    const date$ = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const t = date.toLocaleDateString();
    const { notAllow, hasBeenFull } = this.disabledTime;
    if (
      notAllow.find(x => t === new Date(x).toLocaleDateString()) ||
      hasBeenFull.find(x => t === new Date(x).toLocaleDateString())
    ) {
      return true;
    } else if (
      date.getFullYear() < year ||
      (date.getFullYear() === year && date.getMonth() < month) ||
      (date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() < date$)
    ) {
      return true;
    }
    return false;
  }

  /** 日历翻页 */
  private detectDate() {
    const map = {
      一月: 1,
      二月: 2,
      三月: 3,
      四月: 4,
      五月: 5,
      六月: 6,
      七月: 7,
      八月: 8,
      九月: 9,
      十月: 10,
      十一月: 11,
      十二月: 12
    };
    const el: any = document.querySelector(".mu-datepicker-toolbar-title");
    if (!el) {
      return;
    }

    const [yearText, monthText] = el.innerText.split(" ");

    if (!monthText) {
      return;
    }

    const year = Number(yearText);
    const month = map[monthText];

    if (this.rili.year !== year || this.rili.month !== month) {
      this.rili = {
        year,
        month
      };

      const end = new Date(year, month, 0);
      const start = new Date(`${year}/${month}/1`);
      this.fetchData(this.formData.medicalSite, start.getTime(), end.getTime());
    }
  }

  /** 选择就诊人 */
  private selectVisitor(val: App.bodyCheckVisitor) {
    this.visitingMan = val;
    this.formData = Object.assign({}, this.formData, {
      userid: val.id
    });
    this.fetchPackage(this.$route.params.id, val.id);
  }

  /** 选择套餐 */
  private choicePackge(val) {
    this.formData = Object.assign({}, this.formData, {
      packagee: val
    });
  }

  /** 检查 */
  private onCheck() {
    const { medicalSite, date, userid } = this.formData;
    const error = msg => {
      this.$toast.error(msg);
      return false;
    };

    if (!medicalSite) {
      return error("请选择体检中心");
    }

    if (!date) {
      return error("请选择预约时间");
    }

    if (!userid) {
      return error("请选择体检人");
    }

    return true;
  }

  /** 提交 */
  private onSubmit() {
    const isOk = this.onCheck();
    if (!isOk) {
      return;
    }

    const { medicalSite, date, userid, packagee, desc } = this.formData;
    const data = {
      medicalSite,
      medicalSiteName: (this.dic.HMS_MEDICAL_SITE.find(
        x => x.value === medicalSite
      ) as any).label,
      remark: desc,
      onLinePackageId: this.$route.params.id,
      packageId: packagee,
      packageName: (this.packages as any).packages.find(
        x => x.packageId === packagee
      ).packageName,
      medicalUserId: userid,
      medicalUserName: this.visitingMan.name,
      appointMedicalDate: (date as Date).getTime(),
      price: (this.packages as any).price,
      createIp: this.account$.wx.ip
    };
    // 捕获未知异常，抛出，考虑并发预约导致的问题
    try {
      this.http$
        .post<normalResult<any>>(
          {
            data,
            url: `/api/booking/health-check`
          },
          {
            loadMsg: "预约中..."
            // successMsg: '预约成功'
          }
        )
        .then(res => {
          if (res.status === 200) {
            // this.$router.push("/booking/health-check/success");
            // 这里通过订单id，生成支付数据
            this.fetchPrepay( res.data );
          }
        });
    } catch (e) {
      this.$toast.error(e);
    }
  }

  /** 拉取预付订单的数据 */
  private fetchPrepay( orderId ) {
    this.$router.replace(`/common/order-pay-preview/${orderId}?next=/my-order/list`);
  }

  mounted() {
    this.fetchDic();
    this.fetchDetail(this.$route.params.id);
    setInterval(() => {
      this.detectDate();
    }, 500);
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
