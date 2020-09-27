<template>
    <window-title
        name="日常分析报告"
    >
        <skt-list
            type="new"
            :loading="loading"
        >
            <div class="p-bodysign-record">
                
                <div class="big-title">
                    <svg class="my-icon" aria-hidden="true">
                        <use xlink:href="#icon--qizhi"></use>
                    </svg>日常报告分析
                </div>

                <div class="time-block">
                    <div>
                        {{ time.start }} ~ {{ time.end }}
                    </div>
                    <div>
                        您在这{{ time.dalta !== undefined && time.dalta !== null ? time.dalta : '-'}}天里：
                    </div>
                </div>

                <div
                    :key="k"
                    class="analys-block"
                    v-for="(item, k) in list"
                >

                    <div class="analys-title-block">
                        <div class="title-line"></div>
                        <div class="analys-title">{{ item.title }}</div>
                        <div class="title-line"></div>
                    </div>

                    <div class="analys-content">
                        <svg class="my-icon biglittle mr" aria-hidden="true">
                            <use xlink:href="#icon-81"></use>
                        </svg>指标达成率：<div class="green">{{ item.rate !== undefined && item.rate !== null ? item.rate : '-'}} %</div>
                    </div>

                    <div class="analys-content">
                        <svg class="my-icon biglittle mr" aria-hidden="true">
                            <use xlink:href="#icon-shuzishurukuang"></use>
                        </svg>总记录次数：<div class="green">{{ item.count !== undefined && item.count !== null ? item.count : '-'}} 次</div>
                    </div>

                    <div
                        class="analys-content"
                    >
                        <svg class="my-icon biglittle mr" aria-hidden="true">
                            <use xlink:href="#icon-tishi"></use>
                        </svg>温馨提示：
                    </div>

                    <div
                        class="analys-content text"
                    >
                        {{ item.desc || '暂无' }}
                    </div>

                    
                    <!-- echar饼图图表 -->
                    <div v-if="item.bingtuOpt" :id="`${item.signType}-bing`" style="height: 400px;"></div>

                    <!-- echar饼图图表 -->
                    <div  v-if="item.xiantuOpt" :id="`${item.signType}-xian`" style="height: 400px;"></div>

                </div>

                <div class="p-xueya-btn-block">
                    <router-link 
                        class="input-btn ml"
                        to="/body-sign/consultation"
                    >
                        立刻咨询
                    </router-link>
                </div>

            </div>
        </skt-list>

        <img 
            :src="imgBase"
            v-if="imgBase"
            class="img-result"
        />
        
    </window-title>
</template>
<script lang="ts">
import axios from 'axios';
import echarts from 'echarts';
import html2canvas from 'html2canvas';
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import sktList from '../../../components/skeleton-list/index.vue';
import windowTitle from '../../../components/window-title/index.vue';

const categoryId = "hms_category_id";
const tanentId = "c69e6168-d231-4e2a-b0e1-580263f3f77b";

@inject({
    selector: ['account$']
})
@Component({
    components: {
        sktList,
        windowTitle
    }
})
export default class P extends Vue {

    /** 图片截图 */
    private imgBase = null;

    /** 图片上传分类ID */
    private categoryId = categoryId;

    /** 图片上传地址 */
    private uploadUrl = `https://itapis.cvte.com/cfile/${tanentId}/v1/upload`;

    /** 报告列表 */
    private list = [ ];

    /** 时间 */ 
    private time = {
        start: '',
        end: '',
        dalta: 0
    };

    /** iac的值 */
    private iac = '';

    /** 类型对应中文 */
    private mapTypeToTitle = {
        '1': '血压',
        '2': '空腹血糖',
        '3': '餐前血糖',
        '4': '餐后血糖',
        '5': '随机血糖',
        '6': '体重',
        '7': '运动'
    }

    /**  load */
    private loading = true;

    /** 监听 */
    private watchMobx( ) {
        observe( this.account$.wx, 'systemUser', change => {
            this.fetchData( );
        });
        !!this.account$.wx.systemUser.id && this.fetchData( );
    }

    /** 拉取报告 */
    private fetchData( ) {

        const { end, start } = this.$route.query;
        const { id } = this.account$.wx.systemUser;

        if ( !id ) { return; }

        if ( !end || !start ) {
            return this.$toast.error('路径错误：缺乏时间参数')
        }
        this.loading = true;

        this.http$.get< any >({
            url: `/api/body-sign/report?userId=${id}&endTime=${end}&startTime=${start}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.loading = false;

            const list = data.map( meta => {
                const { signType, reachRate, reachRateDesc,
                    recordCount, signDataResponse, stateCountResponse } = meta;

                const title = this.mapTypeToTitle[ String( signType )];
                const rate = reachRate;
                const count = recordCount;
                const desc = reachRateDesc;

                const bingtuOpt = Array.isArray( stateCountResponse ) && stateCountResponse.length > 0 ? {
                    title: {
                        text: `${title}结果分布：`
                    },
                    legend: {
                        bottom: 'bottom',
                        data: stateCountResponse.map( x => x.stateName )
                    },
                    series: [
                        {
                            name: '结果分布',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data: stateCountResponse.map( x => ({
                                value: x.count,
                                name: x.stateName
                            })).sort( function( a, b ) { return a.value - b.value; }),
                            roseType: 'radius',
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function ( idx ) {
                                return Math.random( ) * 200;
                            }
                        }
                    ],
                    color: ['#ee6f2d','#81aa55', '#f5222d', '#fa8c16', '#fadb14', '#faad14', '#eb2f96', '#722ed1', '#2f54eb', '#cf1322', '#d4380d']
                } : null;

                const coverTime = ts => {
                    const time = new Date( Number( ts ));
                    return `${time.getMonth( ) + 1}-${time.getDate( )}`
                }

                const xiantuOpt = !!signDataResponse && !!signDataResponse.data ? {
                    title: {
                         text: `${title}结果分布：`
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        bottom: 'bottom',
                        data: Object.keys( (signDataResponse as any).data)
                    },
                    xAxis: {
                        type: 'category',
                        data: ( signDataResponse as any).categories.map( item => {
                            return coverTime( item.timestamp )
                        })
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: Object.keys(( signDataResponse as any).data ).map( name => ({
                        name,
                        type: 'line',
                        data: (signDataResponse as any).data[ name ].map( xx => xx || null )
                    }))
                } : null;

                return {
                    rate,
                    desc,
                    title,
                    count,
                    xiantuOpt,
                    bingtuOpt,
                    signType
                };

            });

            this.list = list;
            setTimeout(( ) => {
                this.drawPie( );
            }, 500 );
        })
    }

    /** 拉取iac */
    private fetchIac( ) {
        axios({
            url: `/api/common/iac`
        }).then( req => {
            this.iac = req.data;
        });
    }

    /** 上传图片 */
    private uploadedImg( base64String ) {

        const bytes = window.atob( base64String.split(',')[ 1 ]);
        const ab = new ArrayBuffer( bytes.length );
        const ia = new Uint8Array( ab );
        for(let i = 0; i < bytes.length; i++ ){
            ia[ i ] = bytes.charCodeAt( i ); 
        }

        var blob = new Blob([ ab ], {type: 'image/jpeg'});
        var fd = new FormData( );

        fd.append('file', blob, Date.now( ) + '.jpg');
        fd.append(`categoryId`, 'hms_category_id');

        /** 正式上传 */
        axios({
            method: 'post',
            data: fd,
            url: this.uploadUrl,
            headers: {
                'x-iac-token': this.iac,
                'Content-Type': 'multipart/form-data'
            }
        }).then( Res => {
            const req = Res.data;

            if ( !!req && ( req.status === '0' || req.status === 200 )) {

                const file = this.convert( req );
                this.uploadReport({
                    imgUrl: file,
                    fileId: req.data.result.fileId
                });

            } else {
                this.$toast.error( req.message );
            }
        }).catch( e => {
            this.$toast.error( '上传报告失败,' );
        })
    }

    /** 上传报告 */
    private uploadReport( fileMsg ) {
        const { start, end } = this.$route.query;
        const data = {
            endTime: end,
            imgId: fileMsg.fileId,
            startTime: start,
            analysisSign: (this.list as any).map( x => x.signType ).join(',')
        };
        this.http$.post({
            data,
            url: `/api/body-sign/report-save`
        });
    }

    /** 图片下载地址转换 */
    private convert(req) {
        const downBaseUrl = `https://itapis.cvte.com/cfile/${tanentId}/v1/download/`;
        return req.status === "0" ? `${downBaseUrl}${req.data.result.fileId}` : "";
    }

    /** 画echart图 */
    private drawPie( ) {
        const { list } = this;
        this.list.map(( meta: any)  => {
            if ( !!meta.bingtuOpt ) {
                const charts1 = echarts.init( document.getElementById( `${meta.signType}-bing` ));
                charts1.setOption( meta.bingtuOpt )
            }
            if ( !!meta.xiantuOpt ) {
                const charts2 = echarts.init( document.getElementById( `${meta.signType}-xian` ));
                charts2.setOption( meta.xiantuOpt )
            }
        });
        setTimeout(( ) => {
            if ( this.list.length > 0 ) {
                this.getImg( );
            }
        }, 1000 );
    }

    /** 生成图片 */
    private getImg( ) {
        const that = this;
        html2canvas( (document as any).querySelector('.p-bodysign-record')).then(function(canvas) {
            const base64String = canvas.toDataURL("image/png");
            // that.imgBase = base64String;
            that.uploadedImg( base64String );
        });
    }

    /** 初始化时间 */
    private initTime( ) {
        const { start, end } = this.$route.query;
        const converTime = ( ts ) => {
            const time = new Date( Number( ts ));
            const y = time.getFullYear( );
            const m = time.getMonth( ) + 1;
            const d = time.getDate( );
            const fix = s => `${String( s ).length === 1 ? '0' + s : s}`;
            return `${fix( y )}-${fix( m )}-${fix( d )}`;
        };
        this.time = {
            start: converTime( start ),
            end: converTime( end ),
            dalta: Math.ceil(((Number( end ) - Number( start ))) / ( 24 * 60 * 60 * 1000 ))
        }
    }

    mounted( ) {
        this.fetchIac( ); 
        this.watchMobx( );
        this.initTime( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
