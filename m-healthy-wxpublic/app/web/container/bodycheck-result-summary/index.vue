<template>
    <div class="con-record-bodycheck-summary">
        <skt-list
            :loading="loading"
        >
            <mu-container
                class="summary-block"
            >
                <!-- 异常指标 -->
                <!-- <mu-expansion-panel
                    :zDepth="0"
                    :expand.sync="expand.abnormal"
                >
                    <div class="item-header" slot="header">
                        <mu-icon
                            size="16"
                            color="blue"
                            value="report_problem"
                        />
                        异常指标 <span v-if="abnormalList.length > 0">(<span class="tips"> {{ abnormalList.length }} </span>)</span>
                    </div>
                    <div class="item-content grey">
                        <ul
                            class="abnormal-list"
                        >
                            <li
                                :key="k"
                                v-for="(abnormal, k) in abnormalList"
                            >
                                <div class="my-header">
                                    {{ abnormal.belong }}
                                </div>
                                <div class="my-content">
                                    <div
                                        :key="kk"
                                        class="my-item"
                                        v-for="(item, kk) in abnormal.items"
                                    >
                                        <div
                                            class="base-info"
                                        >
                                            <span class="error">异</span> {{ item.name }}
                                        </div>
                                        <div class="detail-info">
                                            <span>
                                                <span class="red">{{ item.tips }}</span> {{ item.difference  }}
                                            </span>
                                            <span v-if="item.reference">
                                                正常参考：{{ item.reference }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </mu-expansion-panel> -->

                <!-- 体检异常 - 解释 -->
                <!-- <mu-expansion-panel
                    :zDepth="0"
                    :expand.sync="expand.explanation"
                >
                    <div class="item-header" slot="header">
                        <mu-icon
                            size="16"
                            color="blue"
                            value="report_problem"
                        />
                        体检异常 <span v-if="explanations.length > 0">(<span class="tips"> {{ explanations.length }} </span>)</span>
                    </div>
                    <div class="item-content grey">
                        <ul
                            class="explanation-list"
                        >
                            <li
                                :key="k"
                                v-for="(explanation, k) in explanations"
                            >
                                <div class="my-header">
                                    {{ explanation.name }}
                                </div>
                                <div class="my-content">
                                    <div
                                        :key="kk"
                                        class="explanation-param"
                                        v-for="(param, kk) in explanation.params"
                                    >
                                        <p>{{ param.title }}</p>
                                        <p>{{ param.param }}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </mu-expansion-panel> -->

                <van-collapse v-model="test" v-if="false">
                        <van-collapse-item title="体检结论" name="1" icon="error_outline">
                            <div class="item-content grey">
                                <div class="my-content">
                                    <ul
                                        class="summary-list"
                                    >
                                        <li
                                        >
                                            <div
                                                :key="kk"
                                                class="summary-param"
                                                v-for="(summary, kk) in summaryList"
                                            >
                                                <p>{{ summary.title }}</p>
                                                <p>{{ summary.param }}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </van-collapse-item>
                        <van-collapse-item title="体检建议" name="2" icon="shop-o">
                             <div class="item-content grey">
                                <div class="my-content">
                                    <ul
                                        class="suggestion-list"
                                    >
                                        <li
                                        >
                                            <div
                                                :key="kk"
                                                class="suggestion-param"
                                                v-for="(suggestion, kk) in suggestList"
                                            >
                                                <p>{{ suggestion.title }}</p>
                                                <p v-if="isNaN(suggestion.param.trim()[0])">{{ suggestion.param }}</p>
                                                <p v-if="!!suggestion.param.trim() && !isNaN(suggestion.param.trim()[0])" class="suggestion-content">{{suggestion.param}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </van-collapse-item>
                </van-collapse>

                <!-- 体检结论 -->
                <mu-expansion-panel
                    :zDepth="0"
                    :expand.sync="expand.summary"
                >
                    <div class="item-header" slot="header">
                        <mu-icon
                            size="16"
                            color="orange"
                            value="error_outline"
                        />
                        体检结论
                    </div>
                    <div class="item-content grey">
                        <div class="my-content">
                             <ul
                                class="summary-list"
                            >
                                <li
                                >
                                    <div
                                        :key="kk"
                                        class="summary-param"
                                        v-for="(summary, kk) in summaryList"
                                    >
                                        <p>{{ summary.title }}</p>
                                        <p>{{ summary.param }}</p>
                                    </div>
                                </li>
                             </ul>
                        </div>
                    </div>
                </mu-expansion-panel>

                <!-- 体检建议 -->
                <mu-expansion-panel
                    :zDepth="0"
                    :expand.sync="expand.suggestion"
                >
                    <div class="item-header" slot="header">
                        <mu-icon
                            size="16"
                            color="green"
                            value="sentiment_satisfied_alt"
                        />
                        体检建议
                    </div>
                    <div class="item-content grey">
                        <div class="my-content">
                             <ul
                                class="suggestion-list"
                            >
                                <li
                                >
                                    <div
                                        :key="kk"
                                        class="suggestion-param"
                                        v-for="(suggestion, kk) in suggestList"
                                    >
                                        <p>{{ suggestion.title }}</p>
                                        <p v-if="isNaN(suggestion.param.trim()[0])">{{ suggestion.param }}</p>
                                        <p v-if="!!suggestion.param.trim() && !isNaN(suggestion.param.trim()[0])" class="suggestion-content">{{ suggestion.param.trim() }}</p>
                                    </div>
                                </li>
                             </ul>
                        </div>
                    </div>
                </mu-expansion-panel>

            </mu-container>
        </skt-list>
    </div>
</template>
<script lang="ts">
import SktList from '../../components/skeleton-list/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import vanCollapse from 'vant/lib/collapse';
import vanCollapseItem from 'vant/lib/collapse-item';

/**
 * @description 体检报告的 - 体检结论
 */
@Component({
    components: {
        SktList,
        vanCollapse,
        vanCollapseItem
    }
})
export default class BodyCheckResultSummary extends Vue {

    /** 当前报告的id */
    @Prop({ type: String, required: true }) id!:string;

    /** load */
    private loading = true;

    private test=[];

    /** 展开 */
    private expand = {
        abnormal: true,
        explanation: true,
        summary: true,
        suggestion: true
    };

    /** 异常指标 */
    private abnormalList: App.bodyCheckResultAbnormalItem[ ] = [ ]; 

    /** 体检异常 - 解释 */
    private explanations: App.bodyCheckResulteEplanationItem[ ] = [ ];

    /** 体检结论 */
    private summaryList: App.bodyCheckResulteSummaryItem[ ] = [ ];

    /** 体检建议 */
    private suggestList: App.bodyCheckResulteSuggestItem[ ] = [ ]

    private fetchSummary( id ) {

        this.http$.get<Api.get.clinicRecordDetail>({
            url: `/api/record/clinic/${id}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data} = res;
            if ( status !== 200 ) { return; }

            /** 体检建议 */
            this.suggestList = data.summarySuggest.split('\n').filter( x => !!x ).map( x => ({
                title: '',
                param: x
            }));

            console.log('哈哈哈',this.suggestList);
            
            /** 体检结论 */
            this.summaryList = [
                {
                    title: '',
                    param: data.medicalResult
                }
            ]

            /** 体检异常 - 解释 */
            this.explanations = data.medicalDiseases.map( x => ({
                name: x.diseaseName,
                params: !x.suggestContent ?
                    [ ] :
                    x.suggestContent.split('\n').filter( x => !!x ).map( y => ({
                        title: '',
                        param: y
                    }))
            }));

            /** 异常指标 */
            this.abnormalList = Object.keys( data.abnormalItemMap ).map( big => ({
                belong: big,
                items: data.abnormalItemMap[ big ].map( y => ({
                    name: y.itemName,
                    tips: y.tipsContent,
                    difference: y.medicalValue,
                    reference: y.referenceRange
                }))
            }));

            this.loading = false;

        });
    }

    mounted( ) {
        this.fetchSummary( this.$route.params.id );
    }

}
</script>
<style lang="less">
@import './index.less';
@import '~vant/lib/style/base.css';
@import '~vant/lib/collapse-item/index.css';
</style>
