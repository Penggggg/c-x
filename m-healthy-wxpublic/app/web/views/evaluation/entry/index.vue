<template>
    <div>
        <window-title name="测试介绍" >
            <div>
                <div
                    v-if="!loading"
                    class="p-evaluation-entry"
                >
                    <img
                        class="cover-img"
                        :src="detail.img$"
                    />

                    <div class="title">
                        {{ detail.name }}
                    </div>

                    <div class="tips">
                        {{ detail.explain }}
                    </div>

                    <div
                        class="info-block"
                        v-if="detail.subjectNum || detail.timeLimit || detail.answerPeopleCount"
                    >
                        <div
                            class="info"
                            v-if="detail.subjectNum"
                        >
                            {{ detail.subjectNum }}个问题
                        </div>
                        <div
                            class="info"
                            v-if="detail.timeLimit"
                        >
                            {{ detail.timeLimit }}分钟
                        </div>
                        <!-- <div
                            class="info"
                            v-if="detail.answerPeopleCount"
                        >
                            {{ detail.answerPeopleCount }}人测过
                        </div> -->
                        <div
                            class="info"
                            v-if="detail.pvCount"
                        >
                            {{ detail.pvCount }}人浏览过
                        </div>
                    </div>

                    <div class="detail-block">

                        <div
                            class="title"
                            v-if="detail.synopsis"
                        >
                            测试介绍
                        </div>  
                        <div
                            class="param"
                            v-if="detail.synopsis"
                        >
                            {{ detail.synopsis }}
                        </div>

                        <div
                            class="title"
                            v-if="detail.willGet"
                        >
                            你将获得
                        </div>  
                        <div
                            class="param"
                            v-if="detail.willGet"
                        >
                            {{ detail.willGet }}
                        </div>

                        <div
                            class="title"
                            v-if="detail.notice"
                        >
                            测试须知
                        </div>  
                        <div
                            class="param"
                            v-if="detail.notice"
                        >
                            {{ detail.notice }}
                        </div>
                    </div>

                    <div
                        class="fix-btn-container"
                        :class="{ normal: isNormal }"
                    >
                        <a
                            @click="fetchQuestionUrl"
                            class="fix-btn"
                        >
                            {{ !Number( detail.isAnswer ) || qUrl  ? '进入测评' : '再测一次' }}
                        </a>
                    </div>

                    <div class="qrcode-contaier">
                        <div class="qrcode-block">
                            <div class="params-block">
                                <div class="param">
                                    关注视源健康公众号
                                </div>
                                <div>
                                    查看更多心理知识与服务
                                </div>
                            </div>
                            <img
                                class="qrcode"
                                src="/public/img/qrcode.jpg"
                            >
                        </div>
                    </div>

                </div>
                <div
                    v-else
                    class="pe-tips"
                >
                    加载中...
                </div>
            </div>
        </window-title>
        <my-drawer
            title="测试介绍"
            :show.sync="show"
        >
            <div class="pe-info-drawer">
                <div class="pe-info-block">
                    <p class="param">
                        感谢您对视源健康的选择与信任，为了更好的评估您的身体状态，请您认真填写问卷。此份问卷将帮助医生更全面的了解您的生活习惯和饮食习惯，我们将给出更专业和具有针对性的建议，谢谢配合！
                    </p>
                    <p class="param">
                        请您放心填写，我们深刻理解健康数据对于您的重要性，我们郑重承诺将采用一切必要的措施和技术确保数据的安全和保密。
                    </p>
                </div>
                <a
                    class="pe-info-btn"
                    :href="qUrl"
                >
                    继续测评
                </a>
            </div>
        </my-drawer>
    </div>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ActiveTab from '../../../components/active-tab/index.vue';
import windowTitle from '../../../components/window-title/index.vue';
import myDrawer from '../../../components/my-drawer/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        myDrawer,
        ActiveTab,
        windowTitle
    }
})
export default class P extends Vue {

    // 测评按钮
    private isNormal = false;

    // code
    private code = '';

    // 展示介绍
    private show = false;

    // 问卷链接
    private qUrl = '';

    // 问卷详情
    private detail: any = null;

    // 加载状态
    private loading = true;

    /** 获取问卷详情 */
    private fetchDetail( id ) {

        this.loading = true;

        this.http$.get< any >({
            url: `/api/evaluation/detail/${id}`
        }).then( res => {

            const { status, data } = res;
            if ( status !== 200 ) { return; }

            const { synopsis, willGet, notice } = data;

            this.loading = false;
            this.detail = Object.assign({ }, data, {
                img$: this.coverImg( data.accessoryId )
            });
            this.isNormal = `${synopsis}${willGet}${notice}`.length < 100;
            this.code = data.id;
        });
    }

    /** 获取问卷链接 */
    private fetchQuestionUrl( ) {

        const { quId } = this.$route.query;
        if ( quId ) {
            
            this.http$.get< any >({
                params: {
                    quId
                },
                url: `/api/evaluation/get_url_by_old`
            }, {
                loadMsg: '加载中...'
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                window.location.href = data;
            })

        } else {

            this.http$.get< any >({
                params: {
                    templateId: this.code
                },
                url: `/api/evaluation/question-url`
            }, {
                loadMsg: '加载中...'
            }).then( res => {

                const { status, data } = res;
                const { id } = this.$route.params;
                const { code } = this.$route.query;
                if ( status !== 200 ) { return; }

                window.location.href = `${data[ 0 ].url}`;
            });
        }
    }

    // 转换附件id为图片地址
    private coverImg( accessoryId ) {
        const tanentId = 'c69e6168-d231-4e2a-b0e1-580263f3f77b';
        if ( accessoryId === 'accessoryId' ) {
            return `data:image/png;base64,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`
        }
        return `https://itapis.cvte.com/cfile/${tanentId}/v1/download/${accessoryId}`;
    }

    mounted( ) {
        const { qnUrl } = this.$route.query;
        const { id } = this.$route.params;
        this.fetchDetail( id );
        this.qUrl = qnUrl;
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
