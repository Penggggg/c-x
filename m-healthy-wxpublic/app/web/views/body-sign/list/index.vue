<template>
    <window-title name="我的体征" >
        <div>
            <skt-list
                type="new"
                :loading="loading"
            >
                <div class="p-bodysign-list">

                    <div class="entry-list">
                        <div
                            :key="j"
                            class="entry-item"
                            @click="go( item )"
                            v-for="(item, j) in list$"
                        >

                            <div class="item-icon">

                                <svg
                                    v-if="!item.img"
                                    aria-hidden="true"
                                    class="my-icon big"
                                >
                                    <use :xlink:href="item.icon"></use>
                                </svg>

                                <img
                                    v-if="item.img"
                                    :src="item.img"
                                    class="icon-img"
                                />

                                <div class="item-title">{{ item.title }}</div>

                            </div>

                            <div class="item-info">

                                <div class="item-main-data">
                                    {{ item.data }}
                                    <div class="item-unit">
                                        {{ item.unit }}
                                    </div>
                                </div>

                                <div class="item-main-tips">
                                    {{ item.tips }}
                                </div>

                            </div>

                            <div class="item-time-block disabled">

                                <div
                                    class="item-status"
                                    v-if="item.signStatus.statusName"
                                    :style="{ background: item.signStatus.rgbColor || '#19b391' }"
                                >
                                    {{ item.signStatus.statusName }}
                                </div>

                                <div v-if="item.time">
                                    {{ item.time }}
                                </div>

                                <div v-else>马上记录</div>

                            </div>

                            <div class="item-entry-icon">
                                <mu-icon
                                    size="25"
                                    color="rgba( 0, 0,0, 0.3 )"
                                    value="keyboard_arrow_right"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </skt-list>
            <div class="pbl-btn-block">
                <div
                    class="my-btn"
                    @click="goBind"
                >
                    <div>设备</div>
                    <div>绑定</div>
                </div>
                <div
                    class="my-btn"
                    @click="goInvite"
                    v-if="userBindList.length!==0"
                >
                    <div>邀请</div>
                    <div>关注</div>
                </div>
            </div>
        </div>
    </window-title>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import sktList from '../../../components/skeleton-list/index.vue';
import windowTitle from '../../../components/window-title/index.vue';

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

    /** 列表数据 */
    private data = {
        xueya: {
            heartRate: 0,
            systolic: 0,
            diastolic: 0,
            checkDate: null,
            signStatus: {
                rgbColor: null,
                statusName: null
            }
        },
        xuetang: {
            glucose: 0,
            glucosePeriod: null,
            checkDate: null,
            signStatus: {
                rgbColor: null,
                statusName: null
            }
        }
    };

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        'HMS_SIGN_SUGAR_TYPE': [ ]
    }

    /** 绑定设备数量 */
    private bindList = [];

    /** 用户绑定全部设备 */
    private userBindList = [];

    /** load  */
    private loading = true;

    /** 设备列表 */
    private sourceList: {
        icon: string
        label: string,
        value: string,
        isBound: boolean
    }[ ] = [ ];

    /** 列表数据 */
    get list$( ) {
        const { dic } = this;
        const { xueya, xuetang } = this.data;

        const converTime = ts => {

            if ( !ts ) { return ''}

            const theTime = Number( ts );
            const time = new Date( ).getTime( );

            if (( time - theTime ) < 60 * 60 * 1000 ) {
                return `${Math.ceil( ( time - theTime ) / (60 * 1000))}分钟之前`
            } else {
                return `${Math.ceil( ( time - theTime ) / (60 * 60 * 1000))}小时之前`
            }

        }

        return [
            {
                signStatus: xueya.signStatus,
                data: `${xueya.systolic !== undefined && xueya.systolic !== null ? xueya.systolic : '-'}/${xueya.diastolic !== undefined && xueya.diastolic !== null ? xueya.diastolic : '-'}`,
                time: converTime( xueya.checkDate ),
                tips: `心率${xueya.heartRate !== undefined && xueya.heartRate !== null ? xueya.heartRate : '-'}次/分钟`,
                unit: 'mmHg',
                title: '血压',
                icon: '#icon-xieya',
                img: '/public/img/icon-xueya.png',
                souceKey: '希科多体征',
                url: '/body-sign/xueya-show',
            }, {
                signStatus: xuetang.signStatus,
                title: '血糖',
                data: `${xuetang.glucose !== undefined && xuetang.glucose !== null ? xuetang.glucose : '-'}`,
                time: converTime( xuetang.checkDate ),
                tips: dic.HMS_SIGN_SUGAR_TYPE.find( x => x.value === xuetang.glucosePeriod ) ? 
                    (dic as any).HMS_SIGN_SUGAR_TYPE.find( x => x.value === xuetang.glucosePeriod ).label : '',
                unit: 'mmol/L',
                icon: '#icon-xietang',
                souceKey: '希科多体征',
                img: '/public/img/icon-xuetang.png',
                url: '/body-sign/xuetang-show',
            }
        ]
    };

    /** 监听 */
    private watchMobx( ) {
        observe( this.account$.wx, 'systemUser', change => {
            this.fetchListData( );
        });
        !!this.account$.wx.systemUser.id && this.fetchListData( );
    }

    /** 跳到不同模块 */
    private go( item ) {
        const target: any = this.sourceList.find( x => x.label.indexOf( item.souceKey ) !== -1 );

        this.$router.push(`${item.url}?sourceCode=${target ? target.value : ''}`);
    }

    /** 跳到绑定 */
    private goBind( ) {
        
        this.$router.push('/body-sign/bind');

    }

    /** 分析报告 */
    private goAnalys( ) {
        this.$router.push('/body-sign/analys-entry')
    }

    /** 邀请关注 */
    private goInvite( ) {
        this.$router.push('/body-sign/invite-follow?from=send')
    }

    /** 获取设备来源 */
    private fetchSource( ) {
        
        this.loading = true;
        this.http$.get< any >({
            url: `/api/body-sign/device-source?isDevice=1`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.sourceList = data.map( x => {
                return {
                    label: x.sourceName,
                    value: x.sourceCode,
                    isBound: x.isBindSource,
                    icon: '#icon-shebeidingzhigaizao'
                }
            });
            this.fetchHasBound( data.map( x => x.id ));
            console.log('我的设备',this.sourceList);
            this.loading = false;
        })
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        const dicType = 'HMS_SIGN_SUGAR_TYPE';
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=${dicType}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            Object.keys( data ).map( dicKey => {
                this.dic = Object.assign({ }, this.dic, {
                    [ dicKey ]: data[ dicKey ].map( x => ({
                        label: x.name,
                        value: x.itemValue
                    }))
                })
            });
        });
    }

    /** 获取血压数据 */
    private fetchXueya( data ) {

        this.http$.get< any >({
            url: `/api/body-sign/xueya-data?userId=${data.userId}&endTime=${data.endTime}&startTime=${data.startTime}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            const { systolic, diastolic, heartRate, checkDate } = data.lastSign;
            this.data = Object.assign({ }, this.data, {
                xueya: {
                    systolic,
                    diastolic,
                    heartRate,
                    checkDate
                }
            })
        });
    }

    /** 获取血糖 */
    private fetchXuetang( data ) {
        this.http$.get< any >({
            query: data,
            url: `/api/body-sign/xuetang-data?userId=${data.userId}&endTime=${data.endTime}&startTime=${data.startTime}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            const { glucose, glucosePeriod, checkDate } = data.lastSign;
            this.data = Object.assign({ }, this.data, {
                xuetang: {
                    glucose,
                    checkDate,
                    glucosePeriod
                }
            })
        });
    }

    /** 获取用户绑定设备 */
    private fetchBindDeviceByUser(  ) {
        this.http$.get< any >({
            url: `/api/body-sign/bound-devices`,
            params: {
                userId: '32c4d36904c8475f979b689f84fa1beb'
                // userId: this.account$.wx.systemUser.id
            }
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if(status !== 200) {
                return ;
            }
            this.userBindList = data;

        });
    }

    /** 获取提体征数据 */
    private fetchLastRecord( data ) {

        /** 血压 */
        this.http$.get< any >({
            url: `/api/body-sign/last_record?userId=${data.userId}&signType=bp`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            const { systolic, diastolic, heartRate, checkDate, signStatus } = data;
            this.data = Object.assign({ }, this.data, {
                xueya: {
                    systolic,
                    diastolic,
                    heartRate,
                    checkDate,
                    signStatus
                }
            })
        });

        /** 血糖 */
        this.http$.get< any >({
            url: `/api/body-sign/last_record?userId=${data.userId}&signType=bg`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            const { glucose, glucosePeriod, checkDate, signStatus } = data;
            this.data = Object.assign({ }, this.data, {
                xuetang: {
                    signStatus,
                    glucose,
                    checkDate,
                    glucosePeriod
                }
            })
        });
    }

    /** 获取已经绑定过的设备 */
    private fetchHasBound( scArr: string[ ]) {

        this.loading = true;

        Promise.all( scArr.map( sc => this.http$.get< any >({
            params: {
                sourceCode: sc,
                userId: this.account$.wx.systemUser.id
            },
            url: `/api/body-sign/bound-devices`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return null; }

            return data;

        }))).then( (res: any) => {
            if ( res.some( x => x === null )) {
                return this.$toast.error('用户绑定查询错误')
            }
            this.loading = false;
            this.bindList = res;
        });
    }

    /** 获取列表里面的数据 */
    private fetchListData( ) {
        const endTime = new Date( ).getTime( );
        const userId = this.account$.wx.systemUser.id;

        if ( !userId ) { return; }

        const startTime = endTime - 6 * 24 * 60 * 60 * 1000

        const data = {
            userId,
            endTime,
            startTime,
        };

        // this.fetchXueya( data );
        // this.fetchXuetang( data );
        this.fetchLastRecord( data );

    }

    mounted( ) {
        this.fetchDic( );
        this.fetchSource( );
        this.watchMobx( );
        this.fetchBindDeviceByUser();
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

