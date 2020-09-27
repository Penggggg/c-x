<template>
    <window-title name="测试大厅" >
        <!-- tab -->
        <div>
            <active-tab
                :fixed="true"
                :meta="tabMeta"
                :inverse="true"
                :aditionalProps="{ answered }"
                indicator-color="rgb(26, 188, 156)"
                @change="e => onChange( e )"
            />
        </div>
    </window-title>
</template>

<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ActiveTab from '../../../components/active-tab/index.vue';
import windowTitle from '../../../components/window-title/index.vue';
import EvaluationHallAll from '../../../container/evaluation-hall-all/index.vue';
import EvaluationHallIsfinish from '../../../container/evaluation-hall-isfinish/index.vue';

Vue.component('evaluation-hall-all', EvaluationHallAll);
Vue.component('evaluation-hall-isfinish', EvaluationHallIsfinish);

@inject({
    selector: ['account$']
})
@Component({
    components: {
        ActiveTab,
        windowTitle
    }
})
export default class P extends Vue {

    /** 是否完成 */
    private answered = false;

    /** tab */
    private tabMeta: C.ActiveTab.meta = [
        {
            tab: '全部',
            component: 'evaluation-hall-all'
        }, {
            tab: '未完成',
            component: 'evaluation-hall-isfinish'
        }, {
            tab: '已完成',
            component: 'evaluation-hall-isfinish'
        }
    ];

    private onChange( e ) {
        if ( e === 1 ) {
            this.answered = false
        } 
        if ( e === 2 ) {
            this.answered = true
        } 
    }

}
</script>
<style lang="less">
@import './index.less';
</style>
