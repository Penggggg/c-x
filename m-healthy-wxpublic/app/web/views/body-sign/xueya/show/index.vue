<template>
    <window-title name="血压" >
        <div class="p-xueya">

            <!-- 头部切换血糖、血压 -->
            <div class="header-tap">
                <div class="tab active">
                    血压
                </div>
                <div
                    class="tab"
                    @click="goXuetang"
                >
                    血糖
                </div>
            </div>

            <div class="p-xueya-content">
                
                <!-- 头部按钮、数据纵览 -->
                <div class="header-block">

                    <text-switch
                        :options="dateOptions"
                        :value.sync="dateValue"
                    />

                    <!-- 版本1 -->
                    <!-- <div class="data-total">
                        <div class="data-text">
                            收缩压：<div class="data-text-green">{{ decorateText( overview.systolic )}}</div>
                        </div>
                        <div class="data-text">
                            舒张压：<div class="data-text-green">{{ decorateText( overview.diastolic )}}</div>
                        </div>
                    </div> -->

                    <div class="data-total">
                        <mu-radio
                            label="图标"
                            :value="true"
                            v-model="isShowPic"
                            style="margin-right: 16px;" 
                        />
                        <mu-radio
                            label="列表"
                            :value="false"
                            v-model="isShowPic"
                        />
                    </div>
                </div>

                <!-- echart图表 -->
                <div 
                    id="main"
                    style="height: 400px;"
                    class="echart-container"
                    v-if="isShowPic"
                ></div>

                <!-- 表格 -->
                <div
                    v-else
                >
                    <div class="table-container">
                        <table class="data-table">
                            <tr
                                :key="k"
                                v-for="(line, k) in tableMeta"
                            >
                                <th
                                    :key="kk"
                                    v-if="k === 0"
                                    v-for="(header, kk) in line"
                                >
                                    {{ typeof header === 'string' ? header : '' }}
                                    <div
                                        v-if="typeof header !== 'string'"
                                    >
                                        <div
                                            :key="kkk"
                                            v-for="(s, kkk) in header"
                                        >
                                            {{ s }}
                                        </div>
                                    </div>
                                </th>
                                <td
                                    :key="kk"
                                    v-if="k !== 0"
                                    v-for="(item, kk) in line"
                                    :class="{ header: kk === 0 }"
                                    :style="{ color: typeof item !== 'string' && item.c ? item.c : '#666' }"
                                >
                                    {{ typeof item === 'string' ? item : item.v }}
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                </div>

                <!-- 标题 -->
                <div class="title-block">
                    最近<div class="title-green">{{ dateValue === 'week' ? '一周' : '一个月' }}</div>血压数据统计
                </div>
                <div class="title-block small">
                    (血压:mmHg | 心率:次/分钟)
                </div>

                <!-- 表格组 -->
                <div class="table-group">

                    <!-- 表格组：收缩压 -->
                    <div class="table-group-title">
                        收缩压
                    </div>
                    <div class="table-group-item-block">
                        <div class="table-item">
                            <div class="table-item-label">峰值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.systolic.maxValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">谷值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.systolic.minValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">平均值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.systolic.avgValue )}}
                            </div>
                        </div>
                    </div>

                    <!-- 表格组：舒张压 -->
                    <div class="table-group-title">
                        舒张压
                    </div>
                    <div class="table-group-item-block">
                        <div class="table-item">
                            <div class="table-item-label">峰值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.diastolic.maxValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">谷值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.diastolic.minValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">平均值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.diastolic.avgValue )}}
                            </div>
                        </div>
                    </div>

                    <!-- 表格组：心率 -->
                    <div class="table-group-title">
                        脉率
                    </div>
                    <div class="table-group-item-block">
                        <div class="table-item">
                            <div class="table-item-label">峰值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.heartRate.maxValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">谷值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.heartRate.minValue )}}
                            </div>
                        </div>
                        <div class="table-item">
                            <div class="table-item-label">平均值</div>
                            <div class="table-item-value">
                                {{ decorateText( summary.heartRate.avgValue )}}
                            </div>
                        </div>
                    </div>

                </div>


            </div>

            <div
                class="p-xueya-btn-block"
                v-if="!$route.query.u"
            >
                <router-link 
                    class="input-btn"
                    to="/body-sign/xueya-input"
                >
                    记录数据
                </router-link>
                <router-link 
                    class="input-btn invert ml"
                    to="/body-sign/consultation"
                >
                    立刻咨询
                </router-link>
            </div>

        </div>
    </window-title>
</template>
<script lang="ts">
import echarts from 'echarts';
import { observe, toJS } from 'mobx';
import { inject } from '../../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../../components/window-title/index.vue';
import textSwitch from '../../../../components/text-switch/index.vue';

/**
 * !收缩压是高压 systolic
 * !舒张压是低压 diastolic
 */
@inject({ 
    selector: ['account$']
})
@Component({
    components: {
        textSwitch,
        windowTitle
    }
})
export default class P extends Vue {

    /** 提高query传进来的uid */
    private queryUid = '';

    /** load */
    private loading = true;

    /** 是展示图、还是表格 */
    private isShowPic = true;

    /** 数据总揽 */
    private overview = {
        systolic: 0,
        diastolic: 0
    };

    /** 数据统计 */
    private summary = {
        systolic: {
            minValue: 0,
            maxValue: 0,
            avgValue: 0
        },
        diastolic: {
            minValue: 0,
            maxValue: 0,
            avgValue: 0
        },
        heartRate: {
            minValue: 0,
            maxValue: 0,
            avgValue: 0
        }
    }

    /** 当前的sourceCode */
    private sourceCode!: string;

    /** charts */
    private charts: any = null;

    /** 图表基础数据 */
    private meta: any = null;

    /** 表格数据 */
    private tableMeta: any = [ ];

    /** charts选项 */
    private chartesOptions: any = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            bottom: 'bottom',
            data:['收缩压','舒张压']
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '收缩压',
            data: [ ],
            type: 'line'
        },{
            name: '舒张压',
            data: [ ],
            type: 'line'
        }],
        color: ['#1585ff','#2aba51']
    }

    /** 周、月选项值 */
    private dateValue = 'week';

    /** 周、月选项 */
    private dateOptions: C.TextSwitch.options = [
        {
            value: 'week',
            label: '周'
        }, {
            value: 'month',
            label: '月'
        }
    ];

    /** 监听周/月变化 */
    @Watch('dateValue')
    onDateChange( ) {
        this.fetchData( );
    }

    /** 监听图表、列表问题 */
    @Watch('isShowPic')
    onShow( val ) {
        if ( !!val ) {
            setTimeout(( ) => {
                this.drawPie('main');
            }, 20 );
        }
    }

    /** 监听meta数据，绘制表格的数据 */
    @Watch('meta')
    onMeta( val ) {

        const temp: any = [ ];
        const { categories, data2 } = val;

        const dateArr: any = [ ];
        const timeArr: any = [ ];

        categories.map( x => {
            const [ dateMeta, timeMeta ] = x.datetime.split(' ');
            const date = dateMeta.replace(/\-/g, '/');
            timeArr.push( timeMeta );
            dateArr.push([
                date.split('/')[ 0 ],
                `${date.split('/')[ 1 ]}/${date.split('/')[ 2 ]}`
            ])
        });

        const tableMeta = [
            [
                '日期',
                ...dateArr
            ], [
                '时间',
                ...timeArr
            ]
        ];

        Object.keys( data2 )
            .filter( key => key !== '心率' )
            .map( key => {
                const arr: any = [{
                    v: key
                }];
                data2[ key ].map( x => {
                    arr.push({
                        v: String( x.value ),
                        c: String( x.color ).indexOf('#') === 0 ? x.color : null
                    })
                }) 
                tableMeta.push( arr );
            });

        this.tableMeta = tableMeta;
    }

    /** 监听 */
    private watchMobx( ) {
        const { queryUid } = this;
        if ( !queryUid ) {
            observe( this.account$.wx, 'systemUser', change => {
                this.fetchData( );
            });
            !!this.account$.wx.systemUser.id && this.fetchData( );
        } else {
            this.fetchData( );
        }
    }

    /**  */
    private decorateText( val ) {
        return val !== undefined && val !== null ? val : '-';
    }

    /** 返回本月、本周的时间戳 */
    private getTime( type: string ) {

        const oneDay = 24 * 60 * 60 * 1000;
        const endTime = new Date( ).getTime( );

        return {
            endTime,
            startTime: type === 'week' ? 
                new Date( endTime - 7 * oneDay ).getTime( ) :
                new Date( endTime - 30 * oneDay ).getTime( )
        }
    }

    /** 获取数据 */
    private fetchData( uid?: string ) {

        const { dateValue, sourceCode } = this;
        let userId = this.queryUid || this.account$.wx.systemUser.id;

        if ( !userId ) { return; }

        this.loading = true;

        const { endTime, startTime } = this.getTime( dateValue );

        const data = {
            userId,
            endTime,
            startTime,
            // sourceId: sourceCode
        };

        this.http$.get< any >({
            query: data,
            url: `/api/body-sign/xueya-data?userId=${data.userId}&endTime=${data.endTime}&startTime=${data.startTime}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;

            if ( status !== 200 ) { return; }
            
            const chartsData = data.data;
            const { countDataList, categories } = data;
            const { systolic, diastolic } = data.lastSign;

            this.meta = data;

            /** 总览 */
            this.overview = {
                systolic,
                diastolic
            };

            /** 数据统计 */
            const systolicTarget = countDataList.find( x => x.typeCode === 'systolic');
            const diastolicTarget = countDataList.find( x => x.typeCode === 'diastolic');
            const heartRateTarget = countDataList.find( x => x.typeCode === 'heartRate');

            this.summary = {
                systolic: systolicTarget,
                diastolic: diastolicTarget,
                heartRate: heartRateTarget
            }

            /** 
             * 版本1
             * 图标选项
            */
            // const xAxis = {
            //     type: 'category',
            //     data: categories.map( x => {
            //         const time = new Date( x.timestamp );
            //         const m = time.getMonth( ) + 1;
            //         const d = time.getDate( );
            //         return `${m}-${d}`;
            //     })
            // };

            /** 
             * 版本1
             * 图标选项
            */
            // const series = Object.keys( chartsData )
            //     .filter( name => name !== '心率' )
            //     .map( name => {
            //         return {
            //             name,
            //             type: 'line',
            //             data: chartsData[ name ].map( x => x || null )
            //         }
            //     });

            /**
             * 版本2
             * 图标选项
             */
            const xAxis =  [
                {
                    type : 'time',
                    splitNumber: 4
                }
            ];

            const series = Object.keys( chartsData )
                .filter( name => name !== '心率' )
                .map( name => {
                    return {
                        name,
                        type: 'line',
                        showAllSymbol: true,
                        symbolSize: function (value){
                            return Math.round(value[2]/10) + 2;
                        },
                        data: categories.map(( c, k ) => [
                            new Date( c.timestamp ),
                            chartsData[ name ][ k ],
                            Number(( Math.random( ) * 100).toFixed( 2 )) - 0
                        ])
                    }
                });

            this.chartesOptions = Object.assign({ }, this.chartesOptions, {
                xAxis,
                series
            });

            this.loading = false;

            setTimeout(( ) => {
                this.drawPie('main');
            }, 16 );

        })

    }

    /** 画图 */
    private drawPie( id ) {
        const ele = document.getElementById( id );
        this.charts = echarts.init( ele );
        this.charts.setOption( this.chartesOptions )
    }

    /** 跳到血糖页面 */
    private goXuetang( ) {
        this.$router.replace('/body-sign/xuetang-show')
    }

    mounted( ) {

        this.queryUid = this.$route.query.u;

        setTimeout(( ) => {
            this.fetchData( );
            this.watchMobx( );
            this.drawPie('main');
        }, 20 );
        
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

