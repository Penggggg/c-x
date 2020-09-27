<template>
    <div class="tips-warper">
        <mu-bottom-sheet :open.sync="show">
            <div class="tips-content">
                <mu-icon value="info"
                    class="warings"
                    color="#fa7d00"></mu-icon>
                <p class="tips">很抱歉IOS版本微信不允许下载PDF文件，您可以提供邮箱账号，我们将把体检报告发送到您的邮箱</p>
                <p class="input-label">邮箱账号:</p>
                <mu-text-field v-model="email"
                    full-width
                    placeholder="请输入邮箱账号"></mu-text-field>
                <mu-button full-width
                    color="success"
                    @click="submit">提交</mu-button>
            </div>
        </mu-bottom-sheet>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 * @description 创建体检人
 */
@Component({
  components: {}
})
export default class CreateVisitingMan extends Vue {
  /** 目标id */
  @Prop({ required: true })
  download!: () => void;
  /** 目标id */
  @Prop({ required: true })
  id!: string;

  /** 展开 */
  @Prop({ required: true })
  callback!: (any) => void;

  private show = false;

  private email = "";

  private getUa() {
    const u = navigator.userAgent;
    return {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone
      iPad: u.indexOf("iPad") > -1 //是否iPad
    };
  }

  /** 当前浏览器信息 */
  private browser = {
    versions: {ios: false, iPhone: false, iPad:false}
  };

  /** 是否苹果系列设备 */
  private isApple() {
    return (
      this.browser.versions.ios ||
      this.browser.versions.iPhone ||
      this.browser.versions.iPad
    );
  }

  private emailCheck() {
      return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.email);
  }

  private submit() {
    if(!this.emailCheck()) {
        this.$toast.error('请检查邮箱格式！');
        return;
    }
    this.http$
      .post<any>(
        {
          url: `/api/record/email_report`,
          data: {
              reportId: this.id,
              email: this.email
          }
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        if (res.status === 200) {
            this.$toast.success('发送成功，请注意查收');
            this.show = false;
        }
      });
  }

  mounted() {
    this.browser = {
      versions: this.getUa()
    };

    if (this.isApple()) {
      this.callback(() => {
        return () => {
          this.show = true;
        };
      });
    } else {
      this.callback(() => {
        return () => {
          this.download();
        };
      });
    }
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
