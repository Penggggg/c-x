<template>
    <div class="p-health-card-list">
        <!-- tab -->
        <div>
            <active-tab
                :fixed="true"
                :meta="tabMeta"
                :inverse="true"
                indicator-color="#4caf50"
                :change-call-back="tabChange"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ActiveTab from '../../../components/active-tab/index.vue';
import HealthPackageList from '../../../container/health-package-list/index.vue';

Vue.component('health-package-list', HealthPackageList);

@inject({
    selector: ['account$']
})
@Component({
    components: {
        ActiveTab
    }
})
export default class HealthCheckList extends Vue {

    /** tab */
    private tabMeta: C.ActiveTab.meta = [
        {
            tab: '个人健康体检',
            component: 'health-package-list'
        }, {
            tab: '企业员工体检',
            // component: 'health-card-record'
            component: ''
        }
    ];

    /** tab 改变 */
    private tabChange = (e: any) => {
        if(e === 1) {
            this.$toast.info('暂未开发哦！');
        }
    }
}
</script>
<style lang="less">
@import './index.less';
</style>
