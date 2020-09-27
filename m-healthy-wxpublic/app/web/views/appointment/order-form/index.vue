<template>
  <div class="order-doctors">

    <!-- 基本信息 -->
    <div class="base-info">
      <my-form-v2 ref="form"
        :meta="formMeta"
        @change="handleFormChange">
        <div>
          <!-- 日期选择 -->
          <p class="small tips xx"
            v-if="!formData.date"></p>
          <p class="small tips"
            v-else>
            预约时间
          </p>
          <p class="time tips"
            @click="onTouchDate">
            <span v-if="formData.date">
              {{ formData.date }} {{ formData.time ? formData.time : ''}}
            </span>
            <span v-else
              class="placeholder">
              预约时间
            </span>
            <span>
              <mu-icon :size="20"
                value="keyboard_arrow_right" />
            </span>
          </p>
        </div>
        <div class="multiinput-block">
          <p class="small tips">
            病情描述
          </p>
          <mu-text-field :rows="3"
            multi-line
            :rows-max="6"
            full-width
            class="no-border"
            placeholder="1000字以内"
            v-model="formData.desc" />
        </div>
      </my-form-v2>
    </div>

    <!-- 就诊人 -->
    <div class="Visiting-person-block">
      <div class="title">
        <div class="left">就诊人</div>
        <div class="right green"
          @click="showSelector=true">
          {{ visitingMan.name ? '更换就诊人' : '请选择就诊人' }}
        </div>
      </div>
      <div class="info"
        v-if="visitingMan.name">
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
      <p class="tips"
        v-if="heci">
        <span class="red mr">*
          <span :style="{ color: '#666', marginLeft: '10px' }">请上传检查申请单</span>
        </span>
      </p>
      <p class="tips"
        v-else>
        添加症状部位图片和过往就医资料
      </p>
      <img-upload :convert="convert"
        :upload-url="uploadUrl"
        @file-change="onFileUpdate"
        iac-req-url="/api/common/iac"
        :append-data="{ categoryId: categoryId }" />
    </div>

    <!-- 选择就诊人 -->
    <visiting-selector id="1"
      :show.sync="showSelector"
      @confirm="onSelectVisitor" />

    <!-- 弹出层 - 日历 -->
    <mu-bottom-sheet :key="1"
      :open.sync="showCalendar">
      <mu-flex justify-content="between">
        <mu-flex justify-content="center">
          <mu-button flat
            @click="showCalendar=false">
            取消
          </mu-button>
        </mu-flex>
        <mu-flex justify-content="center">
          <mu-button flat
            color="primary"
            :disabled="!formData.date"
            @click="loadTime">
            确认
          </mu-button>
        </mu-flex>
      </mu-flex>
      <vue-event-calendar :events="events"
        @day-changed="handleDayChange"
        @month-changed="handleMonthChanged" />
    </mu-bottom-sheet>

    <!-- 弹出层 - 时段 -->
    <mu-bottom-sheet :key="2"
      :open.sync="showTime">
      <mu-flex justify-content="between">
        <mu-flex justify-content="center">
          <mu-button flat
            @click="showTime=false">
            取消
          </mu-button>
        </mu-flex>
        <mu-flex justify-content="center">
          <mu-button flat
            color="primary"
            @click="confirmTime"
            :disabled="selectingTime.disabled">
            确认
          </mu-button>
        </mu-flex>
      </mu-flex>
      <van-picker :values="formData.time"
        title="请选择时间"
        :columns="timeOptions.map( x => x.name )"
        @change="onTimeChange" />
    </mu-bottom-sheet>

    <!-- 按钮 -->
    <div class="btn-block">
      <mu-button full-width
        @click="submit"
        color="success">
        提交
      </mu-button>
    </div>
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import vueEventCalendar from "vue-event-calendar";
import ImgUpload from "../../../components/img-upload/index.vue";
import MyFormV2 from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import VisitingSelector from "../../../container/visiting-man-selector/index.vue";
import Picker from "vant/lib/picker";

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
    VisitingSelector,
    "van-picker": Picker
  }
})
export default class BookingBodyCheck extends Vue {
  /** 表单数据 reservationType */
  get formMeta(): C.MyForm.meta {
    const g = (this as any).$route.query.g === "true";

    const common: C.MyForm.meta = [
      [
        {
          key: "centerId",
          label: "门诊",
          type: "select",
          value: (this as any).$router.history.current.query.centerId,
          options: this.allHostipal,
          disabled: true,
          onChange: val => {
            this.fetchDept(val);
          },
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
          key: "deptId",
          label: "科室",
          type: "select",
          value: (this as any).$router.history.current.query.deptId,
          options: this.deptList,
          disabled: true,
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
          key: "doctorId",
          label: "医生",
          type: "select",
          value: (this as any).$router.history.current.query.doctorId,
          options: this.doctorList,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择医生哦"
            }
          ]
        }
      ]
    ];

    const other: C.MyForm.meta = [[
        {
          key: "consultationWay",
          label: "咨询方式",
          type: "radio",
          value: '0',
          options: this.dic.HMS_ORDER_CONSULTATION_WAY,
          rules: [
            {
              validate: val => !!val ,
              message: "必须选择咨询方式哦"
            }
          ],
          onChange: (value) => {
            this.queetionList = value;
          }
        }
      ],[
        {
          key: "qType",
          label: "问题类型",
          type: "checkbox",
          options: this.dic.HMS_ORDER_QUESTION_TYPE,
          rules: [
            {
              validate: (val) => {
                return !!val && (((val as string[]).length>0));
              },
              message: "必须选择问题哦"
            }
          ],
          onChange: (value) => {
            this.queetionList = value;
          }
        }
      ]];

    return (this as any).$router.history.current.query.firstDept ===
      "PSYCHOLOGY_DEPT"
      ? [...common, ...other]: common;
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

  /** 健康中心列表 */
  private allHostipal = [];

  /** 问题类型 */
  private queetionList = [];

  /** 科室列表 */
  private deptList = [];

  /** 医生列表 */
  private doctorList = [];

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

  private currentDoctor:{doctor: any, scheduleInfoList: any} = {
    doctor: {},
    scheduleInfoList: []
  };

  /** 日历日期 */
  private calendarDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: ""
  };

  /** 日期控件，不能选的日数 */
  private cannotSelectDate: number[] = [];

  /** 当前选中的时间对象 */
  private timeObj: any = {};

  /** 表单其他数据 */
  private formData = {
    desc: "",
    date: "",
    time: ""
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
    origin?: object;
  } = {
    name: "",
    value: "",
    disabled: true,
    origin: {}
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

  /** 为当前月设置可选日期、不可选日期 , 默认所有可选日期是今天或今天以后的时间*/
  private setUnusedDate(canSelect: eventItem[], unAvailable: eventItem[]) {
    setTimeout(() => {
      let passDates: eventItem[] = [];
      let unConfigured: eventItem[] = [];
      const { year, month } = this.calendarDate;
      const month_ = String(month).length === 1 ? `0${month}` : month;
      const allCanSeleted = Array.from(
        new Set(
          canSelect.map(item => {
            return item.date;
          })
        )
      );
      for (let i = 1; i <= 31; i++) {
        const currentDate = String(i).length === 1 ? `0${i}` : `${i}`;
        const now = new Date(
          `${new Date().getFullYear()}/${new Date().getMonth() +
            1}/${new Date().getDate()}`
        );
        if (
          new Date(now).getTime() >
          new Date(`${year}/${month_}/${currentDate}`).getTime()
        ) {
          passDates.push({
            title: "",
            date: `${year}/${month_}/${currentDate}`,
            customClass: "cannot-select pass"
          });
        } else if (
          allCanSeleted.indexOf(`${year}/${month_}/${currentDate}`) < 0 &&
          new Date(now).getTime() <=
            new Date(`${year}/${month}/${currentDate}`).getTime()
        ) {
          unConfigured.push({
            title: "",
            date: `${year}/${month_}/${currentDate}`,
            customClass: "cannot-select unconfigured"
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
      // console.log('不可选中的数据啊',[ ...passDates,
      //   ...unConfigured,] );
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
    this.loadingEvent().then(() => {
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
    // const { year, month } = this.calendarDate;
    // // console.log('噗嗤',year, month);
    // const { result, data } = (this.$refs.form as any).getData();

    // if (!result) {
    //   return (this as any).$toast.error("需要先选择门诊、科室、预约类型");
    // }

    this.loadingEvent();
  }

  /** 加载指定年月的事件 */
  private loadingEvent() {
    return this.loadEvent();
    // const month_ = String(month).length === 1 ? `0${month}` : month;
    // const { data } = (this.$refs.form as any).getData();
    // const { clinic, department, reservationType } = data;
    // return this.loadEvent(
    //   clinic,
    //   `${year}${month_}01`,
    //   department,
    //   reservationType
    // );
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
  ) {

    return this.http$
      .get<any>(
        {
          url: `/api/order/reserve/doctor/schedule`,
          params: {
            doctorId: (this as any).$router.history.current.query.doctorId,
            endTime: new Date().setDate(new Date().getDate() + 30),
            pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.currentDoctor = data;
          console.log('拿到医生',data);
          const sList = {};
          const dateToEventItem = (date): eventItem => ({
            title: "",
            date: date.split("-").join("/"),
            customClass: `can-select`
          });

          data.scheduleInfoList.map(x =>{
              if(sList[x.regDate]) {
                sList[x.regDate].regLeaveCount = Number(x.regLeaveCount) + Number(sList[x.regDate].regLeaveCount);
              }
              else{
                sList[x.regDate] = x;
              }
            }
          );

          const canSelect = Object.keys(sList).map(x =>
            dateToEventItem(sList[x].regDate)
          );
          const unAvailable =Object.keys(sList).filter(x =>
            {
              return  Number(sList[x].regLeaveCount) === 0 
            }
          ).map(x => {
            return {
                title: "",
                date: sList[x].regDate.split("-").join("/"),
                customClass: `cannot-select unavailable`
              }
          });
          // const unAvailable = [];

          console.log('啦啦啦啦啦啦',unAvailable);
          
          this.setUnusedDate(canSelect,unAvailable);
          this.showCalendar = true;
        }
      });
  }

  /**
   * 加载可用时段
   */
  private loadTime() {
    this.showTime = true;
    this.showCalendar = false;
    this.timeOptions = [];
    const { year, month, date } = this.selectedDate;
    const month_ = String(month).length === 1 ? `0${month}` : month;
    const date_ = String(date).length === 1 ? `0${date}` : date;
    const currentDateList: any = [];
    const allRes: any[] = [];
    this.currentDoctor.scheduleInfoList.map((item: any) => {
      if (`${year}-${month_}-${date_}` === item.regDate) {
        currentDateList.push(item);
      }
    });
    Promise.all(
      currentDateList.map(async (item: any) => {
        await this.http$
          .get<any>(
            {
              url: `/api/order/reserve/schedule/${item.scheduleId}/time_info`,
              params: {
                pageSize: 1000
              }
            },
            {
              loadMsg: "加载中..."
            }
          )
          .then(res => {
            const { status, data } = res;
            if (status === 200) {
              (data as any).timeRegInfo.map(citem => {
                citem.shiftId = item.scheduleId;
                citem.regFee = item.regFee;
              });
              allRes.push(...data.timeRegInfo);
            }
          });
      })
    ).then(() => {
      allRes.map((item: any, index) => {
        const state = Number(item.regLeaveCount) === 0;
        this.timeOptions.push({
          value: String(index),
          disabled: state,
          name: !state ? `${item.startTime}-${item.endTime} ` : `${item.startTime}-${item.endTime}  ( 已满 )`,
          origin: item
        });
      });
      this.showTime = true;
      this.showCalendar = false;
      this.timeOptions.sort((a, b) => {
        return Number(a.name.slice(0, 2)) - Number(b.name.slice(0, 2));
      });

      // 首个可用时间
      this.formData = Object.assign({}, this.formData, {
        time: this.timeOptions[this.timeOptions.findIndex(x => !x.disabled)]
          .name
      });
      // 首个可用时间
      const firstTimeOpt = this.timeOptions.find(x => !x.disabled);
      if (firstTimeOpt) {
        this.selectingTime = firstTimeOpt;
      }
    });
  }

  /** 时段改变 */
  private onTimeChange(picker, value, index) {
    this.selectingTime = this.timeOptions[
      this.timeOptions.findIndex(x => x.name === value)
    ];
  }

  /** 选择时段 */
  private confirmTime() {
    this.showTime = false;
    this.formData = Object.assign({}, this.formData, {
      time: this.selectingTime.name
    });
    this.timeObj = this.selectingTime.origin;
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
      (this as any).$toast.error(msg);
      return false;
    };

    // 就诊基本信息
    const formData = (this.$refs.form as any).getData();
    if (!formData.result) {
      return err("请完善表单信息");
    }
    // 就诊日期\就诊时间
    if (!this.formData.date || !this.formData.time) {
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
    // 病情描述图片
    // if (this.imgList.length === 0) {
    //   return err("请上传检查申请单");
    // }

    // if((this as any).$router.history.current.query.firstDept === "PSYCHOLOGY") {
    //   if(this.)
    // }

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
    const { centerId, deptId, doctorId } = data;
    const { birthDate, mobileNumber, name, sexCode, id } = this.visitingMan;
    console.log('拿到医生111',this.currentDoctor.scheduleInfoList);
    const reqData = {
      name,
      sexCode,
      centerId,
      mobileNumber,
      deptId,
      doctorName: "",
      doctorId,
      clinicUnitId:this.currentDoctor.scheduleInfoList[0].clinicUnitId,
      clinicUnitName:this.currentDoctor.scheduleInfoList[0].clinicUnitName,
      images: this.imgList,
      questionType: this.queetionList.join(','),
      reserveType:(this as any).$router.history.current.query.firstDept === 'PSYCHOLOGY_DEPT' ? "1" : "0",
      description: desc,
      patientId: id,
      ...this.timeObj,
      startTime: new Date(`${date} ${this.timeObj.startTime}`).getTime(),
      endTime: new Date(`${date} ${this.timeObj.endTime}`).getTime(),
      items: [
        {
          actualItemPrice: this.timeObj.regFee,
          discountAmount: this.timeObj.treatFee,
          originalPrice: this.timeObj.regFee,
          itemName: `门诊挂号费`
        }
      ]
    };
    this.http$
      .post<any>(
        {
          data: reqData,
          url: `/api/order/reserve`
        },
        {
          loadMsg: "生成订单中",
          successMsg: "预约成功"
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.openDialog = false;
          /** data内是orderId，订单id */
          setTimeout(
            () =>
              (this as any).$router.replace(
                `/appointment/wechatpay?id=${data}`
              ),
            100
          );
        }
      })
      .catch(e => (this.openDialog = false));
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<any>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX,HMS_ORDER_QUESTION_TYPE,HMS_ORDER_CONSULTATION_WAY`
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
          HMS_ORDER_QUESTION_TYPE: data.HMS_ORDER_QUESTION_TYPE.map(x => ({
            label: x.name,
            value: x.itemValue
          })),
          HMS_ORDER_CONSULTATION_WAY: data.HMS_ORDER_CONSULTATION_WAY.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
      });
  }

  /** 获取健康中心列表 */
  private fetchHostipal() {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/hospital`,
          params: {
                pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status === 200) {
          this.allHostipal = data.map(item => {
            return {
              label: item.name,
              value: item.id
            };
          });
        }
      });
  }
  /** 拉取科室 */
  private fetchDept(id) {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/dept`,
          params: {
            centerId: id,
            pageSize: 1000
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        let temp;
        if (status !== 200) {
          return;
        }
        this.deptList = data.dataList.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
        temp = data.dataList.filter(item => {
          return item.id === (this as any).$router.history.current.query.deptId;
        });
        temp.length > 0 &&
          this.fetchDoctor({
            centerId: temp[0].centerId,
            deptId: temp[0].id,
            pageSize: 1000
          });
      });
  }
  /** 拉取医生数据 */
  private fetchDoctor(params) {
    this.http$
      .get<any>(
        {
          url: `/api/order/reserve/doctor/list`,
          params: params
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
        this.doctorList = data.dataList.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
      });
  }

  /** 表单值发生变化 */
  private handleFormChange(val) {}

  mounted() {
    this.fetchDic();
    this.fetchHostipal();
    this.fetchDept((this as any).$router.history.current.query.centerId);
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
  origin?: object;
};
</script>
<style lang="less">
@import "./index.less";
@import "~vue-event-calendar/dist/style.css";
</style>
