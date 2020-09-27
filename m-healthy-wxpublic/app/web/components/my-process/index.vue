<template>
    <div class="com-my-process">
        <div class="process-block">
            <div
                :key="k"
                class="process-option"
                :class="{ active: active >= k }"
                v-for="(option, k) in options"
            >
                <div class="icon-block">
                    <svg class="my-icon" aria-hidden="true">
                        <use
                            :xlink:href="
                                Number( active ) < k ? icons['wait'] :
                                    Number( active ) === k ? icons['ing'] :
                                    icons['finish']
                            "
                        ></use>
                    </svg>
                </div>
                <p
                    class="process-status mt" 
                   :class="{ grey: Number( active ) < k }"
                >
                    {{ 
                        Number( active ) < k ? labels['wait'] :
                                Number( active ) === k ? labels['ing'] :
                                labels['finish']
                    }}
                </p>
                <p class="process-text">
                    {{ option }}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

/**
 * @description 
 * 进度条
 */
@Component({
    components: {
        
    }
})
export default class MyDrawer extends Vue {

    /** 当前进度 */
    @Prop({ type: Number, default: 0 }) active!: number

    /** 总选项进度 */
    @Prop({ type: Array, default: ( ) => [ ] }) options!: string[ ];

    /** 中文选项 */
    @Prop({ type: Object, default: ( ) => ({
        ing: '进行中',
        wait: '待进行',
        finish: '已完成'
    })}) labels!: {
        [ key: string ]: string
    };

    /** 图标 */
    private icons = {
        ing: '#icon-gou1',
        wait: '#icon-dengdai',
        finish: '#icon-gou'
    };


}
</script>
<style lang="less">
@import './index.less';
</style>