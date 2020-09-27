<template>
    <div class="p-account-has-bind my-page">
        <!-- 成功 -->
        <my-drawer
            title="账号绑定"
            :show.sync="show"
            :show-icon="false"
        >
            <div
                class="success-block"
            >
                <div class="icon-tips">
                    i
                </div>
                <p class="tips-title">
                    账号已绑定
                </p>
            </div>
        </my-drawer>
    </div>
</template>
<script lang="ts">
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyDrawer from '../../../components/my-drawer/index.vue';
import MyHeader from '../../../components/my-header/index.vue';

@inject({ })
@Component({
    components: {
        MyHeader,
        MyDrawer
    }
})
export default class HasBound extends Vue {

    private show = true;

}
</script>
<style lang="less">
@import './index.less';
</style>

