<template>
    <div class="p-booking-health-card">

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
                体检预约
            </span>
        </my-header>

        <div class="base-info">

            <!-- 基本表单 -->
            <my-form
                ref="form"
                :meta="formMeta"
                @change="onFormChange"
            >
                <mu-date-input
                    full-width
                    label-float
                    label="预约体检时间"
                    container="dialog"
                    v-model="formData.date"
                    :should-disable-date="disableDate"
                >
                    <template slot="day" slot-scope="{ selected, date, disabled, now }">
                        <div class="mu-day-button-bg"></div>
                        <div class="mu-day-button-content">
                            <span class="mu-day-button-text">
                                {{ date.getDate( )}}
                                <span
                                    class="date-tips"
                                    v-if="
                                        date.getTime( ) >= new Date( ).getTime( ) &&
                                        disabledTime.notAllow.find( x => new Date( x ).toLocaleDateString( ) === date.toLocaleDateString( ))"
                                >
                                    未开放
                                </span>
                                <span
                                    class="date-tips"
                                    v-if="
                                        date.getTime( ) >= new Date( ).getTime( ) &&
                                        disabledTime.hasBeenFull.find( x => new Date( x ).toLocaleDateString( ) === date.toLocaleDateString( ))"
                                >
                                    已满人
                                </span>
                            </span>
                        </div>
                    </template>
                </mu-date-input>
                <div class="multiinput-block">
                    <p class="small tips">
                        备注信息
                    </p>
                    <mu-text-field
                        :rows="3"
                        multi-line
                        :rows-max="6"
                        full-width
                        class="no-border"
                        placeholder="请录入病史或加项说明（1000字以内）"
                        v-model="formData.desc"
                    />
                </div>
            </my-form>

        </div>

        <!-- 体检人 -->
        <div class="Visiting-person-block">
            <div class="title">
                <div class="left">体检人</div>
                <div
                    class="right green"
                    @click="showSelector=true"
                >
                    {{ 
                        visitingMan.name ?
                            '更换体检人' :
                            '请选择体检人'
                    }}
                </div>
            </div>
            <div class="info" v-if="visitingMan.name">
                <div class="item">{{ visitingMan.name }}</div>
                <div class="item" v-if="dic.HMS_COMM_SEX2.find( x => x.value === visitingMan.sexCode )">
                    {{ dic.HMS_COMM_SEX2.find( x => x.value === visitingMan.sexCode ).label }}
                </div>
                <div class="item">{{ visitingMan.birthDate ? new Date( visitingMan.birthDate ).toLocaleDateString( ) : '' }}</div>
                <div class="item">{{ visitingMan.mobileNumber }}</div>
            </div>
        </div>

        <!-- 套餐 -->
        <div class="base-info package-block">

            <div class="title">
                <div class="left">体检项目</div>
            </div>

            <div class="radio-block" v-if="packages">
                <div
                    class="radio-item"
                    v-for="(item, k) in packages.packages" :key="k"
                >
                    <mu-radio
                        :value="item.packageId"
                        v-model="formData.packagee"
                    />
                    <div
                        class="content-block"
                        @click="choicePackge( item.packageId )"
                    >
                        <div class="main">
                            <div class="name">
                                {{ item.packageName }}
                            </div>
                            <div class="fan" v-if="!!item.gender || !!item.maxEnd || !!item.minAge">
                                适用范围：{{ dic.HMS_COMM_SEX2.find( x => x.value === item.gender ) ? 
                                                dic.HMS_COMM_SEX2.find( x => x.value === item.gender ).label :
                                                ''
                                        }}{{ item.gender ? '，': '' }}{{
                                            ( item.minAge !== null && item.minAge !== undefined ) && ( item.maxEnd !== null && item.maxEnd !== undefined ) ?
                                                `${item.minAge} ～ ${item.maxEnd}岁` :
                                                ( item.minAge !== null && item.minAge !== undefined ) && ( item.maxEnd === null || item.maxEnd === undefined ) ?
                                                    `${item.minAge}岁以上` :
                                                    ( item.minAge === null || item.minAge === undefined ) && ( item.maxEnd !== null && item.maxEnd !== undefined ) ?
                                                        `${item.minAge}岁以下` :
                                                    ''
                                        }}
                            </div>
                        </div>
                        <div class="price">
                            ¥{{ packages.cardPrice }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <div class="btn-block">
            <mu-button
                full-width
                color="#16c5b0"
                @click="onSubmit"
            >
                确定
            </mu-button>
        </div>

        <!-- 选择就诊人 -->
        <visiting-selector
            :show.sync="showSelector"
            @confirm="selectVisitor"
            :id="autoSelect ? account$.wx.systemUser.id : ''"
        />        

    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyHeader from '../../../components/my-header/index.vue';
import MyForm from '../../../components/my-form-v2/index.vue';
import VisitingSelector from '../../../container/visiting-man-selector/index.vue';
import { setTimeout } from 'timers';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyForm,
        MyHeader,
        VisitingSelector
    }
})
export default class BookingBodyCheck extends Vue {

    /** 卡详情 */
    private detail!: App.healthCardDetail;

    /** 就诊人信息 */
    private visitingMan: App.bodyCheckVisitor = { };

    /** 推荐套餐 */
    private packages: App.healthCardPackage | null = null;

    /** 展示就诊人选项 */
    private showSelector = false;

    /** 知否默认选择自己为就诊人 */
    private autoSelect = false;

    /** 数据字典 */
    private dic: {
        [ key: string ]: {
            label: string,
            value: string
        }[ ]
    } = {
        /** 性别 */
        HMS_COMM_SEX2: [ ],
        /** 诊所 */
        HMS_MEDICAL_SITE: [ ]
    };

    /** 表单数据 */
    private formData: {
        desc: string,
        userid: string
        medicalSite?: string
        date?: Date,
        packagee?: string
    } = {
        desc: '',
        medicalSite: undefined,
        date: undefined,
        userid: '',
        packagee: undefined
    }

    /** 禁止点击的时间 */
    private disabledTime: {
        [ key: string ]: number[ ]
    } = { 
        notAllow: [ ],
        hasBeenFull: [ ]
    };

    /** 当前日历 */
    private rili = {
        year: 0,
        month: 0,
    }

    /** 表单 */
    get formMeta( ): C.MyForm.meta {
        return [
            [
                {
                    key: 'medicalSite',
                    label: '体检中心',
                    type: 'select',
                    value: this.dic.HMS_MEDICAL_SITE.length === 0 ? undefined : this.dic.HMS_MEDICAL_SITE[ 0 ].value,
                    options: this.dic.HMS_MEDICAL_SITE,
                    rules: [{ 
                        validate: val => !!val,
                        message: '必须选择体检中心'
                    }]
                }
            ]
        ];
    }

    /** 获取排期 */
    private fetchData( medicalSite, start, end ) {

        if ( !this.detail ) { return; }

        this.disabledTime = {
            notAllow: [ ],
            hasBeenFull: [ ]
        };

        this.http$.get<Api.get.healthCardDate>({
            url: `/api/booking/health-card/scheduleDate?medicalSite=${medicalSite}&startTime=${start}&endTime=${end}&processType=${this.detail.template.scheduleType || 1}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            data.map( item => {
                if ( !item.isScheduling ) {
                    this.disabledTime.notAllow.push( item.date );
                } else if ( item.appointmentNumber >= item.appointmentMaxLimit ) {
                    this.disabledTime.hasBeenFull.push( item.date );
                }
            });
            /** 如果返回日期少于目标查询，则剩下的显示为“未开放” */
            const dataLast = data[ data.length - 1 ];
            const year = new Date( end ).getFullYear( );
            const month = new Date( end ).getMonth( ) + 1;
            const currentLast = dataLast ? new Date( dataLast.date ).getDate( ) : 1;
            const targetLast =  new Date( end ).getDate( );
            if ( currentLast < targetLast ) {
                for ( let i = currentLast; i <= targetLast; i++ ) {
                    this.disabledTime.notAllow.push( new Date(`${year}/${month}/${i}`).getTime( ));
                }
            }

            

        });
    }

    /** 拉取数据字典 */
    private fetchDic( ) {
        this.http$.get<Api.get.csbDic>({
            url: `/api/common/dic?typeCode=HMS_COMM_SEX2,HMS_MEDICAL_SITE`
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
            this.formData = Object.assign({ }, this.formData, {
                medicalSite: data['HMS_MEDICAL_SITE'][ 0 ].itemValue
            });
        });
    }

    /** 拉取推荐套餐 */
    private fetchPackage( cardid, userid ) {
        this.http$.get< normalResult< App.healthCardPackage >>({
            url: `/api/health-card/package/${cardid}?userId=${userid}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.packages = data;
            this.formData = Object.assign({ }, this.formData, {
                packagee: data.packages[ 0 ].packageId
            });
        })
    }

    /** 拉取卡详情 */
    private fetchDetail( id ) {
        return this.http$.get< normalResult< App.healthCardDetail >>({
            url: `/api/health-card/detail/${id}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.detail = data;
            return;
        });
    }

    /** 体检中心选择 */
    private onFormChange( val ) {
        const { medicalSite } = val;
        const now = new Date( );
        const year = now.getFullYear( );
        const month = now.getMonth( );
        const date = now.getDate( );

        const start = new Date(`${year}/${month + 1}/1`);
        const end = new Date( year, month + 1, 0 );
        
        if ( !!this.detail ) {
            this.fetchData( medicalSite, start.getTime( ), end.getTime( ));
        } else {
            setTimeout(( ) => {
                this.fetchData( medicalSite, start.getTime( ), end.getTime( ));
            }, 2000 );
        }
        this.formData = Object.assign({ }, this.formData, {
            medicalSite
        });
    }

    /** 禁止选择 */
    private disableDate( date: Date ) {
        
        const date$ = new Date( ).getDate( );
        const month = new Date( ).getMonth( );
        const year = new Date( ).getFullYear( );
        const t = date.toLocaleDateString( );
        const { notAllow, hasBeenFull } = this.disabledTime;
        if ( notAllow.find( x => t === new Date( x ).toLocaleDateString( )) || hasBeenFull.find( x => t === new Date( x ).toLocaleDateString( ))) {
            return true
        } else if ( date.getFullYear( ) < year ||
                  ( date.getFullYear( ) === year && date.getMonth( ) < month ) ||
                  ( date.getFullYear( ) === year && date.getMonth( ) === month && date.getDate( ) < date$ )) {
            return true;
        }
        return false;
    }

    /** 日历翻页 */
    private detectDate( ) {
        const map = {
            '一月': 1, '二月': 2, '三月': 3, '四月': 4, '五月': 5, '六月': 6,
            '七月': 7, '八月': 8, '九月': 9, '十月': 10, '十一月': 11, '十二月': 12,
        }
        const el: any = document.querySelector('.mu-datepicker-toolbar-title');
        if ( !el ) { return; }

        const [ yearText, monthText ] = el.innerText.split(' ');

        if ( !monthText ) { return; }

        const year = Number( yearText );
        const month = map[ monthText ];
        
        if ( this.rili.year !== year || this.rili.month !== month ) {

            this.rili = {
                year, month
            };

            const end = new Date( year, month, 0 );
            const start = new Date(`${year}/${month}/1`);
            this.fetchData( this.formData.medicalSite, start.getTime( ), end.getTime( ));
        }
    }

    /** 选择就诊人 */
    private selectVisitor( val: App.bodyCheckVisitor ) {
        this.visitingMan = val;
        this.formData = Object.assign({ }, this.formData, {
            userid: val.id
        });
        this.fetchPackage( this.$route.params.id, val.id );
    }

    /** 选择套餐 */
    private choicePackge( val ) {
        this.formData = Object.assign({ }, this.formData, {
            packagee: val
        });
    }

    /** 检查 */
    private onCheck( ) {
        const { medicalSite, date, userid } = this.formData;
        const error = msg => {
            this.$toast.error( msg );
            return false;
        }

        if ( !medicalSite ) {
            return error('请选择体检中心');
        }

        if ( !date ) {
            return error('请选择预约时间');
        }

        if ( !userid ) {
            return error('请选择体检人');
        }
        
        return true;
    }

    /** 提交 */
    private onSubmit( ) {
        const isOk = this.onCheck( );
        if ( !isOk ) { return; }

        const { medicalSite, date, userid, packagee, desc } = this.formData;
        const data = {
            state: 1,
            medicalSite,
            remark: desc,
            userId: userid,
            packageId: packagee,
            userName: this.visitingMan.name,
            cardNumber: this.detail.cardNumber,
            medicalSiteName: (this.dic.HMS_MEDICAL_SITE.find( x => x.value === medicalSite ) as any).label,
            packageName: ( this.packages as any).packages.find( x => x.packageId === packagee ).packageName,
            appointmentTime: new Date(`${(date as Date).getFullYear( )}/${(date as Date).getMonth( )+1}/${(date as Date).getDate( )} 00:00:00`).getTime( ),
        };

        this.http$.post<normalResult< any >>({
            data,
            url: `/api/booking/health-card`
        }, {
            loadMsg: '预约中...',
            successMsg: '预约成功'
        }).then( res => {
            if ( res.status === 200 ) {
                this.$router.push('/health-card/my?tab=1')
            }
        });
    }

    mounted( ) {

        const { auto } = this.$route.query;
        this.autoSelect = !!auto && ( auto === '1' || auto === 'true' );

        this.fetchDic( );
        this.fetchDetail( this.$route.params.id )
            .then( data => {
                this.detectDate( );
            });
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
