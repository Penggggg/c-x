<template>
  <div class="con-evaluation-finish-ornot">
    <skt-list type="new" :loading="loading">
      <div class="con-evaluation-container">
        <div class="evaluation-list">
          <div :key="k" class="list-item" @click="onTap( item )" v-for="(item, k) in list$">
            <!-- 标题 -->
            <div class="title-block">
              <div class="title">
                <!-- {{ item.name }} -->
              </div>
              <div class="status" v-if="!answered">待测评</div>
            </div>

            <!-- 图片、文案 -->
            <div class="info-block">
              <img class="cover-img" :src="item.img$" />
              <div class="tips">{{ item.name }}</div>
            </div>

            <!-- 时间 -->
            <div
              class="time-block"
              v-if="item.time$"
            >{{ answered ? '测评' : '推送' }}时间：{{ item.time$ }}</div>
          </div>
        </div>
      </div>
    </skt-list>
  </div>
</template>

<script lang="ts">
import sktList from "../../components/skeleton-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    sktList
  }
})
export default class P extends Vue {
  // 加载
  private loading = true;

  // 列表
  private list: any = [];

  // 是否已答题
  @Prop({ type: Boolean }) answered!: boolean;

  // 列表
  get list$() {
    const { answered } = this;
    const coverTs = timestamp => {
      const ts = Number(timestamp);
      if (!ts) {
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

    return this.list.map(x =>
      Object.assign({}, x, {
        img$: this.coverImg(x.accessoryId),
        time$: coverTs(answered ? x.answerTime : x.sendTime)
      })
    );
  }

  @Watch("answered")
  onAnswered(val) {
    this.fetchList();
  }

  // 加载问卷
  private fetchList() {
    this.loading = true;

    this.http$
      .get<any>({
        params: {},
        url: this.answered
          ? "/api/evaluation/list/finished"
          : `/api/evaluation/list/unfinished`
      })
      .then(res => {
        const { status, data } = res;
        if (status !== 200) {
          return;
        }

        this.list = data;
        this.loading = false;
      });
  }

  /** 拉取报告历史 */
  private fetchHistory(code) {
    return this.http$
      .get<any>(
        {
          params: {
            pageSize: 999,
            state: "ANSWERED",
            templateCode: code
          },
          url: `/api/evaluation/history`
        },
        {
          loadMsg: "加载中..."
        }
      )
      .then(res => {
        const { status, data } = res;
        return status === 200 ? data.list : [];
      });
  }

  // 转换附件id为图片地址
  private coverImg(accessoryId) {
    const tanentId = "c69e6168-d231-4e2a-b0e1-580263f3f77b";
    if (accessoryId === "accessoryId") {
      return `data:image/png;base64,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`;
    }
    return `https://itapis.cvte.com/cfile/${tanentId}/v1/download/${accessoryId}`;
  }

  // 点击，跳到问卷答题介绍、问卷报告
  private onTap(item) {
    const {
      isAnswer,
      id,
      code,
      type,
      templateId,
      qnUrl,
      quId,
      analysisTemplate
    } = item;
    // 已完成
    if (Number(isAnswer)) {
      if (type === "PSYCAP") {
        console.log("item: ", item);
        if (analysisTemplate === "TWO_FACTOR") {
          this.$router.push(
            `/e/two-factor-result?tid=${id || templateId}&code=${code}`
          );
        } else {
          // 心理问卷，跳到报告结果
          this.$router.push(`/e/r?tid=${id || templateId}&code=${code}`);
        }
      } else {
        this.fetchHistory(code).then(history => {
          // 答题历史等于1，直接跳到问答宝历史记录
          if (history.length === 1) {
            window.location.href = history[0].questionnaireUrl;
          } else {
            // 非心理问卷，如果答题历史大于1，跳到历史选择，然后再选择是否跳到问答宝、报告结果
            this.$router.push(`/e/history/${code}`);
          }
        });
      }

      // 未完成
    } else {
      this.$router.push(
        `/e/entry/${id || templateId}?qnUrl=${qnUrl}&quId=${quId}`
      );
    }
  }

  mounted() {
    this.fetchList();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
