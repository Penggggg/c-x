<template>
  <window-title name="测试报告">
    <skt-list type="new" :loading="loading">
      <div class="history-pop">
        <div class="evaluation-list">
          <div :key="k" class="list-item" @click="onTap( item )" v-for="(item, k) in history$">
            <!-- 标题 -->
            <div class="title-block">
              <div class="title"></div>
            </div>

            <!-- 图片、文案 -->
            <div class="info-block">
              <img class="cover-img" :src="item.img$" />
              <div class="tips">{{ item.templateName }}</div>
            </div>

            <!-- 时间 -->
            <div class="time-block" v-if="item.time$">测评时间：{{ item.time$ }}</div>
          </div>
        </div>
      </div>
    </skt-list>
  </window-title>
</template>

<script lang="ts">
import echarts from "echarts";
import { observe, toJS } from "mobx";
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import myDrawer from "../../../components/my-drawer/index.vue";
import windowTitle from "../../../components/window-title/index.vue";
import EvaluationHallIsfinish from "../../../container/evaluation-hall-isfinish/index.vue";
import sktList from "../../../components/skeleton-list/index.vue";

@inject({
  selector: ["account$"]
})
@Component({
  components: {
    sktList,
    myDrawer,
    windowTitle,
    EvaluationHallIsfinish
  }
})
export default class P extends Vue {
  /** 历史 */
  private history: any = [];

  /** 加载中 */
  private loading = true;

  /** 报告的历史 */
  get history$() {
    const { history } = this;

    const coverTs = timestamp => {
      const ts = Number(timestamp);
      if (!timestamp) {
        return "";
      }
      const time = new Date(ts);
      const y = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      const h = time.getHours();
      const mm = time.getMinutes();

      const fixZero = t => `${String(t).length === 1 ? "0" + t : t}`;
      return `${y}-${fixZero(m)}-${fixZero(d)} ${fixZero(h)}:${fixZero(mm)}`;
    };

    return history.map(x => {
      return Object.assign({}, x, {
        img$: this.coverImg(x.accessoryId),
        time$: coverTs(x.answerTime)
      });
    });
  }

  /** 拉取报告历史 */
  private fetchHistory(code) {
    if (!code) {
      return;
    }

    this.loading = true;

    this.http$
      .get<any>({
        params: {
          pageSize: 999,
          state: "ANSWERED",
          templateCode: code
        },
        url: `/api/evaluation/history`
      })
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }

        this.history = data.list;
        this.loading = false;
      });
  }

  private onTap(item) {
    const { id, type, questionnaireUrl, analysisTemplate } = item;
    if (type === "PSYCAP") {
      if (analysisTemplate === "TWO_FACTOR") {
        this.$router.push(`/e/two-factor-result?hid=${id}`);
      } else {
        this.$router.push(`/e/r?hid=${id}`);
      }
    } else {
      window.location.href = questionnaireUrl;
    }
  }

  // 转换附件id为图片地址
  private coverImg(accessoryId) {
    const tanentId = "c69e6168-d231-4e2a-b0e1-580263f3f77b";
    if (accessoryId === "accessoryId" || !accessoryId) {
      return `data:image/png;base64,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`;
    }
    return `https://itapis.cvte.com/cfile/${tanentId}/v1/download/${accessoryId}`;
  }

  mounted() {
    const { code } = this.$route.params;
    this.fetchHistory(code);
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
