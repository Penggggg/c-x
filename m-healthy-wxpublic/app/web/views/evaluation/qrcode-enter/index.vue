<template>
  <div></div>
</template>
<script lang="ts">
const tools = require("@cvte/wuli-tools").default;
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@inject({
  selector: ["account$"]
})
@Component({
  components: {}
})
export default class QrcodeEnter extends Vue {
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

  /** 检测是否已绑定 */
  private checkIfBound() {
    const clock_ = setInterval(() => {
      const { loading, hasBeenBound } = this.account$.wx;
      if (!loading) {
        clearInterval(clock_);
        if (hasBeenBound) {
          this.getQuestionUrl();
          // return this.$router.replace("/account/has-bind");
        } else {
          const srcAndTemId = this.$util.getQueryString("srcAndTemId");
          setTimeout(() => {
            return this.$router.replace(
              `/account/bind?n=${encodeURIComponent(
                "/e/qrcode-enter?srcAndTemId=" + srcAndTemId
              )}`
            );
          }, 200);
        }
      }
    }, 500);
  }

  /** 拉取问卷地址 */
  private getQuestionUrl() {
    const load = this.loading$.msg("加载中...");
    let srcAndTemId = this.$util.getQueryString("srcAndTemId");
    if (srcAndTemId) {
      const source = srcAndTemId.split("@")[0];
      const templateId = srcAndTemId.split("@")[1];
      const params = {
        source,
        templateId
      };
      this.http$
        .get<any>({
          params,
          url: `/api/evaluation/qrcode-enter`
        })
        .then(res => {
          const { status, data } = res;
          if (status !== 200) {
            this.$toast.error("获取问卷地址错误，请重新扫描二维码...");
            window.close();
            return;
          } else {
            window.location.href = data && data[0] && data[0].url;
          }
        });
    }
  }

  mounted() {
    this.checkIfBound();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
