<template>
    <div class="package-health-card-list">

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
                        暂无体检套餐
                    </p>
                </div>
                <ul v-else class="card-list">
                    <li
                        :key="k"
                        v-for="(item, k) in list"
                        @click="$router.push(`/health-check/new-detail/${item.id}`)"
                    >

                        <div class="avatar-block">
                            <img :src="getPhotoUrl( item.listImage )" >
                            <div class="price-block">
                                ¥{{ item.price && item.price.toFixed(2) }}
                            </div>
                        </div>

                        <div class="content-block">

                            <div class="title">
                                {{ item.onLinePackageName }}
                            </div>
                            
                            <div class="card-brief">
                                {{ item.onLinePackageBrief }}
                            </div>
                            
                            <!-- <div class="content text-content">
                                {{ item.serviceDesc }}
                            </div> -->

                            <div class="tags-block">
                                <div
                                    class="tag"
                                    :key="kk"
                                    v-for="(tag, kk) in item.tagList"
                                >
                                    {{ tag.tagName }}
                                </div>
                            </div>

                        </div>

                    </li>
                </ul>
            </div>
        </skt-list>

    </div>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../service/inject';
import SktList from '../../components/skeleton-list/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        SktList
    }
})
export default class HealthPackageList extends Vue {

    /** 展开添加健康卡 */
    private show = false;

    /** 加载列表 */
    private loading = true;

    /** 列表 */
    private list: App.healthCard[ ] = [ ];

    private fetchData( ) {
        // this.http$.get<normalResult<App.healthCard[ ]>>({
        this.http$.get<normalResult<any>>({
            url: '/api/health-check'
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

    private getPhotoUrl(url){
        const urls = url.split('/');
        return `/api/order/getPhoto/${urls[urls.length-1]}`
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

