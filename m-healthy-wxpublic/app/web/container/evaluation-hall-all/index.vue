<template>

    <van-pull-refresh
        v-model="loading"
        @refresh="reset"
    >
    
        <skt-list
            type="new"
            :loading="false"
        >
            <div class="con-evaluation-hall-all">
    
                <!-- 搜索框 -->
                <div class="serch-block">
                    <div class="search-container">
                        <mu-icon value="search" color="fafafa" />
                        <input
                            type="text"
                            v-model="search"
                            @keyup.enter="fetchList"
                        />
                    </div>
                    <div
                        class="search-btn"
                        @click="fetchList"
                    >
                        搜索
                    </div>
                </div>

                <!-- 列表 -->
                <div class="result-list">

                    <div
                        :key="k"
                        class="list-item"
                        @click="onTap( item )"
                        v-for="(item, k) in list$"
                    >
                        <div class="item-cover">
                            <img
                                class="cover-img"
                                :src="item.img$"
                            >
                            <div
                                class="cover-tips"
                                v-if="item.pvCount"
                            >
                                {{ item.pvCount }}人次
                            </div>
                        </div>
                        <div class="info-block">
                            <div class="info-title">
                                {{ item.name }}
                            </div>
                            <div class="info-params">
                                {{ item.explain }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </skt-list>
    </van-pull-refresh>
</template>

<script lang="ts">
import sktList from '../../components/skeleton-list/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import vanPullRefresh from 'vant/lib/pull-refresh';

@Component({
    components: {
        sktList,
        vanPullRefresh
    }
})
export default class P extends Vue {

    // 搜搜
    private search = '';

    // 加载
    private loading = true;

    // 列表
    private list: any = [ ];

    // 列表
    get list$( ) {
        return this.list.map( x => Object.assign({ }, x, {
            img$: this.coverImg( x.accessoryId )
        }));
    }

    // 加载问卷
    private fetchList( ) {

        this.loading = true;

        this.http$.get< any >({
            params: { },
            url: `/api/evaluation?name=${this.search.replace(/\s+/g, '')}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            
            this.list = data;
            this.loading = false;
        });
    }

    // 转换附件id为图片地址
    private coverImg( accessoryId ) {
        const tanentId = 'c69e6168-d231-4e2a-b0e1-580263f3f77b';
        if ( accessoryId === 'accessoryId' ) {
            return `data:image/png;base64,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`
        }
        return `https://itapis.cvte.com/cfile/${tanentId}/v1/download/${accessoryId}`;
    }

    // 点击，跳到问卷答题介绍、问卷报告
    private onTap( item ) {
        const { isAnswer, id, code } = item;

        // 统一掉到问卷详情页面
        this.$router.push(`/e/entry/${id}?code=${code}`)
        // }
    }

    // 下拉刷新
    private reset( ) {
        this.search = '';
        this.fetchList( );
    }

    mounted( ) {
        this.fetchList( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
<style lang="less">
@import '~vant/lib/pull-refresh/index.less';
</style>
