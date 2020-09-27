<template>
    <div class="p-health-card-detail">

        <!-- 头部 -->
        <my-header
            :isfixed="true"
        >
            <span
                slot="left"
                @click="$router.back( )"
            >
                <mu-icon
                    value="keyboard_arrow_left"
                />
            </span>
            <span slot="center">
                套餐详情
            </span>
        </my-header>

        <!-- 详情 -->
        <skt-list
            :loading="loading"
        >
            <div class="container-block">

                <div
                    v-if="detail"
                    class="title-img"
                >
                    <img :src="convert( detail.template.introduceImgId )" alt="">
                </div>

                <div
                    v-if="detail"
                    class="title"
                >
                    {{ detail.template.cardTemplateName }}
                </div>

                <div class="info-block-container">
                    
                    <div class="info-block space" v-if="detail">
                        <div class="sub-title bar">
                            适宜人群
                        </div>
                        <div class="content">
                            <div class="tags-block">
                                <div
                                    class="tag"
                                    :key="kk"
                                    v-for="(tag, kk) in detail.template.tagsList"
                                >
                                    {{ tag.tagName }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.template.attention">
                        <div class="sub-title bar">
                            注意事项
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                v-for="(d, kkk) in detail.template.attention.split('\n').filter( x => !!x)"
                            >
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.template.serviceDesc">
                        <div class="sub-title bar">
                            套餐说明
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                class="indent"
                                v-for="(d, kkk) in detail.template.serviceDesc.split('\n').filter( x => !!x)"
                            >
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.template.serviceDetail">
                        <div class="sub-title bar">
                            包含项目
                        </div>
                        <div class="content fuwenben" v-html="detail.template.serviceDetail">
                            
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.template.medicalNotice">
                        <div class="sub-title bar">
                            体检须知
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                v-for="(d, kkk) in detail.template.medicalNotice.split('\n').filter( x => !!x)"
                            >
                                {{ d }}
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </skt-list>

        <!-- 底部按钮 -->
        <div class="btn-block" v-if="detail">
            <div class="info">
                套餐金额：
                <span class="price">
                    ¥{{ detail.template.cardPrice }}
                </span>
            </div>
            <div 
                class="btn"
                :class="{ used: detail.isUse || detail.cardState === '6' }" 
                @click="goBooking( $route.params.id )"
            >
                {{ 
                    detail.cardState === '6' ?
                        '已废弃' :
                            detail.isUse ?
                            '已使用' :
                            '预约体检'
                }}
            </div>
        </div>

    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyHeader from '../../../components/my-header/index.vue';
import SktList from '../../../components/skeleton-list/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        SktList,
        MyHeader
    }
})
export default class BookingBodyCheck extends Vue {

    /** 加载 */
    private loading = true;

    /** 详情 */
    private detail: App.healthCardDetail | null = null;

    /** 拉取 */
    private fetchDetail( id ) {
        this.http$.get< normalResult< App.healthCardDetail >>({
            url: `/api/health-card/detail/${id}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.detail = data;
            this.loading = false;
        });
    }

    /** 预约 */
    private goBooking( id ) {
        const { auto } = this.$route.query;
        if ( !!this.detail && !this.detail.isUse && this.detail.cardState !== '6' ) {
            this.$router.push(`/booking/health-card/${id}?auto=${ auto ? 1 : 0 }`);
        }
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

    mounted( ) {
        this.fetchDetail( this.$route.params.id );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
