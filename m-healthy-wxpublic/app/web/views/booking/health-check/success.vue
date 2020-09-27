<template>
    <div class="success-page">
        <!-- 预约成功提示信息 -->
        <div class="success-img">
            <mu-icon value="check_circle" color="green" size="80"/>
           <p>订单提交成功</p>
        </div>
        <div class="success-text">
            <p>温馨提示：</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系统暂未提供在线支付功能，订单提交成功24小时内，将有健康客服电话与您确认预约信息及交费方式。</p>
        </div>
    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {
    }
})
export default class HealthCheckSuccess extends Vue {

}
</script>
<style lang="less">
@import './index.less';
</style>
