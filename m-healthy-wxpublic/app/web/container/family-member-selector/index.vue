<template>
    <div class="con-visiting-man-selector">
        <!-- <my-drawer
            title="管理家属成员"
            :show.sync="theShow"
        > -->
            <div class="container-block">

                <!-- 选择列表 -->
                <skeleton-list
                    :line="5"
                    :loading="loading"
                >   
                    <div
                        class="tips-block"
                        v-if="!loading && selectList.length === 0"
                    >
                        <svg class="my-icon" aria-hidden="true">
                            <use xlink:href="#icon-pengyou"></use>
                        </svg>
                        <p class="tips">
                            暂无家属成员
                        </p>
                    </div>
                    <ul v-else class="select-list">
                        <li
                            :key="k"
                            v-for="(user, k) in selectList"
                            :class="{ active: selectedUser.id === user.id }"
                        >
                            <div class="item name">{{ user.refUserName }}</div>
                            <div class="item relationship">
                                {{ dic.HMS_COMM_RELATIONSHIP.find( x => x.value === user.relationship) ? dic.HMS_COMM_RELATIONSHIP.find( x => x.value == user.relationship).label : '' }}
                            </div>
                            <div class="item mobile">{{ user.telephone }}</div>
                            <div class="delete" @click="deleteItem(user)">
                                删除
                            </div>
                        </li>
                    </ul>
                </skeleton-list>
                <!-- <p class="tips">
                    <span>
                        {{
                            selectList.length !== 0 ?
                                '没有更多数据了' :
                                '空空如也'
                        }}
                    </span>
                    </p> -->

                <!-- 删除确认 -->
                <mu-dialog title="提示" class="booking-list-dialog" width="360" :open.sync="showDialog">
                    确认删除改成员吗?
                    <mu-button
                        flat
                        slot="actions"
                        color="primary"
                        @click="confirm"
                    >
                        确认
                    </mu-button>
                    <mu-button
                        flat
                        slot="actions"
                        color="error"
                        @click="showDialog=false"
                    >
                        取消
                    </mu-button>
                </mu-dialog>

                <!-- 按钮栏 -->
                <div class="btn-block"
                    v-if="!loading"
                >
                    <mu-button
                        full-width
                        color="success"
                        @click="readyToCreate"
                    >
                        新增家属成员
                    </mu-button>
                </div>

            </div>
        <!-- </my-drawer> -->
    </div>
</template>
<script lang="ts">
import MyHeader from "../../components/my-header/index.vue";
import MyDrawer from "../../components/my-drawer/index.vue";
import SkeletonList from "../../components/skeleton-list/index.vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 * @description 家属成员选择组件
 */
@Component({
  components: {
    MyHeader,
    MyDrawer,
    SkeletonList
  }
})
export default class VisitingSelector extends Vue {
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
    HMS_MEDICAL_SITE: [],
    /** 关系 */
    HMS_COMM_RELATIONSHIP: []
  };

  /** 对话框 */
  private showDialog = false;

  /** 选择人的id */
  private selectedUserId = "";

  /** 加载中 */
  private loading = true;

  /** 显示新增 */
  private showCreate = false;

  /** 可选列表 */
  private selectList: App.bodyCheckVisitor[] = [];

  /** 已选家属成员 */
  private selectedUser: App.bodyCheckVisitor = {};

  /** 登录人的id */
  @Prop({ type: String, required: false })
  id!: string;

  /** 是否展示 */
  @Prop({ type: Boolean, required: true })
  show!: boolean;

  get theShow() {
    return this.show;
  }

  set theShow(val) {
    this.closeShow(val);
  }

  /**
   * 监听本组件的展开
   * 首次展开就拉数据
   */
  @Watch("theShow")
  onShow(show) {
    if (show && this.selectList.length === 0) {
      this.fetchList();
    }
    if (show) {
      this.fetchDic();
    }
  }

  /**
   * 监听新增家属成员组件的展开
   * 每次关闭就拉数据
   */
  @Watch("showCreate")
  onShow2(show) {
    if (!show) {
      this.fetchList();
    }
  }

  /** 关闭外部show */
  private closeShow(val) {
    this.$emit("update:show", val);
  }

  /** 家属成员列表 */
  private fetchList() {
    this.http$
      .get<normalResult<any>>(
        {
          url: `/api/account/membersList`
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
        this.loading = false;
        this.selectList = data;
      });
  }

  /** 点击选择一个家属成员 */
  private selectItem(e, user) {
    if (e.target.className === "edit") {
      this.selectedUserId = user.id;
      this.showCreate = true;
      return;
    }
    this.selectedUser = user;
    this.$emit("confirm", user);
    this.closeShow(false);
  }

  /** 选中删除家属成员 */
  private deleteItem(user) {
    this.selectedUser = user;
    this.showDialog = true;
    console.log("delete: ", user);
  }

  /** 确认删除家属成员 */
  private confirm() {
    this.http$
      .delete<normalResult<any>>(
        {
          //   data: {id: this.selectedUser.id},
          params: { id: this.selectedUser.id },
          url: `/api/account/deleteMember`
        },
        {
          successMsg: "删除成功",
          loadMsg: "删除中..."
        }
      )
      .then(res => {
        const { status } = res;
        if (status === 200) {
          this.fetchList();
          this.showDialog = false;
        }
      });
  }

  /** 拉取数据字典 */
  private fetchDic() {
    this.http$
      .get<Api.get.csbDic>(
        {
          url: `/api/common/dic?typeCode=HMS_COMM_SEX,HMS_COMM_RELATIONSHIP`
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
          HMS_COMM_RELATIONSHIP: data.HMS_COMM_RELATIONSHIP.map(x => ({
            label: x.name,
            value: x.itemValue
          }))
        });
      });
  }

  private readyToCreate() {
    this.$router.push("/account/add-members");
  }

  mounted() {
    this.fetchDic();
    this.fetchList();
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

