<template>
    <div class="con-booking-bodycheck">

        <!-- 基本信息 -->
        <div class="base-info">
            <my-form-v2
                ref="form"
                :meta="formMeta"
                @change="onFormChange"
            >
                <div>
                    <!-- 日期选择 -->
                    <p class="small tips xx" v-if="!formData.date"></p> 
                    <p class="small tips" v-else>
                        预约时间
                    </p> 
                    <p class="time tips" @click="onTouchDate">
                        <span v-if="formData.date">
                            {{ formData.date }} {{ formData.time[ 0 ] ? formData.time[ 0 ] : ''}}
                        </span>
                        <span v-else class="placeholder">
                            预约时间
                        </span>
                        <span>
                            <mu-icon
                                :size="20"
                                value="keyboard_arrow_right"
                            />
                        </span>
                    </p>
                </div>
                <div class="multiinput-block">
                    <p class="small tips">
                        病情描述
                    </p>
                    <mu-text-field
                        :rows="3"
                        multi-line
                        :rows-max="6"
                        full-width
                        class="no-border"
                        placeholder="1000字以内"
                        v-model="formData.desc"
                    />
                </div>
            </my-form-v2>
        </div>

        <!-- 就诊人 -->
        <div class="Visiting-person-block">
            <div class="title">
                <div class="left">就诊人</div>
                <div
                    class="right green"
                    @click="showSelector=true"
                >
                    {{ 
                        visitingMan.name ?
                            '更换就诊人' :
                            '请选择就诊人'
                    }}
                </div>
            </div>
            <div class="info" v-if="visitingMan.name">
                <div class="item">{{ visitingMan.name }}</div>
                <div class="item">{{ dic.HMS_COMM_SEX.find( x => x.value === visitingMan.sexCode ).label }}</div>
                <div class="item">{{ visitingMan.birthDate ? new Date( visitingMan.birthDate ).toLocaleDateString( ) : '' }}</div>
                <div class="item">{{ visitingMan.mobileNumber }}</div>
            </div>
        </div>

        <!-- 图片上传 -->
        <div class="my-upload-block">
            <p class="title">
                上传图片
            </p>
            <p
              class="tips"
              v-if="heci"
            >
              <span class="red mr">*<span :style="{ color: '#666', marginLeft: '10px' }">请上传检查申请单</span></span>
            </p>
            <p
              class="tips"
              v-else
            >
                添加症状部位图片和过往就医资料
            </p>
             <img-upload
                :convert="convert"
                :upload-url="uploadUrl"
                @file-change="onFileUpdate"
                iac-req-url="/api/common/iac"
                :append-data="{ categoryId: categoryId }"
            />
        </div>

        <!-- 选择就诊人 -->
        <visiting-selector
            id="1"
            :show.sync="showSelector"
            @confirm="onSelectVisitor"
        />

        <!-- 弹出层 - 日历 -->
        <mu-bottom-sheet
            :key="1"
            :open.sync="showCalendar"
        >
            <mu-flex justify-content="between">
                <mu-flex justify-content="center">
                     <mu-button
                        flat
                        @click="showCalendar=false"
                     >
                            取消
                        </mu-button>
                </mu-flex>
                <mu-flex justify-content="center">
                    <mu-button
                        flat
                        color="primary"
                        :disabled="!formData.date"
                        @click="loadTime"
                    >
                        确认
                    </mu-button>
                </mu-flex>
            </mu-flex>
            <vue-event-calendar
                :events="events"
                @day-changed="handleDayChange"
                @month-changed="handleMonthChanged"
            />
        </mu-bottom-sheet>

        <!-- 弹出层 - 时段 -->
        <mu-bottom-sheet
            :key="2"
            :open.sync="showTime"
        >
            <mu-flex justify-content="between">
                <mu-flex justify-content="center">
                     <mu-button
                        flat
                        @click="showTime=false"
                     >
                            取消
                        </mu-button>
                </mu-flex>
                <mu-flex justify-content="center">
                    <mu-button
                        flat
                        color="primary"
                        @click="confirmTime"
                        :disabled="selectingTime.disabled"
                    >
                        确认
                    </mu-button>
                </mu-flex>
            </mu-flex>
            <mu-slide-picker
                :values="formData.time"
                :slots="[{
                    width: '100%',
                    textAligh: 'left',
                    values: timeOptions.map( x => x.name )
                }]"
                @change="onTimeChange"
            />
        </mu-bottom-sheet>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                @click="showDialog"
                color="success"
            >
                提交
            </mu-button>
        </div>

        <!-- 提示框 -->
        <mu-dialog title="提示" width="360" :open.sync="openDialog">
            确定创建这条预约吗?
            <mu-button slot="actions" flat color="primary" @click="submit">确认</mu-button>
            <mu-button slot="actions" flat @click="openDialog=false">取消</mu-button>
        </mu-dialog>

    </div>
</template>
<script lang="ts">
import { inject } from "../../service/inject";
import vueEventCalendar from "vue-event-calendar";
import ImgUpload from "../../components/img-upload/index.vue";
import MyFormV2 from "../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VisitingSelector from "../../container/visiting-man-selector/index.vue";

const categoryId = "hms_category_id";
const tanentId = "c69e6168-d231-4e2a-b0e1-580263f3f77b";

Vue.use(vueEventCalendar, {
  locale: "zh",
  className: "active"
});

/**
 * @description 体检预约
 */
@inject({
  selector: ["globalStore$"]
})
@Component({
  components: {
    MyFormV2,
    ImgUpload,
    VisitingSelector
  }
})
export default class BookingBodyCheck extends Vue {
  /** 表单数据 reservationType */
  get formMeta(): C.MyForm.meta {

    const g = this.$route.query.g === 'true';
    const deptId = this.$route.query.deptId;


    return [
      [
        {
          key: "clinic",
          label: "门诊",
          type: "select",
          value: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test' && g ?
                  '98' :
                  this.globalStore$.Store.packageDetail.ext
                    ? this.globalStore$.Store.packageDetail.ext.clinicShopId
                    : undefined,
          options: this.dic.HMS_CLINIC_SHOP,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择门诊"
            }
          ]
        }
      ],
      [
        {
          key: "department",
          label: "科室",
          type: "select",
          value: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test' && g ?
                  (deptId ? deptId : '1595') :
                  this.globalStore$.Store.packageDetail.ext
                  ? this.globalStore$.Store.packageDetail.ext.deptId
                  : undefined,
          options: this.dic.DEPARTMENTS,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择科室"
            }
          ]
        }
      ],
      [
        {
          key: "reservationType",
          label: "预约类型",
          type: "select",
          value: process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test' && g ?
                  '1' : null,
          options: this.dic.HMS_CLINIC_TYPE,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择预约类型"
            }
          ]
        }
      ]
    ];
  }

  /** 是否为核磁 */
  private heci = false;

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    /** 性别 */
    HMS_COMM_SEX: [],
    /** 诊所 */
    HMS_CLINIC_SHOP: [],
    /** 科室 */
    DEPARTMENTS: [],
    /** 诊断类型 */
    HMS_CLINIC_TYPE: []
  };

  /** 提示框 */
  private openDialog = false;

  /** 图片上传列表 */
  private imgList: string[] = [];

  /** 上次选择到门诊 */
  private lastClinic!: string;

  /** 弹层日历 */
  private showCalendar = false;

  /** 弹层时段 */
  private showTime = false;

  /** 图片上传分类ID */
  private categoryId = categoryId;

  /** 图片上传地址 */
  private uploadUrl = `https://itapis.cvte.com/cfile/${tanentId}/v1/upload`;

  /** 选择就诊人 */
  private showSelector = false;

  /** 就诊人信息 */
  private visitingMan: App.bodyCheckVisitor = {};

  /** 已选日期 */
  private selectedDate = {
    year: 0,
    month: 0,
    date: 0
  };

  /** 日历日期 */
  private calendarDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: ""
  };

  /** 日期控件，不能选的日数 */
  private cannotSelectDate: number[] = [];

  /** 表单其他数据 */
  private formData = {
    desc: "",
    date: "",
    time: [""]
  };

  /** 日期控件事件 */
  private events: eventItem[] = [];

  /** 当前的可选时间段列表 */
  private timeOptions: timeOption[] = [];

  /** 正在界面选中的时间 */
  private selectingTime: {
    name: string;
    value: string;
    disabled: boolean;
  } = {
    name: "",
    value: "",
    disabled: true
  };

  /** 选择就诊人 */
  private onSelectVisitor(user) {
    this.visitingMan = user;
  }

  /** 监听日历月份改变 */
  @Watch("calendarDate", { deep: true })
  onMonthChange(calendarDate) {
    const { year, month, date } = this.selectedDate;
    setTimeout(() => {
      this.setCurrentDate(year, month, date);
    }, 0);
  }

  /** 为当前月设置可选日期、不可选日期 */
  private setUnusedDate(
    passDates: eventItem[],
    unConfigured: eventItem[],
    unAvailable: eventItem[]
  ) {
    setTimeout(() => {
      let canSelect: eventItem[] = [];
      const { year, month } = this.calendarDate;
      const month_ = String(month).length === 1 ? `0${month}` : month;

      for (let i = 1; i <= 31; i++) {
        const currentDate = String(i).length === 1 ? `0${i}` : `${i}`;
        const existed1 = passDates.some(
          x => x.date.split("/")[x.date.split("/").length - 1] === currentDate
        );
        const existed2 = unConfigured.some(
          x => x.date.split("/")[x.date.split("/").length - 1] === currentDate
        );
        const existed3 = unAvailable.some(
          x => x.date.split("/")[x.date.split("/").length - 1] === currentDate
        );

        if (!existed1 && !existed2 && !existed3) {
          canSelect.push({
            title: "",
            date: `${year}/${month_}/${currentDate}`,
            customClass: "can-select"
          });
        }
      }

      this.events = [
        ...canSelect,
        ...passDates,
        ...unConfigured,
        ...unAvailable
      ];
      this.cannotSelectDate = [
        ...passDates,
        ...unConfigured,
        ...unAvailable
      ].map(x => {
        const date = x.date.split("/")[x.date.split("/").length - 1];
        return Number(date);
      });
    }, 0);
  }

  /**
   * 日期控件-月改变
   * 设置当前月
   * 拉取当月数据
   * 赋值已选的日、月
   */
  private handleMonthChanged(val) {
    const year = Number(val.substring(0, val.indexOf("年")));
    const month = Number(
      val.substring(val.indexOf("年") + 1, val.indexOf("月"))
    );
    this.loadingEvent(year, month).then(() => {
      this.calendarDate = Object.assign({}, this.calendarDate, {
        month,
        year
      });
    });
  }

  /**
   * 日期控件-日改变、日期选择
   * 需要把上一个已选日期
   */
  private handleDayChange(val) {
    const dateArr = val.date.split("/");
    if (
      !this.cannotSelectDate.find(
        x => Number(x) === Number(dateArr[dateArr.length - 1])
      )
    ) {
      this.formData = Object.assign({}, this.formData, {
        date: val.date
      });
      this.selectedDate = {
        year: Number(dateArr[0]),
        month: Number(dateArr[1]),
        date: Number(dateArr[2])
      };
      this.setCurrentDate(
        Number(dateArr[0]),
        Number(dateArr[1]),
        Number(dateArr[2])
      );
    } else {
      this.selectedDate = {
        year: 0,
        month: 0,
        date: 0
      };
      this.formData = Object.assign({}, this.formData, {
        date: ""
      });
    }
  }

  /** 为日历设置上一个已选值 */
  private setCurrentDate(year, month, date) {
    if (
      !this.selectedDate.month ||
      this.calendarDate.year !== year ||
      this.calendarDate.month !== month
    ) {
      return;
    }
    Array.from(document.getElementsByClassName("date-num")).forEach(item => {
      const parent = item.parentNode;
      const parentClass = (parent as any).className;
      const nodeDate = Number((item as any).innerText);
      if (nodeDate === date && parent) {
        (parent as any).className += " active";
      }
      if (nodeDate !== date && parent) {
        (parent as any).className = parentClass.replace("active", "");
      }
    });
  }

  /** 点击日历选择 */
  private onTouchDate() {
    const { year, month } = this.calendarDate;
    const { result, data } = (this.$refs.form as any).getData();

    // if (!result) {
    //   return this.$toast.error("需要先选择门诊、科室、预约类型");
    // }

    this.loadingEvent(year, month);
  }

  /** 加载指定年月的事件 */
  private loadingEvent(year, month) {
    const month_ = String(month).length === 1 ? `0${month}` : month;
    const { data } = (this.$refs.form as any).getData();
    const { clinic, department, reservationType } = data;
    return this.loadEvent(
      clinic,
      `${year}${month_}01`,
      department,
      reservationType
    );
  }

  /**
   * 加载当月的预约情况
   * @param shopId 诊所ID
   * @param date 20170512字符串
   * @param department 预约科室ID
   * @param reservationType 预约类型
   * @param reservationId 预约id
   * @param doctorId 医生id
   */
  private loadEvent(
    shopId,
    date,
    department,
    reservationType,
    reservationId = 0,
    doctorId = 0
  ) {
    const query = `shopId=${shopId}&date=${date}&department=${department}&reservationType=${reservationType}&reservationId=${reservationId}&doctorId=${doctorId}`;

    return this.http$
      .get<Api.get.bookingScheduleDate>(
        {
          url: `/api/booking/clinic/scheduleDate?${query}`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        const { passedDayList, unConfiguredList, unavailableDays } = data;

        const dateToEventItem = (date, customClass): eventItem => ({
          title: "",
          date: date.split("-").join("/"),
          customClass: `cannot-select ${customClass}`
        });

        const passDates: eventItem[] = passedDayList.map(x =>
          dateToEventItem(x, "pass")
        );
        const unConfigured: eventItem[] = unConfiguredList.map(x =>
          dateToEventItem(x, "unconfigured")
        );
        const unAvailable: eventItem[] = unavailableDays.map(x =>
          dateToEventItem(x, "unavailable")
        );

        this.setUnusedDate(passDates, unConfigured, unAvailable);
        this.showCalendar = true;
      });
  }

  /**
   * 加载可用时段
   */
  private loadTime() {
    const { data } = (this.$refs.form as any).getData();
    const { clinic, department, reservationType } = data;
    const { year, month, date } = this.selectedDate;
    const month_ = String(month).length === 1 ? `0${month}` : month;
    const date_ = String(date).length === 1 ? `0${date}` : date;

    const query = `shopId=${clinic}&date=${year}${month_}${date_}&department=${department}&reservationType=${reservationType}&reservationId=${0}&doctorId=${0}`;

    return this.http$
      .get<Api.get.bookingScheduleTime>(
        {
          url: `/api/booking/clinic/scheduleTime?${query}`
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

        this.timeOptions = Object.keys(data).map(key => ({
          value: key,
          disabled: data[key] !== 1,
          name:
            data[key] === -1
              ? `${key} ( 未开放 )`
              : data[key] === 0
                ? `${key} ( 已满 )`
                : `${key}`
        }));

        this.showTime = true;
        this.showCalendar = false;

        // 首个可用时间
        this.formData = Object.assign({}, this.formData, {
          time: [
            this.timeOptions[this.timeOptions.findIndex(x => !x.disabled)].name
          ]
        });
        // 首个可用时间
        const firstTimeOpt = this.timeOptions.find(x => !x.disabled);
        if (firstTimeOpt) {
          this.selectingTime = firstTimeOpt;
        }
      });
  }

  /** 时段改变 */
  private onTimeChange(value, index) {
    this.selectingTime = this.timeOptions[
      this.timeOptions.findIndex(x => x.name === value)
    ];
  }

  /** 选择时段 */
  private confirmTime() {
    this.showTime = false;
    this.formData = Object.assign({}, this.formData, {
      time: [this.selectingTime.name]
    });
  }

  /** 图片上传 */
  private onFileUpdate(data) {
    this.imgList = data.imgList;
  }

  /** 图片下载地址转换 */
  private convert(req) {
    const downBaseUrl = `https://itapis.cvte.com/cfile/${tanentId}/v1/download/`;
    return req.status === "0" ? `${downBaseUrl}${req.data.result.fileId}` : "";
  }

  /** 表单校验 */
  private check(): boolean {
    const err = msg => {
      this.$toast.error(msg);
      return false;
    };

    // 就诊基本信息
    const formData = (this.$refs.form as any).getData();
    if (!formData.result) {
      return err("请完善表单信息");
    }
    // 就诊日期\就诊时间
    if (!this.formData.date || !this.formData.time[0]) {
      return err("请选择就诊时间");
    }
    // 就诊人
    if (Object.keys(this.visitingMan).length === 0) {
      return err("请选择就诊人");
    }
    // 病情描述1000字
    if (this.formData.desc && this.formData.desc.length > 1000) {
      return err("病情描述在1000字以内");
    }

    if ( this.heci && this.imgList.length === 0 ) {
      return err("请上传检查申请单");
    }

    return true;
  }

  /** dialog询问 */
  private showDialog() {
    const check = this.check();
    if (!check) {
      return;
    }
    this.openDialog = true;
  }

  /** 表单提交 */
  private submit() {
    const check = this.check();
    if (!check) {
      return;
    }

    const { desc, date, time } = this.formData;
    const { data } = (this.$refs.form as any).getData();
    const { clinic, department, reservationType } = data;
    const { birthDate, mobileNumber, name, sexCode } = this.visitingMan;

    const birthDate_ = birthDate ? new Date(birthDate) : new Date();
    const birthDateYear = birthDate_.getFullYear();
    const birthDateDate =
      String(birthDate_.getDate()).length === 1
        ? `0${birthDate_.getDate()}`
        : `${birthDate_.getDate()}`;
    const birthDateMonth =
      String(birthDate_.getMonth() + 1).length === 1
        ? `0${birthDate_.getMonth() + 1}`
        : `${birthDate_.getMonth() + 1}`;

    const reqData = {
      name,
      sexCode,
      department,
      doctorId: 0,
      mobileNumber,
      shopId: clinic,
      doctorName: "",
      reservationType,
      images: this.imgList,
      reservationContent: desc,
      birthDate: `${birthDateYear}${birthDateMonth}${birthDateDate}`,
      shopName: (this.dic.HMS_CLINIC_SHOP.find(x => x.value === clinic) as any)
        .label,
      departmentName: (this.dic.DEPARTMENTS.find(
        x => x.value === department
      ) as any).label,
      reservationDate: `${date
        .split("/")
        .map(x => (x.length === 1 ? 0 + x : x))
        .join("-")} ${time[0]}`
    };

    this.http$
      .post<normalResult<any>>(
        {
          data: reqData,
          url: `/api/booking/clinic`
        },
        {
          loadMsg: "创建中...",
          successMsg: "预约成功"
        }
      )
      .then(res => {
        const { status } = res;
        if (status === 200) {
          this.openDialog = false;
          (this.$refs.form as any).reset();
          this.imgList = [];
          this.lastClinic = "";
          this.visitingMan = {};
          this.selectedDate = {
            year: 0,
            month: 0,
            date: 0
          };
          this.calendarDate = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: ""
          };
          this.cannotSelectDate = [];
          this.formData = {
            desc: "",
            date: "",
            time: [""]
          };
          this.events = [];
          this.timeOptions = [];
          this.selectingTime = {
            name: "",
            value: "",
            disabled: true
          };
          setTimeout(
            () => this.$router.replace("/booking/body-check?tab=1"),
            100
          );
        }
      })
      .catch(e => (this.openDialog = false));
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX,HMS_CLINIC_SHOP,HMS_CLINIC_TYPE`
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
          HMS_COMM_SEX: data.HMS_COMM_SEX.map(x => ({
            label: x.name,
            value: x.itemValue
          })),
          HMS_CLINIC_SHOP: data.HMS_CLINIC_SHOP.map(x => ({
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

  /** 拉取科室 */
  private onFormChange(val) {

    const { clinic, department } = val;

    this.heci = department === '1825';

    if (!clinic || this.lastClinic === clinic) {
      return;
    }

    this.lastClinic = clinic;

    this.http$
      .get<normalResult<{ id: string; name: string }[]>>(
        {
          url: `/api/booking/department?shopId=${clinic}`
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
        this.dic = Object.assign({}, this.dic, {
          DEPARTMENTS: data.map(x => ({
            value: x.id,
            label: x.name
          }))
        });
      });
  }

  mounted() {
    this.fetchDic();
    if (this.globalStore$.Store.packageDetail.ext) {
      this.onFormChange({
        clinic: this.globalStore$.Store.packageDetail.ext.clinicShopId
      });
    }

    const g = this.$route.query.g === 'true';
    if ( process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'test' && g ) {
      this.onFormChange('98')
    }
  }
}

type eventItem = {
  title: string;
  date: string;
  customClass?: string;
};

type timeOption = {
  name: string;
  value: string;
  disabled: boolean;
};
</script>
<style lang="less">
@import "./index.less";
@import "~vue-event-calendar/dist/style.css";
</style>
