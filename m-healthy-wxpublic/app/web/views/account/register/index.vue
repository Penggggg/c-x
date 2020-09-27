<template>
    <div class="p-account-register my-page">

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
                账号绑定
            </span>
        </my-header>

        <!-- 提示 -->
        <div class="tips-block">
            <div class="title">
                <mu-icon
                    size="18"
                    value="info"
                    color="green"
                ></mu-icon>
                注册信息
            </div>
        </div>

        <!-- 表单 -->
        <div class="form-block">
            <my-form
                ref="form"
                :meta="formMeta"
            />
        </div>

        <!-- 协议与帮助 --> 
        <div class="other-block">
            <div class="check-block">
                <mu-checkbox
                    value="eat"
                    v-model="agree"
                />
                <span>
                    <span @click="agree = !agree">已阅读并同意</span>《<a @click="showProcotol=true">用户服务协议</a>》
                </span>
            </div>
            <a href="tel:4000-020-666" class="tel">联系客服</a>
        </div>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                color="success"
                @click="onCheck"
            >
                注册新用户
            </mu-button>
            <a class="my-btn" @click="$router.back()">
                返回
            </a>
        </div>

        <!-- 成功 -->
        <my-drawer
            title="账号绑定"
            :show.sync="success"
        >
            <div
                class="success-block"
            >
                <div class="icon-tips">
                    ✔
                </div>
                <p class="tips-title">
                    注册成功
                </p>
            </div>
        </my-drawer>

        <!-- 服务协议 --> 
        <my-drawer
            title="用户服务协议"
            :show.sync="showProcotol"
        >
            <my-protocol />
        </my-drawer>

    </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import MyDrawer from "../../../components/my-drawer/index.vue";
import MyHeader from "../../../components/my-header/index.vue";
import MyForm from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyProtocol from "../../../container/service-protocol/index.vue";
const tools = require("@cvte/wuli-tools").default;

const { IDCard } = tools;

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    MyForm,
    MyHeader,
    MyDrawer,
    MyProtocol
  }
})
export default class AccountRegister extends Vue {
  /** 展示服务协议 */
  private showProcotol = false;

  /** 是否同意协议 */
  private agree = false;

  /** 成功 */
  private success = false;

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_COMM_SEX: []
  };

  /** 表单信息 */
  get formMeta(): C.MyForm.meta {
    return [
      [
        {
          key: "name",
          label: "姓名",
          type: "input",
          value: undefined,
          rules: [
            {
              validate: val => !!val && !!String(val).trim(),
              message: "必须填写姓名"
            }
          ]
        }
      ],
      // [
      //     {
      //         key: 'gender',
      //         label: '性别',
      //         type: 'radio',
      //         value: undefined,
      //         options: this.dic.HMS_COMM_SEX,
      //         rules: [{
      //             message: '请选择性别',
      //             validate: val => !!val
      //         }]
      //     }
      // ], [
      //     {
      //         key: 'identityCard',
      //         label: '身份证号',
      //         type: 'input',
      //         value: undefined,
      //         rules: [{
      //             validate: val => val && IDCard( val ).isValid,
      //             message: '请填写有效的身份证'
      //         }]
      //     }
      // ], [
      //     {
      //         key: 'birthday',
      //         label: '出生日期',
      //         type: 'date2',
      //         value: undefined,
      //         rules: [{
      //             validate: val => !!val,
      //             message: '请选择出生日期'
      //         }]
      //     }
      // ],
      [
        {
          key: "telephone",
          label: "手机",
          type: "number",
          value: undefined,
          rules: [
            {
              validate: val => /^1\d{10}$/g.test(String(val)),
              message: "号码为1开头的11位数字"
            },
            {
              validate: val => !!val && !!String(val).trim(),
              message: "必须填写手机号码"
            }
          ]
        }
      ],
      [
        {
          saveKey: "form-register",
          label: "验证码",
          key: "verifycode",
          type: "verifycode",
          phonekey: "telephone",
          url: "/api/common/verifycode",
          value: undefined,
          rules: [
            {
              validate: val => !!val && !!String(val).trim(),
              message: "必须填写验证码"
            }
          ]
        }
      ]
    ];
  }

  /** 验证码校验 */
  onCheck() {
    const { result, data } = (this.$refs.form as any).getData();
    const { verifycode, telephone } = data;

    if (!result) {
      return;
    }

    if (!this.agree) {
      return this.$toast.info("请查看并勾选用户服务协议");
    }

    this.http$
      .post<normalResult<any>>(
        {
          url: `/api/common/check-verifycode`,
          data: {
            verifycode,
            phone: telephone
          }
        },
        {
          errMsg: "验证码错误",
          loadMsg: "校验中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
          this.onSubmit();
        }
      });
  }

  /** 提交 */
  private onSubmit() {
    const { appid, openid } = this.account$.wx.data;
    const { result, data } = (this.$refs.form as any).getData();
    // const { birthday, gender, telephone, name, identityCard } = data;
    const { telephone, name } = data;

    if (!result) {
      return;
    }

    this.http$
      .post<normalResult<any>>(
        {
          url: `/api/account/register`,
          data: {
            appId: appid,
            openId: openid,
            telephone,
            name
            // gender, telephone, name, identityCard,
            // birthday: ( new Date( birthday )).getTime( )
          }
        },
        {
          loadMsg: "提交中...",
          successMsg: "注册成功！"
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        this.success = true;
        (this.$refs.form as any).reset();
        setTimeout(( ) => {
              const { n } = this.$route.query;
              if ( !!n ) {
                const host = process.env.NODE_ENV === "dev" ?
                  'http://m-health-wx.cvteapi.com' : 'https://m-health-wx.cvte.com';
                window.location.href = `${host}${this.$route.query.n}`;
              }
          }, 500 );
      });
  }

  /** 拉取数据字典 */
  fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX`
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
          }))
        });
      });
  }

  mounted() {
    this.fetchDic();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
