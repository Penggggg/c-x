<template>
    <div class="con-visiting-man-selector">
        <my-drawer
            title="选择体检人"
            :show.sync="theShow"
        >
            <div class="container-block">

                <!-- 选择列表 -->
                <skeleton-list
                    :line="5"
                    :loading="loading"
                >
                    <ul class="select-list">
                        <li
                            :key="k"
                            @click="e => selectItem( e, user )"
                            v-for="(user, k) in selecteList"
                            :class="{ active: selectedUser.id === user.id }"
                        >
                            <div class="item name">{{ user.name }}</div>
                            <div class="item sex">
                                {{ dic.HMS_COMM_SEX[ user.sexCode ]}}
                            </div>
                            <div class="item birth">
                                {{ user.birthDate ? (new Date( user.birthDate )).toLocaleDateString( ) : ''}}
                            </div>
                            <div class="item mobile">{{ user.mobileNumber }}</div>
                            <div class="edit">
                                编辑
                            </div>
                        </li>
                    </ul>
                </skeleton-list>

                <!-- 按钮栏 -->
                <div
                    v-if="!loading"
                    class="btn-block"
                >
                    <mu-button
                        full-width
                        color="#16c5b0"
                        @click="readyToCreate"
                    >
                        新增体检人
                    </mu-button>
                </div>

            </div>
        </my-drawer>
        <create-visitor
            :id="selectedUserId"
            :show.sync="showCreate"
        />
    </div>
</template>
<script lang="ts">
import MyHeader from '../../components/my-header/index.vue';
import MyDrawer from '../../components/my-drawer/index.vue';
import SkeletonList from '../../components/skeleton-list/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateVisitor from '../../container/creat-visiting-man/index.vue';
import { setTimeout } from 'timers';


/**
 * @description 体检人选择组件
 */
@Component({
    components: {
        MyHeader,
        MyDrawer,
        SkeletonList,
        CreateVisitor
    }
})
export default class VisitingSelector extends Vue {

    /** 登录人的id */
    @Prop({ type: String, required: false }) id!: string

    /** 是否展示 */
    @Prop({ type: Boolean, required: true }) show!: boolean

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            [ key: string ]: string
        }
    } = {
        HMS_COMM_SEX: { }
    };

    /** 选择人的id */
    private selectedUserId = '';

    /** 加载中 */
    private loading = true;

    /** 显示新增 */
    private showCreate = false;

    /** 可选列表 */
    private selecteList: App.bodyCheckVisitor[ ] = [ ];

    /** 已选就诊人 */
    private selectedUser: App.bodyCheckVisitor = { };

    get theShow( ) {
        return this.show;
    }

    set theShow( val ) {
        this.closeShow( val );
    }

    /**
     * 监听本组件的展开
     * 首次展开就拉数据
     */
    @Watch('theShow')
    onShow( show ) {
        if ( show && this.selecteList.length === 0 ) {
            this.fetchList( )
        }
        if ( show ) {
            this.fetchDic( );
        }
    }

    /**
     * 监听新增就诊人组件的展开
     * 每次关闭就拉数据
     */
    @Watch('showCreate')
    onShow2( show ) {
        if ( !show ) {
            this.fetchList( )
        }
    }

    /** 关闭外部show */
    private closeShow( val ) {
        this.$emit('update:show', val );
    }

    /** 根据ID，拉取数据 */
    private fetchList( ) {
        this.http$.get<normalResult<any>>({
            url: `/api/booking/clinic_people`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.loading = false;
            this.selecteList = data;

            if ( !!this.id ) {
                const target = data.find( x => x.relateArchiveId === this.id );
                if ( !!target ) {
                    this.selectedUser = target;
                    this.$emit('confirm', target );
                }
            }
        });
    }

    /** 点击选择一个就诊人 */
    private selectItem( e, user ) {
        if (  e.target.className === 'edit' ) {
            this.selectedUserId = user.id;
            this.showCreate = true;
            return;
        }
        this.selectedUser = user;
        this.$emit('confirm', user );
        this.closeShow( false );
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_COMM_SEX`
        }, {
            errMsg: '加载错误',
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            let obj = { };
            if ( Array.isArray( data.HMS_COMM_SEX )) {
                data.HMS_COMM_SEX.map( item => {
                    obj[ item.itemValue ] = item.name;
                });
            }
            this.dic = Object.assign({ }, this.dic, {
                HMS_COMM_SEX: obj
            })
        });
    }

    private readyToCreate( ) {
        this.selectedUserId = '';
        setTimeout(( ) => this.showCreate = true, 0 );
    }

    mounted( ) {
        setTimeout(( ) => {
            if ( this.selecteList.length === 0 ) {
                this.fetchList( )
            }
        }, 3000 );
    }

}

</script>
<style lang="less">
@import './index.less';
</style>

