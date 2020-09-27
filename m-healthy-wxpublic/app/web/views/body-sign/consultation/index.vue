<template>
    <window-title name="在线咨询" >
        <div class="p-bodysign-consultation">

            <img
                class="img"
                src="/public/img/zengwulin.png"
            />

            <p class="tips">
                扫描二维码添加专属健康客服
            </p>

            <div class="info-block">
                <div
                    :key="k"
                    class="info-item"
                    v-for="(item, k) in data"
                >
                    <svg class="my-icon big" aria-hidden="true">
                        <use :xlink:href="item.icon"></use>
                    </svg>
                    <div class="label">
                        {{ item.label }}
                    </div>
                    <div class="value">
                        {{ item.value }}
                    </div>
                </div>
            </div>

        </div>
    </window-title>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../components/window-title/index.vue';

@inject({
    selector: [ ]
})
@Component({
    components: {
        windowTitle
    }
})
export default class P extends Vue {

    private data = [
        {
            icon: '#icon-ren',
            label: '姓名',
            value: '健康客服'
        }, {
            icon: '#icon-dianhua1',
            label: '电话',
            value: '18078890120'
        }, {
            icon: '#icon-weixin',
            label: '微信',
            value: '18078890120'
        }
    ]

}
</script>
<style lang="less">
@import './index.less';
</style>

