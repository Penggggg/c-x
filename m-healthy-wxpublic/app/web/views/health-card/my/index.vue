<template>
    <div class="p-health-card-list">
        <!-- tab -->
        <div>
            <active-tab
                :fixed="true"
                :meta="tabMeta"
                :inverse="true"
                indicator-color="#16c5b0"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ActiveTab from '../../../components/active-tab/index.vue';
import BookingBodycheck from '../../../container/booking-bodycheck/index.vue';
import BookingRecordBodycheck from '../../../container/booking-record-bodycheck/index.vue';
import HealthCardRecord from '../../../container/health-card-record/index.vue';
import HealthCardList from '../../../container/health-card-list/index.vue';

Vue.component('health-card-list', HealthCardList);
Vue.component('health-card-record', HealthCardRecord);

@inject({
    selector: ['account$']
})
@Component({
    components: {
        ActiveTab
    }
})
export default class BookingBodyCheck extends Vue {

    /** tab */
    private tabMeta: C.ActiveTab.meta = [
        {
            tab: '我的健康卡',
            component: 'health-card-list'
        }, {
            tab: '预约记录',
            component: 'health-card-record'
        }
    ];

}
</script>
<style lang="less">
@import './index.less';
</style>
