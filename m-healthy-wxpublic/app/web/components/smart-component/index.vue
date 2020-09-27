<template>
    <mu-avatar
        :size="size"
        :color="color"
        :text-color="textColor"
        v-if="!text && !img"
    />
    <mu-avatar
        :size="size"
        :color="color"
        :text-color="textColor"
        v-else-if="text && !img"
    >
        {{ text }}
    </mu-avatar>
    <mu-avatar
        v-else
        :size="size"
        :color="color"
        :text-color="textColor"
        class="c-smart-avatar"
    >
        <img :src="img" />
    </mu-avatar>
</template>
<script lang="ts">
/**
 * @description
 * 智能头像：有头像显示头像，没有头像显示文字，都没有就显示默认的
 */
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({ })
export default class SmartAvatar extends Vue {

    /** 文字 */
    @Prop( String ) text!: string;

    /** 图片 */
    @Prop( String ) img!: string;

    /** 尺寸 */
    @Prop({ default: 60 }) size!: number;

    @Prop({ default: '#e8e8e8' }) color!: string;

    @Prop({ default: '#666' }) textColor!: string

}
</script>
<style lang="less">
@import './index.less';
</style>


