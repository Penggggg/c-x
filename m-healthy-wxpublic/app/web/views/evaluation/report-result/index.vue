<template>
    <window-title name="测试报告" >
        <div>
            <div
                v-if="!loading"
                class="p-evaluation-report-result"
            >

                <div
                    class="title"
                >
                    {{ base.title }}
                </div>

                <div class="time">
                    {{ base.time }}
                </div>

                <div
                    class="result nc np"
                    v-if="base.total !== null && base.total !== undefined && !base.totalDesc && !hideTotal"
                >
                    您的测试结果为：
                    <!-- 您的得分总计为：<span class="green">{{ base.total }}分</span> -->
                </div>

                <div class="result-table" v-if="SCL90">
                    <div class="item" v-for="(latitude, k) in tableLatitudes" :key="k">
                        <div class="key">{{latitude.label}}</div>
                        <div class="value">{{latitude.total}}</div>
                    </div>
                </div>

                <div
                    class="result nc np"
                    v-if="base.totalDesc && !isDISC "
                >
                    {{ base.totalDesc }}
                </div>

                <!-- DISC -->
                <div
                    class="result nc np"
                    v-if="base.DISCTotal.length > 0 && !!isDISC "
                >
                    <span
                        :key="kk"
                        v-for="(disc, kk) in base.DISCTotal"
                    >
                        {{ disc[ 0]}}: <span class="green mr">{{ disc[ 1 ]}}个</span>
                    </span>
                </div>

                <!-- 纬度分析 -->
                <div class="latitudes-block">
                    <div
                        :key="k"
                        class="latitude"
                        :class="{ inline: !!base.valueDesc }"
                        v-for="(latitude, k) in latitudes$"
                    >
                        <div
                            class="latitude-title"
                            :class="{ inline: !!base.valueDesc }"
                        >
                            {{ latitude.label }}：<span class="green">{{ latitude.total }}分</span>
                        </div>
                        <div
                            class="latitude-info"
                            v-if="!base.valueDesc"
                        >
                            <fu-wen-ben :value="latitude.msg" />
                        </div>
                        <div
                            class="latitude-info"
                            v-if="!base.valueDesc && latitude.explain"
                        >
                            <fu-wen-ben :value="latitude.explain" />
                        </div>
                    </div>
                </div>

                <!-- 总分析 -->
                <div 
                    class="base-all"
                    v-if="base.valueDesc"
                >
                    <div class="latitude-info">
                        <fu-wen-ben :value="base.valueDesc" />
                    </div>
                    <div
                        v-if="base.explain"
                        class="latitude-info mt"
                    >
                        <fu-wen-ben :value="base.explain" />
                    </div>
                </div>

                <!-- 按钮 -->
                <div class="btn-block">
                    <div
                        :key="k"
                        class="btn"
                        @click="active = k"
                        :class="{ active: active === k }"
                        v-for="(echart, k) in echartType$"
                    >
                        {{ echart.label }}
                    </div>
                </div>

                <!-- echar图表 -->
                <div class="echart-container" id="main" style="height: 400px;padding-left:0px"></div>

                <div class="action-block">
                    <div
                        class="action-btn"
                        @click="goHistory"
                        v-if="!!$route.query.tid && history.length > 1"
                    >
                        查看历史测评
                    </div>
                    <a
                        :href="qUrl"
                        class="action-btn green"
                    >
                        再测一次
                    </a>
                </div>

                <my-drawer
                    title="历史测评"
                    :show.sync="showHistory"
                >
                    <div class="history-pop">
                       <div class="evaluation-list">
                            <div
                                :key="k"
                                class="list-item"
                                @click="onTap( item )"
                                v-for="(item, k) in history$"
                            >

                                <!-- 标题 -->
                                <div class="title-block">
                                    <div class="title">
                                    </div>
                                </div>

                                <!-- 图片、文案 -->
                                <div class="info-block">
                                    <img
                                        class="cover-img"
                                        :src="item.img$"
                                    />
                                    <div class="tips">
                                        {{ item.templateName }}
                                    </div>
                                </div>

                                <!-- 时间 -->
                                <div
                                    class="time-block"
                                    v-if="item.time$"
                                >
                                    测评时间：{{ item.time$ }}
                                </div>

                            </div>
                        </div>
                    </div>
                </my-drawer>

            </div>
            <div
                v-else
                class="pe-tips"
            >
                加载中...
            </div>
        </div>
    </window-title>
</template>

<script lang="ts">
import echarts from 'echarts';
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import myDrawer from '../../../components/my-drawer/index.vue';
import windowTitle from '../../../components/window-title/index.vue';
import EvaluationHallIsfinish from '../../../container/evaluation-hall-isfinish/index.vue';
import FuWenBen from '../../../components/show-fuwenben/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        FuWenBen,
        myDrawer,
        windowTitle,
        EvaluationHallIsfinish
    }
})
export default class P extends Vue {

    // disc
    private isDISC = false;

    // SCL90
    private SCL90 = false;

    /** 历史监听器 */
    private hasHistoryListener = false;

    /** 再试一次 */
    private qUrl = '';

    /** 历史 */
    private history: any = [ ];

    /** 加载中 */
    private loading = true;

    /** 展示历史 */
    private showHistory = false;

    /** 隐藏总分 */
    private hideTotal = false;

    /** 图型类型 */
    private active = 0;

    /** 图型类型 */
    private echartType = [
        {
            value: 0,
            label: '柱状图'
        }, {
            value: 1,
            label: '条形图'
        }, {
            value: 2,
            label: '折线图'
        }
    ];

    /** charts */
    private charts: any = null;

    /** 基本信息 */
    private base: any = {
        total: '',
        title: '',
        time: '',
        max: null,
        min: null,
        totalDesc: ''
    }

    /** 纬度、分数 */
    private latitudes: {
        label: any,
        total: any,
        msg: any,
        explain?: any
    }[ ] = [ ];
    /** 表格展示纬度、分数 */
    private tableLatitudes: {
        label: string,
        total: string | number,
        msg?: string
    }[ ] = [ ];

    /** 图型类型 */
    get echartType$( ) {
        const { echartType, latitudes } = this;
        if ( latitudes.length === 1 ) {
            return [ echartType[ 0 ], echartType[ 1 ]];
        } else {
            return echartType
        }
    }

    /** 绘图参数 */
    get chartesOptions$( ) {

        let meta: any = null;
        const { latitudes, active, base } = this;

        // 条形图
        if ( active === 1 ) {
            meta = {
                color: ['#1abc9c'],
                yAxis: {
                    type: 'category',
                    data: latitudes.map( x =>
                        x.label.includes('-') ?
                            x.label.split('-')[ 1 ] : 
                            x.label.includes('－') ?
                                x.label.split('－')[ 1 ] : 
                                x.label
                     ),
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        fontSize: 10,
                        interval: 0,
                        rotate: latitudes.some( x => String( x.label ).length > 4 ) ? 60 : 40
                    }
                },
                xAxis: {
                    min: base.min !== undefined && base.min !== null ? base.min : undefined,
                    max: base.max !== undefined && base.max !== null ? base.max : undefined,
                    type: 'value',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                },
                series: [{
                    type: 'bar',
                    barWidth: '50%',
                    data: latitudes.map( x => x.total ),
                }],
                grid: {
                    left:"14%"
                }
            }
        // 柱状图
        } else if ( active === 0 ) {

            meta = {
                color: ['#1abc9c'],
                xAxis: {
                    type: 'category',
                    data: latitudes.map( x => 
                        x.label.includes('-') ?
                            x.label.split('-')[ 1 ] : 
                            x.label.includes('－') ?
                                x.label.split('－')[ 1 ] : 
                                x.label
                        ),
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                },
                yAxis: {
                    min: base.min !== undefined && base.min !== null ? base.min : undefined,
                    max: base.max !== undefined && base.max !== null ? base.max : undefined,
                    type: 'value'
                },
                series: [{
                    type: 'bar',
                    barWidth: '50%',
                    data: latitudes.map( x => x.total ),
                }],
                grid: {
                    bottom:"24%"
                }
            }

        // 折线图
        } else if ( active === 2 ) {
            meta = {
                color: ['#1abc9c'],
                xAxis: {
                    type: 'category',
                    data: latitudes.map( x =>
                        x.label.includes('-') ?
                            x.label.split('-')[ 1 ] : 
                            x.label.includes('－') ?
                                x.label.split('－')[ 1 ] : 
                                x.label
                     ),
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                },
                yAxis: {
                    type: 'value',
                    min: base.min !== undefined && base.min !== null ? base.min : undefined,
                    max: base.max !== undefined && base.max !== null ? base.max : undefined,
                },
                series: [{
                    type: 'line',
                    data: latitudes.map( x => x.total ),
                }]
            }
        }

        // 柱状图
        return meta;
    }

    /** 报告的历史 */
    get history$( ) {
        const { history } = this;

        const coverTs = timestamp => {
     
            const ts = Number( timestamp );
            if ( !timestamp ) { return '';}
            const time = new Date( ts );
            const y = time.getFullYear( );
            const m = time.getMonth( ) + 1;
            const d = time.getDate( );
            const h = time.getHours( );
            const mm = time.getMinutes( );

            const fixZero = t => `${String( t ).length === 1 ? '0' + t : t }`;
            return `${y}-${fixZero( m )}-${fixZero( d )} ${fixZero( h )}:${fixZero( mm )}`;
        };
        
        return history.map( x => {
            return Object.assign({ }, x, {
                img$: this.coverImg( x.accessoryId ),
                time$: coverTs( x.answerTime )
            })

        });
    }

    /** 维度 */
    get latitudes$( ) {
        const { isDISC, latitudes } = this;
        // 如果是disc，选出最大的几个维度进行展示
        let max = 0;
        latitudes.map( l => {
            if ( Number( l.total ) > max ) {
                max = Number( l.total );
            }
        })

        if ( isDISC ) {
            return latitudes.filter( x => Number( x.total ) === max );
        }

        return latitudes;
    }

    @Watch('active')
    onActive( val ) {
        if ( !this.loading ) {
            setTimeout(( ) => this.drawPie('main'), 0 );
        }
    }

    /** 通过tid 拉取报告详情 */
    private fetchDetail( tid ) {

        if ( !tid ) { return; }

        this.loading = true;

        this.http$.get< any >({
            params: {
                templateId: tid
            },
            url: `/api/evaluation/report`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.dealData( data );
        });
    }

    /** 通过历史id 拉取报告详情 */
    private fetchDetail2( hid ) {

        if ( !hid ) { return; }

        this.loading = true;

        this.http$.get< any >({
            url: `/api/evaluation/report2/${hid}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.dealData( data );
            this.loading = false;

            // 这里要调一下 fetchQuestionUrl
            this.fetchQuestionUrl( data.templateId )
            this.fetchHistory( data.templateId )
        });
    }

    /** 拉取报告历史 */
    private fetchHistory( code ) {
    
        if ( !code ) { return; }

        this.http$.get< any >({
            params: {
                pageSize: 999,
                state: 'ANSWERED',
                templateCode: code
            },
            url: `/api/evaluation/history`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.history = data.list;
        });
    }

    /** 获取问卷链接 */
    private fetchQuestionUrl( id ) {

        if ( !id ) { return; }
        this.http$.get< any >({
            params: {
                templateId: id
            },
            url: `/api/evaluation/question-url`
        }).then( res => {

            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.qUrl = data[ 0 ].url;
        });
    }

    /** 点击历史 */
    private onTap( item ) {
        const { id } = item;
        // 历史退一格
        this.$router.push(`/e/r?hid=${id}`);
    }

    /** 查看历史 */
    private goHistory( ) {
        const { code } = this.$route.query;
        this.$router.push(`/e/history/${code}`)
    }

    private dealData( data ) {
        const { psycapType, totalDesc, valueDesc, answerTime,totalAvg,
            templateName, totalScore, dimensionCountResponseDTOs, crisisAvg, crisisItemNum } = data;

        this.loading = false;
        let DISCTotal: any = [ ];
        this.isDISC = psycapType === 'DISC' || 
            psycapType ==='ENNEAGRAM HOLLANDER_OCCUPATION' || 
            psycapType === 'ENNEAGRAM' ||
            psycapType === 'HOLLANDER_OCCUPATION';
        
        this.hideTotal = psycapType === 'ENNEAGRAM' ||
            psycapType === 'HOLLANDER_OCCUPATION';

        const explainArr: any = [ ];
        dimensionCountResponseDTOs.map( x => {
            const e = x.explain ?
                x.explain.indexOf('小贴士') === -1 && x.explain.indexOf('小知识') === -1 ?
                `【定义】${x.explain}` :
                x.explain :
            '';
            if ( !explainArr.includes( e ))  {
                explainArr.push( e );
            }
         });
        const allE = dimensionCountResponseDTOs
            .map( x => x.range ? x.range.rangeE : null )
            .filter( x => x !== undefined && x !== null )
            .sort(( x: any, y: any ) => y - x );
        const allS = dimensionCountResponseDTOs
            .map( x => x.range ? x.range.rangeS : null )
            .filter( x => x !== undefined && x !== null )
            .sort(( x: any, y: any ) => x - y );

        /** DISC 处理 */
        if ( psycapType === 'DISC' ) {
            DISCTotal = !totalDesc ?
                [ ] : 
                (totalDesc as any).split(',').map( s => [ s.split(':')[0], s.split(':') ][ 1 ])
        }

        // 需求变更，此处的max和min写死0-6
        this.base = {
            totalDesc,
            // max: 5,
            // min: 0,
            max: allE[ 0 ],
            min: allS[ 0 ],
            valueDesc,
            total: totalScore,
            title: templateName,
            DISCTotal,
            explain: explainArr.join(' '),
            time: '测评时间 ' + this.convertTime( answerTime )
        };

        /** SCL90问卷 处理 */
        if ( psycapType === 'SCL_90' ) {
            this.base = Object.assign(this.base, {max: 5,min: 0});
            this.SCL90 = true;
        }

        

        this.latitudes = dimensionCountResponseDTOs.map( x => ({
            label: x.dimensionName,
            total: x.totalScore,
            msg: x.valueDesc,
            explain: x.explain ?
                 x.explain.indexOf('小贴士') === -1 ?
                    `【定义】${x.explain}` :
                    x.explain :
                '',
        }));
         this.tableLatitudes = [{label: '总分', total: totalScore},{label: '总均分', total: totalAvg},{label: '阳性数目', total: crisisItemNum},{label:'阳性均分', total: crisisAvg},...this.latitudes];

        setTimeout(( ) => {
            this.drawPie('main');
        }, 400 );
    }

    /** 画图 */
    private drawPie( id ) {
        this.charts = echarts.init( document.getElementById( id ));
        this.charts.setOption( this.chartesOptions$ )
    }

    /** 时间转换 */
    private convertTime( ts ) {
        const time = new Date( Number( ts ));
        const y = time.getFullYear( );
        const m = time.getMonth( ) + 1;
        const d = time.getDate( );
        const h = time.getHours( );
        const mm = time.getMinutes( );

        const fixZero = n => {
            return `${ String( n ).length === 1 ? '0' + n : n}`
        };

        return `${ fixZero( y )}年${ fixZero( m )}月${ fixZero( d )}日 ${ fixZero( h )}:${ fixZero( mm )}`
    }

    // 转换附件id为图片地址
    private coverImg( accessoryId ) {
        const tanentId = 'c69e6168-d231-4e2a-b0e1-580263f3f77b';
        if ( accessoryId === 'accessoryId' || !accessoryId ) {
            return `data:image/png;base64,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`
        }
        return `https://itapis.cvte.com/cfile/${tanentId}/v1/download/${accessoryId}`;
    }

    /** 判断是否来自于问答宝 */
    private judgeWdb( ) {
        const { wdb } = this.$route.query;
        if ( !!wdb && Number( wdb )) {
            this.hasHistoryListener = true;
            (history as any).pushState( null, undefined, location.href );
            window.addEventListener('popstate', this.backHall );
        }
    }

    /** 返回到问卷大厅 */
    private backHall( ) {
        this.$router.replace('/e/hall?tab=0')
    }

    mounted( ) {
        const { code, tid, id, hid, c } = this.$route.query;
        this.judgeWdb( );
        this.fetchDetail( tid );
        this.fetchHistory( code );
        this.fetchQuestionUrl( tid );
        this.fetchDetail2( c || hid );
    }

    destroyed( ) {
        if ( this.hasHistoryListener ) {
             window.removeEventListener('popstate', this.backHall );
        }
    }

}
</script>
<style lang="less">
@import './index.less';
</style>