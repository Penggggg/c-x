<template>
    <div class="con-booking-record-bodycheck">
        <skt-list
            :loading="loading"
        >
            <div class="container-block">
                <!-- 预约记录列表 -->
                <ul class="record-list">
                    <li
                        :key="k"
                        v-for="(record, k) in recordList"
                    >
                        <div class="header inline-container">
                            <span>
                                {{ record.place }}
                            </span>
                            <span :class="{ active: record.canCancel }">
                                {{
                                    record.status === 'done' ? '' :
                                        record.status === 'ing' ? '进行中' :
                                        record.status === 'cancel' ? '已取消' :
                                            ''
                                }}
                            </span>
                        </div>
                        <div class="content">
                            <div class="inline-container small">
                                <div class="big">
                                    {{ record.time }}
                                </div>
                                <div>
                                    {{ dic.HMS_CLINIC_TYPE.find( x => x.value === record.stage) ? dic.HMS_CLINIC_TYPE.find( x => x.value == record.stage).label : '' }}/{{ record.department }}
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    <span class="big">{{ record.name }}</span> ( {{ record.sex }} {{ record.age }})
                                </div>
                            </div>
                            <div class="inline-container small">
                                <div>
                                    病情描述：{{ record.desc }}
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
                            v-if="record.canCancel"
                        >
                            取消预约
                        </div>
                    </li>
                </ul> 
                <p class="tips">
                    <span>
                        {{
                            recordList.length !== 0 ?
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

        <!-- 输入好取消预约的原因 -->


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
        HMS_CLINIC_CANCEL_REASON: [ ],
        HMS_CLINIC_TYPE: [ ]
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

    /** 加载中 */
    private loading = true;

    /** 记录列表 */
    private recordList: App.bodyCheckRecord = [ ];

    @Watch('$route', { deep: true })
    onRoute( route ) {
        const { tab } = route.query;
        if ( Number( tab ) === 1 ) {
            this.fetchRecord( );
        }
    }

    /** 取消预约 */
    private cancel( ) {
        const { result, data } = (this.$refs.form as any).getData( );
        if ( !result ) {
            return this.$toast.error('请填写取消原因');
        }
        const reqData = {
            cancelReason: data.reason,
            reservationId: this.selectingId,
            shopId: ( this.recordList.find( x => x.id === this.selectingId ) as any ).shopId
        }

        this.http$.put<normalResult<any>>({
            data: reqData,
            url: `/api/booking/clinic/cancel`
        }, {
            successMsg: '取消成功',
            loadMsg: '取消中...'
        }).then( res => {
            const { status } = res;
            if ( status === 200 ) {
                this.fetchRecord( );
                this.showDialog = false;
                ( this.$refs.form as any ).reset( );
            }
        })
    }

    /** 拉取记录 */
    private fetchRecord( ) {
        this.http$.get<Api.get.bookingRecord>({
            url: `/api/booking/clinic`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            this.loading = false;
            const now = (new Date( )).getTime( );
            this.recordList = data.map( x => {
                return {
                    id: x.id,
                    stage: x.reservationType,
                    place: x.shopName,
                    time: x.reservationTime,
                    department: x.department,
                    status: x.cancelReason ?
                                'cancel' :
                                now <= (new Date( x.reservationTime.replace(/-/g, "/"))).getTime( ) ?
                                'ing' :
                                'done'
                    ,
                    name: x.name,
                    sex: x.sex,
                    age: x.age,
                    shopId: x.shopId,
                    desc: x.reservationContent,
                    cancelReason: x.cancelReason,
                    canCancel: now <= (new Date( x.reservationTime.replace(/-/g, "/"))).getTime( ) && !x.cancelReason,
                }
            });
            (document as any).documentElement.scrollTop = (document as any).body.scrollTop = 0;
        });
    
    }

    /** 取消预约 */
    private cancelConfirm( id ) {

        this.selectingId = id;
        this.showDialog = true;

    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_CLINIC_CANCEL_REASON,HMS_CLINIC_TYPE`
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
                })),
                HMS_CLINIC_TYPE: data.HMS_CLINIC_TYPE.map( x => ({
                    label: x.name,
                    value: x.itemValue
                }))
            })
        });
    }

    mounted( ) {
        this.fetchDic( );
        this.fetchRecord( );
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
