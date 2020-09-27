<template>
  <window-title name="邀请关注">
    <div>
      <!-- <skt-list
                type="new"
                :loading="loading"
            > -->
      <!-- 邀请关注 -->
      <div class="invite-warper"
        v-if="$route.query.from === 'send'">
        <div class="icon-group">
          <mu-icon value="drafts"
            size="84"></mu-icon>
        </div>
        <div class="form-group">
          <p class="tips">
            <mu-icon class="icons"
              value="error_outline"
              color="#fa7d00"></mu-icon>
            <span class="text">请输入被邀请人手机号码:</span>
          </p>
          <div class="search_group">
            <mu-text-field v-model="telephone"
              @change="handleChange"
              full-width
              placeholder="请输入..."></mu-text-field>
          </div>
          <div class="radio-group">
            <mu-radio v-if="!isPeopleEmptyTips" v-model="radioSelect"
              :key="index"
              v-for="(item , index) in peopleList"
              :value="`${item.openId}`"
              :label="`${item.userName}(${item.phone})`"></mu-radio>

              <span v-if="isPeopleEmptyTips" class="people-empty">抱歉，该手机号未查询到注册用户，请先关注并注册为<span>视源健康</span>公众号会员</span>
          </div>
          <mu-button color="success"
            full-width
            @click="handleSendInvite">发送邀请</mu-button>
        </div>
      </div>
      <!-- 确认关注 -->
      <div class="invite-warper"
        v-if="$route.query.from === 'receive'">
        <div class="icon-group">
          <mu-icon value="drafts"
            size="84"></mu-icon>
        </div>
        <div class="form-group">
          <p class="tips">
            <mu-icon class="icons"
              value="error_outline"
              color="#36c67d"></mu-icon>
             <span class="text">{{userInfoList.length>0 ?userInfoList[0].followUserName : ''}}邀请您关注他的体征测量结果</span>
          </p>
           <p class="sup-tips">请于{{userInfoList.length>0 ? userInfoList[0].expiredDate : ''}}前确认</p>
          <!-- <p>请先关注"视源健康"公众号,注册称为会员</p> -->
          <mu-button color="success"
            full-width
            @click="handleAgreeInvite">同意邀请</mu-button>
          <mu-button class="refuse-button"
            :ripple="false"
            @click="handleRefuseInvite"
            full-width>拒绝邀请</mu-button>
        </div>
      </div>
      <!-- </skt-list> -->
    </div>
  </window-title>
</template>
<script lang="ts">
import { observe, toJS } from "mobx";
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import sktList from "../../../components/skeleton-list/index.vue";
import windowTitle from "../../../components/window-title/index.vue";
import { setTimeout } from "timers";

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    sktList,
    windowTitle
  }
})
export default class P extends Vue {
  private loading = false;
  /** 填写的电话号码 */
  private telephone: string = "";

  /** 选择的用户 */
  private radioSelect = "";

  /** 手机号码查询出的用户 */
  private peopleList = [];

  private handleChange(val) {
    this.telephone = val;
  }

  /** 邀请用户信息 */
  private userInfoList = [];

  /** 邀请用户信息是否为空 */
  private isPeopleEmptyTips = false;

  private handleSearch() {
    // if (!/^1\d{10}$/g.test(String(this.telephone))) {
    //   this.$toast.error("请输入正确的手机号码～");
    //   return;
    // }
    this.http$
      .get<any>(
        {
          url: `/api/body-sign/${this.telephone}/user/list`
        },
        {
          loadMsg: "请稍等..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        this.isPeopleEmptyTips = data.length === 0;
        this.peopleList = data;
      });
  }

  /** 发送邀请 */
  private handleSendInvite() {
    if (!this.telephone) {
      this.$toast.error("请填写手机号码");
      return;
    }
    if (!/^1\d{10}$/g.test(String(this.telephone))) {
      this.$toast.error("请填写正确的手机号码");
      return;
    }
    if (!this.radioSelect) {
      this.$toast.error("请选择用户");
      return;
    }

    this.http$
      .post<any>(
        {
          url: `/api/body-sign/invite/${this.radioSelect}/follow`
        },
        {
          loadMsg: "请稍等..."
        }
      )
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }

        this.$toast.success("邀请成功");
        setTimeout(() => {
          this.$router.replace(`/body-sign/list`);
        }, 1000);
      });
  }

  /** 接受邀请 */
  private handleAgreeInvite() {
    this.loading = true;
    // Promise.all(
    //   this.userInfoList.map(item =>
    //     this.http$
    //       .post<any>({
    //         data: item,
    //         url: `/api/body-sign/user/follow`
    //       })
    //       .then(res => {
    //         const { status, data } = res;
    //         if (status !== 200) {
    //           return null;
    //         }

    //         return true;
    //       })
    //   )
    // )
    this.http$
          .post<any>({
            data: {
              followUserInfo:this.userInfoList
            },
            url: `/api/body-sign/user/invite_follow`
          },{
          loadMsg: "请稍等..."
        })
    .then(res => {
      const {status , data} = res;
      if (status !== 200) {
        return this.$toast.error("查询错误");
      }
      this.loading = false;
      this.$toast.success("确认成功");
      setTimeout(() => {
        this.$router.replace(`/body-sign/list`);
      }, 1500);
    });
  }

  /** 拒绝邀请 */
  private handleRefuseInvite() {
    const load = this.loading$.msg("请稍后");
    this.$toast.success("已拒绝");
    setTimeout(() => {
      load.close();
      this.$router.replace(`/body-sign/list`);
    }, 1500);
  }

  /** 获取邀请用户设备信息 */
  private fetchMachine() {
    const { userId, messageId } = this.$route.query;
    console.log('啦啦啦啦啦',userId, messageId);
    this.loading = true;
    this.http$
      .get<any>({
        url: `/api/body-sign/getDetailByUserId?userId=${userId}&messageId=${messageId}`
      })
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }
        console.log('都哦度',data);
        this.userInfoList = data.map(item => {
          return {
            sourceDetailCode: item.sourceDetailCode,
            sourceId: item.sourceId,
            userId: this.account$.wx.systemUser.id,
            followTag: item.followTag,
            followUserName:item.followUserName,
            expiredDate: item.expiredDate,
            followUserId: item.followUserId
          };
        });
        this.loading = false;
      });
  }

  @Watch("telephone")
  onPhoneChange(val) {
    if (/^1\d{10}$/g.test(String(val))) {
      this.handleSearch();
    }
  }
  mounted() {
    this.$route.query.from === "receive" && this.fetchMachine();
  }
}
</script>
<style lang="less">
@import "~vant/lib/radio/index.css";
</style>
<style lang="less">
@import "./index.less";
</style>

