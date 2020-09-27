<template>
    <div class="con-health-card-list">

        <!-- 列表 -->
        <skt-list
            :loading="loading"
        >
            <div
                class="container-block"
            >
                <div
                    class="tips-block"
                    v-if="!loading && list.length === 0"
                >
                    <svg class="my-icon" aria-hidden="true">
                        <use xlink:href="#icon-qiabao-copy"></use>
                    </svg>
                    <p class="tips">
                        暂无健康卡
                    </p>
                </div>
                <ul v-else class="card-list">
                    <li
                        :key="k"
                        v-for="(item, k) in list"
                        @click="$router.push(`/health-card/detail/${item.id}`)"
                        :class="{ used: item.isUse || item.cardState === '6' }"
                    >

                        <div class="avatar-block">
                            <img :src="convert( item.template.cardImgId )" >
                            <div class="price-block">
                                ¥{{ item.template.cardPrice }}
                            </div>
                        </div>

                        <div class="content-block">

                            <div class="title">
                                {{ item.template.cardTemplateName }}
                            </div>

                            <div class="card-info">
                                No：{{ item.cardNumber }}
                            </div>
                            
                            <div class="card-brief" v-if="item && item.template.cardTemplateBrief">
                                {{ item.template.cardTemplateBrief }}
                            </div>
                            
                            <!-- <div class="content text-content">
                                {{ item.template.serviceDesc }}
                            </div> -->

                            <div class="tags-block">
                                <div
                                    class="tag"
                                    :key="kk"
                                    v-for="(tag, kk) in item.template.tagsList"
                                >
                                    {{ tag.tagName }}
                                </div>
                            </div>

                        </div>

                        <div class="cover-block" v-if="item.isUse || item.cardState === '6'">

                            <div class="icon-block">
                                <svg class="my-icon" aria-hidden="true">
                                    <use xlink:href="#icon-jinzhi"></use>
                                </svg>
                            </div>

                            <div class="tips">
                                {{ 
                                    item.cardState === '6' ?
                                        '已废弃' :
                                        item.isUse ?
                                            '已使用' :
                                            ''
                                }}
                            </div>

                        </div>

                    </li>
                </ul>
            </div>
        </skt-list>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                color="#16c5b0"
                @click="show = true"
            >
                添加健康卡
            </mu-button>
        </div>

        <!-- 添加 -->
        <create-health-card
            :show.sync="show"
        />
    </div>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../service/inject';
import SktList from '../../components/skeleton-list/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import CreateHealthCard from '../../container/create-health-card/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        SktList,
        CreateHealthCard
    }
})
export default class HealthCardList extends Vue {

    /** 展开添加健康卡 */
    private show = false;

    /** 加载列表 */
    private loading = true;

    /** 列表 */
    private list: App.healthCard[ ] = [ ];

    private fetchData( ) {
        this.http$.get<normalResult<App.healthCard[ ]>>({
            url: '/api/health-card'
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            this.loading = false;
            this.list = res.data;
        });
    }

    /** 图片下载地址转换 */
    private convert( imgid ) {
        const tanentId = 'c69e6168-d231-4e2a-b0e1-580263f3f77b';
        const downBaseUrl = process.env.NODE_ENV === 'dev' ?
            // `https://csbtest-api.gz.cvte.cn/cfile/${tanentId}/v1/download/` :
            `https://itapis.cvte.com/cfile/${tanentId}/v1/download/` :
            `https://itapis.cvte.com/cfile/${tanentId}/v1/download/`;
        return `${downBaseUrl}${imgid}`
    }

    @Watch('show')
    onShow( show ) {
        if ( !show ) {
            this.fetchData( );
        }
    }

    @Watch('$route', { deep: true })
    onRoute( route ) {
        const { tab } = route.query;
        if ( Number( tab ) === 0 ) {
            this.fetchData( );
        }
    }

    mounted( ) {
        this.fetchData( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

