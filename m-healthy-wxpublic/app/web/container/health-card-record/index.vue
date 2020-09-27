<template>
    <div class="con-health-card-record">
        <skt-list
            :loading="loading"
        >
            <div class="container-block">
                <!-- 预约记录列表 -->
                <ul class="record-list">
                    <li
                        :key="k"
                        v-for="(record, k) in list"
                    >
                        <div class="header inline-container">
                            <span class="big">
                                健康体检
                            </span>
                            <span :class="{ active: record.state === '2' }">
                                {{
                                    record.state === '1' ? '待确认' :
                                        record.state === '2' ? '已预约' :
                                        record.state === '3' ? '已取消' :
                                            ''
                                }}
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container">
                                <div class="">
                                    {{ record.cardTemplateName }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    体检人：{{ record.userName }} 
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    预约体检时间：{{ new Date( record.appointmentTime ).toLocaleDateString( )}}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    体检地点：{{ record.medicalSiteName }}
                                </div>
                            </div>
                             <div class="inline-container small" v-if="record.cancelReason">
                                <div>
                                    取消原因：{{ record.cancelReason }}
                                </div>
                            </div>
                        </div>
                        <div
                            class="btn"
                            @click="cancelConfirm(record.id)"
                            v-if="
                                ( record.state === '1' && new Date( ).getTime( ) - new Date( record.appointmentTime ).getTime( ) < 0 ) ||
                                ( record.state === '2' && new Date( ).getTime( ) - new Date( record.appointmentTime ).getTime( ) < 0 ) "
                        >
                            取消预约
                        </div>
                    </li>
                </ul> 
                <p class="tips">
                    <span>
                        {{
                            list.length !== 0 ?
                                '没有更多数据了' :
                                '空空如也'
                        }}
                    </span>
                </p>
            </div>
        </skt-list>

         <!-- 删除确认 -->
        <mu-dialog title="提示" class="booking-list-dialog" width="360" :open.sync="showDialog">
            确认取消该预约吗?
            <my-form
                ref="form"
                :meta="meta"
            />
            <mu-button
                flat
                slot="actions"
                color="primary"
                @click="cancel"
            >
                确认
            </mu-button>
            <mu-button
                flat
                slot="actions"
                color="error"
                @click="showDialog=false"
            >
                取消
            </mu-button>
        </mu-dialog>

        <!-- 24小时提醒 -->
        <mu-dialog title="提示" width="360" :open.sync="openTiShi">
            <p>体检开始前24小时内无法取消</p>
            <p>请联系客户 <a href="tel:400-020-666">400-020-666</a></p>
            <mu-button slot="actions" flat color="primary" @click="openTiShi=false">好的</mu-button>
        </mu-dialog>

    </div>
</template>
<script lang="ts">
import { inject } from '../../service/inject';
import MyForm from '../../components/my-form-v2/index.vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SktList from '../../components/skeleton-list/index.vue';

/**
 * @description 体检预约记录
 */
@inject({  })
@Component({
    components: {
        MyForm,
        SktList
    }
})
export default class BookingRecordBodyCheck extends Vue {

    /**
     * ! 列表stae 1 是待确认； 2：已预约； 3：已取消
     */

    /** 当前选中的预约ID */
    private selectingId = '';

    /** 取消预约的原因 */
    private reason = '';

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        HMS_CLINIC_CANCEL_REASON: [ ]
    };

    /** form */
    get meta( ): C.MyForm.meta {
        return [
            [
                {
                    key: 'reason',
                    type: 'select',
                    label: '取消原因',
                    options: this.dic.HMS_CLINIC_CANCEL_REASON,
                    rules: [{
                        validate: val => !!val,
                        message: '请选择取消原因'
                    }]
                }
            ]
        ]
    } 

    /** 对话框 */
    private showDialog = false;

    /** 提示 */
    private openTiShi = false;

    /** 加载中 */
    private loading = true;

    /** 健康卡预约列表 */
    private list: App.healthCardRecord[ ] = [ ];

    @Watch('$route', { deep: true })
    onRoute( route ) {
        const { tab } = route.query;
        if ( Number( tab ) === 1 ) {
            this.fetchData2( );
        }
    }

    /** 取消预约 */
    private cancel( ) {

        const { result, data } = (this.$refs.form as any).getData( );
        if ( !result ) {
            return this.$toast.error('请填写取消原因');
        }
        const reqData = {
            id: this.selectingId,
            cancelReason: data.reason,
        }

        this.http$.post<normalResult<any>>({
            data: reqData,
            url: `/api/booking/health-card/cancel`
        }, {
            successMsg: '取消成功',
            loadMsg: '取消中...'
        }).then( res => {
            const { status } = res;
            if ( status === 200 ) {
                this.fetchData2( );
                this.showDialog = false;
                ( this.$refs.form as any ).reset( );
            }
        })
    }

    /** 拉取 */
    private fetchData2( ) {
        this.http$.get<Api.get.healthCardRecordList>({
            url: `/api/booking/health-card/record`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.list = data;
            this.loading = false;
        })
    }

    /** 取消预约 */
    private cancelConfirm( id ) {

        this.selectingId = id;
        // 24小时内的提示
        const target = this.list.find( x => x.id === id );
        if ( target ) {
            if ((( target.appointmentTime - new Date( ).getTime( )) <= 24 * 60 * 60 * 1000 ) && target.state === '2' ) {
                return this.openTiShi = true;
            }
            this.showDialog = true;
        }
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_CLINIC_CANCEL_REASON`
        }, {
            errMsg: '加载错误',
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.dic = Object.assign({ }, this.dic, {
                HMS_CLINIC_CANCEL_REASON: data.HMS_CLINIC_CANCEL_REASON.map( x => ({
                    label: x.name,
                    value: x.itemValue
                }))
            })
        });
    }

    mounted( ) {
        this.fetchData2( );
        this.fetchDic( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
