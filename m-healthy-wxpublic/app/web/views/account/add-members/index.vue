<template>
  <div class="p-account-bind my-page">
    <!-- 提示 -->
    <div class="tips-block">
      <div class="title">
        <mu-icon size="18" value="info" color="green"></mu-icon>添加说明
      </div>
      <p class="desc">为保护用户隐私，查看家属体检报告需将对方加为家属成员，并获取对方手机验证码，验证通过后方可查看，手机号码为用户体检时使用的号码。</p>
    </div>

    <!-- 表单 -->
    <div class="my-form-block">
      <my-form-v2 ref="form" :meta="formMeta" :disabled="!isEditing" @blur="onBlur" />
    </div>

    <!-- 按钮 -->
    <div class="btn-block">
      <mu-button full-width @click="save" color="success">添加</mu-button>
    </div>
  </div>
</template>
<script lang="ts">
import { observe, toJS } from "mobx";
const tools = require("@cvte/wuli-tools").default;
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import MyFormV2 from "../../../components/my-form-v2/index.vue";
import SmartAvatar from "../../../components/smart-component/index.vue";
import { POINT_CONVERSION_COMPRESSED } from "constants";

const { IDCard } = tools;

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    MyFormV2,
    SmartAvatar
  }
})
export default class AccountBind extends Vue {
  /** 用户数据 */
  private user!: App.systemUser;

  /** 已加载初始数据 */
  private hasLoad = false;

  /** 编辑状态 */
  private isEditing = true;

  /** 校验家属信息 */
  private validateUserResult = "";

  /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_COMM_SEX: [],
    HMS_COMM_RELATIONSHIP: []
  };

  /** 表单数据 */
  get formMeta(): C.MyForm.meta {
    const phone: any = [
      {
        key: "telephone",
        label: "手机",
        type: "number",
        value: undefined,
        // encryptions: [[3, 6]],
        rules: !this.isEditing
          ? []
          : [
              {
                validate: val => /^1\d{10}$/g.test(String(val)),
                message: "号码为1开头的11位数字"
              },
              {
                validate: val => !!val,
                message: "必须填写手机号码"
              }
            ]
      }
    ];

    const origin: C.MyForm.meta = [
      [
        {
          key: "relationship",
          label: "与对方关系",
          type: "select",
          value: undefined,
          options: this.dic.HMS_COMM_RELATIONSHIP,
          rules: [
            {
              validate: val => !!val,
              message: "必须选择与对方关系"
            }
          ]
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
              validate: val => !!val,
              message: "必须填写姓名"
            }
          ]
        }
      ],
      phone,
      [
        {
          saveKey: "personal-bind",
          label: "验证码",
          key: "verifycode",
          type: "verifycode",
          phonekey: "telephone",
          url: "/api/common/verifycode",
          value: undefined,
          rules: [
            {
              validate: val => !!val,
              message: "必须填写验证码"
            }
          ]
        }
      ]
    ];

    return origin;
  }

  @Watch("isEditing")
  onEdit(edit: boolean) {
    if (edit) {
      // (this.$refs.form as any).set({
      //     identityCard: this.user.identityCard,
      //     telephone: this.user.telephone
      // });
    } else {
      const wxData: App.wxAccount = toJS(this.account$.wx.data);
      this.account$.wx.getSysData(wxData.appid, wxData.openid).then(data => {
        if (data) {
          this.user = data;
          this.setFormData(data);
        }
      });
    }
  }

  /** 设置表单信息 */
  private setFormData(data) {
    const { name, relationship, telephone } = data;
    (this.$refs.form as any).set({
      name,
      relationship,
      telephone
    });
  }

  /** 拿到用户数据 */
  private onUserUpdate(user: App.systemUser) {
    if (this.hasLoad) {
      return;
    }
    if (user.id) {
      this.hasLoad = true;
    }
    if (!user.id) {
      return;
    }

    this.user = user;
    this.setFormData(user);
  }

  /** 失焦 */
  private onBlur(e) {
    const { result, data } = (this.$refs.form as any).getData();
    if (String(data.telephone).length === 11 && String(data.name).length > 0) {
      // this.$toast.info("校验家属手机号码中...");
      this.http$
        .get<normalResult<any>>(
          {
            url: `/api/account/validate`,
            params: {
              name: data.name,
              telephone: data.telephone
            }
          },
          {
            loadMsg: "校验家属手机号码中..."
          }
        )
        .then(res => {
          const { status, data, message } = res;
          if (status !== 200) {
            this.$toast.error(message);
            return;
          }
          if (data === null) {
            this.$toast.info("手机号验证通过");
          }
          if (data !== null) {
            const showTips = data.map(item => {
              return item.telephone;
            });
            this.$toast.info("可能的手机号：" + showTips.join(","));
          }
        });
    }
  }

  /** 信息保存 */
  private save() {
    const { result, data } = (this.$refs.form as any).getData();
    const { verifycode, telephone, name, relationship } = data;

    if (!result) {
      return this.$toast.error("请完善表单后重新提交");
    }

    this.http$
      .post<normalResult<any>>(
        {
          data: {
            verifycode,
            phone: telephone
          },
          url: "/api/common/check-verifycode"
        },
        {
          loadMsg: "验证中...",
          errMsg: "验证码或手机号码错误"
        }
      )
      .then(res => {
        const { status } = res;
        if (status !== 200) {
          return;
        }

        const reqData = {
          refUserName: name,
          relationship,
          telephone
        };

        this.http$
          .post<normalResult<any>>(
            {
              data: reqData,
              url: `/api/account/addMembers`
            },
            {
              loadMsg: "添加中...",
              successMsg: "添加成功"
            }
          )
          .then(res => {
            const { status } = res;
            if (status === 200) {
              this.$router.push(`/record/body-check?tab=1`);
            }
          });
      });
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_RELATIONSHIP`
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
        let HMS_COMM_RELATIONSHIP = data.HMS_COMM_RELATIONSHIP;
        HMS_COMM_RELATIONSHIP.splice(
          HMS_COMM_RELATIONSHIP.findIndex(i => i.itemValue === "1"),
          1
        );
        if (
          !this.account$.wx.systemUser.domainName ||
          (this.account$.wx.systemUser.domainName &&
            this.account$.wx.systemUser.domainName.indexOf("hmx_") > -1)
        ) {
        } else {
          HMS_COMM_RELATIONSHIP.splice(
            HMS_COMM_RELATIONSHIP.findIndex(i => i.itemValue === "2"),
            1
          );
          HMS_COMM_RELATIONSHIP.splice(
            HMS_COMM_RELATIONSHIP.findIndex(i => i.itemValue === "3"),
            1
          );
          HMS_COMM_RELATIONSHIP.splice(
            HMS_COMM_RELATIONSHIP.findIndex(i => i.itemValue === "4"),
            1
          );
        }
        this.dic = Object.assign({}, this.dic, {
          HMS_COMM_RELATIONSHIP: data.HMS_COMM_RELATIONSHIP.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
      });
  }

  mounted() {
    this.fetchDic();
  }

  beforeUpdate() {
    // this.onUserUpdate(toJS(this.account$.wx.systemUser));
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

