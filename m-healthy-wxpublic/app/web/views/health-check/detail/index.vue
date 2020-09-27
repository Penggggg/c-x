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
                    <img :src="convert( detail.formImage )" alt="">
                </div>

                <div
                    v-if="detail"
                    class="title"
                >
                    {{ detail.onLinePackageName }}
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
                                    v-for="(tag, kk) in detail.tagList"
                                >
                                    {{ tag.tagName }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.attention">
                        <div class="sub-title bar">
                            注意事项
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                v-for="(d, kkk) in detail.attention.split('\n').filter( x => !!x)"
                            >
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.serviceDesc">
                        <div class="sub-title bar">
                            套餐说明
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                class="indent"
                                v-for="(d, kkk) in detail.serviceDesc.split('\n').filter( x => !!x)"
                            >
                                {{ d }}
                            </p>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.serviceDetail && detail.items"> 
                        <div class="sub-title bar">
                            包含项目
                        </div>
                        <div class="content fuwenben" v-html="detail.serviceDetail">
                            
                        </div>
                        <div class="item-detail" :key="item" v-for="(item) in Object.keys(detail.items)">
                            <p class="title">{{item}}</p>
                            <div class="project" :key="p" v-for="(p) in detail.items[item].project">
                                <p class="prj-name">{{p.name}}:</p>
                                <p class="prj-content">{{p.content}}</p>
                            </div>
                        </div>
                    </div>

                    <div class="info-block" v-if="detail && detail.medicalNotice">
                        <div class="sub-title bar">
                            体检须知
                        </div>
                        <div class="content">
                            <p
                                :key="kkk"
                                v-for="(d, kkk) in detail.medicalNotice.split('\n').filter( x => !!x)"
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
                    ¥{{ detail.price }}
                </span>
            </div>
            <div 
                class="btn"
                @click="goBooking( $route.params.id )"
            >
                预约体检
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
    selector: ['account$', 'globalStore$']
})
@Component({
    components: {
        SktList,
        MyHeader
    }
})
export default class HealthCheckDetail extends Vue {

    /** 加载 */
    private loading = true;

    /** 详情 */
    private detail: App.healthCardDetail | null = null;

    private sorting(arrData: object[]){
        const newObj = {};
        arrData.map((item: any) => {
            if(newObj[item.categoryName]){
                newObj[item.categoryName].project.push(item);
            }else {
                newObj[item.categoryName] = {
                    project: [item]
                };
                // console.log(item);
                // newObj[item.categoryName].project.push(item);
            }
        })
        return newObj;
    }

    /** 拉取 */
    private fetchDetail( id ) {
        // this.http$.get< normalResult< App.healthCardDetail >>({
        this.http$.get< normalResult< any >>({
            url: `/api/health-check/detail/${id}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.detail = Object.assign(data,{items:this.sorting(data.items)});
            console.log(this.detail);
            this.loading = false;
        });
    }

    /** 预约 */
    private goBooking( id ) {
        // 此处是因为新旧系统切换，导致胃肠镜检查跳转错误，因此写死跳转地址
        if( id === 'b6bf104ee7e24b24a2bd10256b1f257b' ) {
                this.$router.push(`/appointment/doctors?id=35c6e14d4fdc4b80888b55b624155f7a&deptId=e5e16484a3cf47e18e5fc6d7ab5f143e`);
                return ;
        }
        if ( !!this.detail && !this.detail.isUse && this.detail.cardState !== '6' ) { 
            if(this.detail.ext && this.detail.ext.isRefClinic === '1'){
                this.globalStore$.Store.packageDetail.ext = this.detail.ext;
                this.$router.push(`/booking/body-check`); // 跳转至门诊
            } else {
                this.$router.push(`/booking/health-check/${id}`); // 跳转至个人体检预约
            }
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
