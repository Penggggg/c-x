<template>
    <div class="p-booking-bodycheck my-page">

        <!-- tab -->
        <div>
            <active-tab
                :fixed="true"
                :meta="tabMeta"
                :inverse="true"
                indicator-color="#4caf50"
                @change="outter"
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

Vue.component('booking-bodycheck', BookingBodycheck);
Vue.component('booking-record-bodycheck', BookingRecordBodycheck);

@inject({  })
@Component({
    components: {
        ActiveTab
    }
})
export default class BookingBodyCheck extends Vue {

    /** tab */
    private tabMeta: C.ActiveTab.meta = [
        {
            tab: '预约信息',
            component: 'booking-bodycheck'
        }, {
            tab: '预约记录',
            component: 'booking-record-bodycheck'
        }
    ];

    private outter( ) {
        console.log('???')
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
