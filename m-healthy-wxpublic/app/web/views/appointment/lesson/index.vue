<template>
  <div class="health-lessons">
    <van-tabs @change="changeTab">
      <van-tab :key="item.label" v-for="(item,index) in dic['HMS_ORDER_KNOWLEDGE_CATEGORY']" :title="item.label" >
        <div class="lesson-card" :key="lesson.id" v-for="lesson in knowledgeList" @click="handleLinkto(lesson.articleUrl)"> 
          <img :src="lesson.images"/>
          <p class="title">{{lesson.articleName}}</p>
          <p class="subs">
            {{lesson.description}}
          </p>
        </div>
      </van-tab>
    </van-tabs>

    <p class="tips">
                    <span>
                        {{
                            knowledgeList.length !== 0 ?
                                '没有更多数据了' :
                                '空空如也'
                        }}
                    </span>
                </p>
  </div>
</template>
<script lang="ts">
import { inject } from "../../../service/inject";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import homePage from "../home-page/index.vue";
import person from "../person/index.vue";
import bodyCheck from "../../record/list/index.vue";
import healthCheck from "../../health-check/package/index.vue";
import vanTabs from 'vant/lib/tabs';
import vanTab from 'vant/lib/tab';

@inject({
  selector: ["account$", "globalStore$"]
})
@Component({
  components: { homePage , person, bodyCheck, healthCheck, vanTab, vanTabs}
})
export default class Lesson extends Vue {
  /** 加载 */
  private loading = true;

  private knowledgeList = [];

   /** 数据字典 */
  private dic: {
    [key: string]: {
      label: string;
      value: string;
    }[];
  } = {
    HMS_ORDER_KNOWLEDGE_CATEGORY: []
  };

  // private showIndex = "0"

  private handleLinkto(url) {
      window.location.href = url;
  }

  // private handleChangeNav(value) {
  //   this.showIndex = value;
  //   // this.$router.replace(`${this.navs[value].path}&tab=0`);
  //   this.$router.replace(`/appointment/main?nav=${value}&tab=0`);
  // }

    /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_ORDER_KNOWLEDGE_CATEGORY`
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
          HMS_ORDER_KNOWLEDGE_CATEGORY: data.HMS_ORDER_KNOWLEDGE_CATEGORY.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
        this.fetchList(this.dic['HMS_ORDER_KNOWLEDGE_CATEGORY'][0].value);
      });
  }

   /** 拉取报告历史 */
    private fetchList( type ) {
        return this.http$.get< any >({
            params: {
                pageSize: 999,
                type:type
            },
            url: `/api/order/knowledge`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            this.knowledgeList = status === 200 ? data.list : [ ];
            console.log('苏剧',this.knowledgeList );
        });
    }

  private changeTab(name , title) {
    console.log(name , title);
    const key = this.dic['HMS_ORDER_KNOWLEDGE_CATEGORY'].filter(item => item.label === title);
    key.length>0 && this.fetchList(key[0].value);
  }

  // @Watch('showIndex')
  // onNavChange(val) {
  //    this.showIndex = this.$route.query.hasOwnProperty('nav') ? this.$route.query.nav : '0';
  // }

  async mounted() {
    await this.fetchDic();
    
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>
<style lang="less">
@import '~vant/lib/tabs/index.css';
@import '~vant/lib/tab/index.css';
</style>
