<template>
    <div class="com-device-info">
        <slot name="icon"></slot>
        <div class="info-block">
            <slot name="info"></slot>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    components: {

    }
})
export default class C extends Vue {


}
</script>
<style lang="less">
@import './index.less';
</style>