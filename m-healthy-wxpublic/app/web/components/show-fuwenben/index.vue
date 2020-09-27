<template>
    <div class="c-show-fuwenben" v-html="value">
        
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MyDrawer from '../../components/my-drawer/index.vue';

@Component({
    components: {
        MyDrawer
    }
})
export default class C extends Vue {

    /** 富文本 */
    @Prop({ type: String, default: '' })
    value!: string;


}
</script>
<style lang="less">
@import './index.less';
</style>

