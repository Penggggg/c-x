<template>
  <div class="p-account-bind-v2 my-page">
    <!-- 头部 -->
    <!-- <my-header :isfixed="true">
            <span slot="center">
                账号绑定
            </span>
    </my-header>-->
    <div v-if="false">
      <!-- 提示 -->
      <div class="tips-block">
        <div class="title">
          <mu-icon size="18" value="info" color="green"></mu-icon>绑定说明
        </div>
        <p class="desc">来我司体检过用户请使用姓名、身份证进行绑定登录，未曾体检过用户请注册新用户。</p>
      </div>

      <!-- 表单 -->
      <div class="form-block">
        <keep-alive>
          <my-form
            :key="1"
            ref="form"
            :meta="formMeta"
            v-if="bindType === '1'"
            @change="onFormChange"
          />
          <my-form v-else :key="2" ref="form" :meta="formMeta2" @change="onFormChange" />
        </keep-alive>
      </div>

      <!-- 协议与帮助 -->
      <div class="other-block">
        <div class="check-block">
          <mu-checkbox value="eat" v-model="agree" />
          <span>
            <span @click="agree = !agree">已阅读并同意</span>《
            <a @click="showProcotol=true">用户服务协议</a>》
          </span>
        </div>
        <a href="tel:4000-020-666" class="tel">联系客服</a>
      </div>

      <!-- 按钮 -->
      <!-- <div class="btn-block">
                <mu-button full-width
                    color="success"
                    @click="onCheck"
                    :disabled="account$.wx.loading || account$.wx.hasBeenBound">
                    绑定用户
                </mu-button>
                <a @click="goRegister"
                    class="my-btn">
                    注册新用户
                </a>
      </div>-->

      <!-- 成功 -->
      <my-drawer title="账号绑定" :show.sync="success">
        <div class="success-block">
          <div class="icon-tips">✔</div>
          <p class="tips-title">绑定成功</p>
        </div>
      </my-drawer>

      <!-- 服务协议 -->
      <my-drawer title="用户服务协议" :show.sync="showProcotol">
        <my-protocol />
      </my-drawer>
    </div>
    <div class="person-account-bind" v-if="true">
      <div class="form-warper">
        <img src="http://www.yibicom.com/themes/simpleboot3/public/assets/images/logo1.png" alt />
        <div>
          <div class="my-form-block">
            <my-form :key="2" ref="forms" :meta="newFormMeta" />
          </div>
        </div>
      </div>
      <!-- <div class="submit">
                 <mu-button full-width color="#16CCB9" large>登陆/注册</mu-button>
      </div>-->
      <div class="btn-block">
        <div class="btn" @click="onCheck">登录/注册用户</div>
      </div>
      <div class="tips">
        <div class="check-block">
          <mu-checkbox value="eat" v-model="agree" color="#16CCB9" />
          <span>
            <span @click="agree = !agree">已阅读并同意</span>《
            <a @click="showProcotol=true">用户服务协议</a>》
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
const tools = require("@cvte/wuli-tools").default;
import { inject } from "../../../service/inject";
import MyDrawer from "../../../components/my-drawer/index.vue";
import MyHeader from "../../../components/my-header/index.vue";
import MyForm from "../../../components/my-form-v2/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyProtocol from "../../../container/service-protocol/index.vue";

enum bindType {
  name = "1",
  idCard = "2"
}

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
export default class AccountBind extends Vue {
  /** 展示服务协议 */
  private showProcotol = false;

  /** 协议 */
  private agree = true;

  /** 成功 */
  private success = false;

  /** 失败 */
  private fail = false;

  /** 是否已经绑定过 */
  private hasBeenBind = false;

  /** 绑定方式 */
  private bindType = bindType.name;

  /** 表单信息 */
  get newFormMeta(): C.MyForm.meta {
    return [
      [
        {
          key: "name",
          label: "姓名",
          type: "input",
          value: undefined,
          color: "#16CCB9",
          rules: [
            {
              validate: val => !!val && !!String(val).trim(),
              message: "必须填写姓名"
            },
            {
              validate: val => !!val && String(val).length <= 10,
              message: "姓名小于10个字"
            }
          ]
        }
      ],
      [
        {
          key: "telephone",
          label: "手机",
          type: "number",
          value: undefined,
          color: "#16CCB9",
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
          saveKey: "form-bind2",
          label: "验证码",
          key: "verifycode",
          type: "verifycode",
          phonekey: "telephone",
          url: "/api/common/verifycode",
          color: "#16CCB9",
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

  /** 表单信息 */
  get formMeta(): C.MyForm.meta {
    return [
      [
        {
          key: "type",
          label: "绑定方式",
          type: "radio",
          value: this.bindType,
          options: [
            { label: "姓名", value: bindType.name },
            { label: "身份证", value: bindType.idCard }
          ],
          rules: []
        }
      ],
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
            },
            {
              validate: val => !!val && String(val).length <= 10,
              message: "姓名小于10个字"
            }
          ]
        }
      ],
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
          saveKey: "form-bind",
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

  /** 表单信息2 */
  get formMeta2(): C.MyForm.meta {
    return [
      [
        {
          key: "type",
          label: "绑定方式",
          type: "radio",
          value: this.bindType,
          options: [
            { label: "姓名", value: bindType.name },
            { label: "身份证", value: bindType.idCard }
          ],
          rules: []
        }
      ],
      [
        {
          key: "idCard",
          label: "身份证号",
          type: "input",
          value: undefined,
          rules: [
            {
              validate: val => val && IDCard(val).isValid,
              message: "请填写有效的身份证"
            }
          ]
        }
      ],
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
          saveKey: "form-bind",
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

  @Watch("bindType")
  onBindType(bindType: bindType) {
    setTimeout(() => {
      (this.$refs.form as any).set({
        type: bindType
      });
    }, 0);
  }

  /** 验证码校验 */
  private onCheck() {
    if (this.hasBeenBind) {
      return this.$router.replace("/account/has-bind");
    }

    const { result, data } = (this.$refs.forms as any).getData();
    const { verifycode, telephone } = data;

    console.log("数据啊", telephone, name, verifycode);

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
    const { result, data } = (this.$refs.forms as any).getData();

    console.log("最终的", data);

    let reqUrl = "";
    let reqData = {
      appId: appid,
      openId: openid
    };
    const { name, telephone } = data;
    reqUrl = `/api/account/register`;
    reqData = Object.assign({}, reqData, {
      name,
      phone: telephone
    });

    // if ( this.bindType === bindType.name ) {
    //         const { name, telephone } = data;
    //         reqUrl = `/api/account/bind/name`;
    //         reqData = Object.assign({ }, reqData, {
    //             name, telephone
    //         });
    //     } else if ( this.bindType === bindType.idCard ) {
    //         const { idCard, telephone } = data;
    //         reqUrl = `/api/account/bind/idcard`;
    //         reqData = Object.assign({ }, reqData, {
    //             idCard, telephone
    //         });
    //     }

    // console.log('result',reqData);

    this.http$
      .post<normalResult<any>>(
        {
          url: reqUrl,
          data: reqData
        },
        {
          loadMsg: "提交中...",
          errMsg: "绑定失败，关联不到用户信息，请尝试使用其它绑定方式。"
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        if (!!data) {
          this.success = true;
          this.hasBeenBind = true;
          this.$toast.success("绑定成功！");
          setTimeout(() => {
            const { n } = this.$route.query;
            if (!!n) {
              const host =
                process.env.NODE_ENV === "dev"
                  ? "http://m-health-wx.cvteapi.com"
                  : "https://m-health-wx.cvte.com";
              window.location.href = `${host}${decodeURIComponent(
                this.$route.query.n
              )}`;
            }
          }, 500);
        } else {
          this.$toast.error(
            "绑定失败，关联不到用户信息，请尝试使用其它绑定方式。"
          );
        }
      });
  }

  /** 表单更改 */
  private onFormChange(val) {
    const { type } = val;
    this.bindType = type;
  }

  /** 检测是否已绑定 */
  private checkIfBound() {
    const clock_ = setInterval(() => {
      const { loading, hasBeenBound } = this.account$.wx;
      if (!loading) {
        clearInterval(clock_);
        if (hasBeenBound) {
          return this.$router.replace("/account/has-bind");
        }
      }
    }, 300);
  }

  /** 跳到注册页面 */
  private goRegister() {
    this.$router.push(`/account/register?n=${this.$route.query.n}`);
  }

  mounted() {
    this.checkIfBound();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
