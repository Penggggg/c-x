<template>
    <div class="c-skeleton-list">
        <transition name="fade-list" mode="out-in">

            <!-- 骨架类型1 -->
            <ul
                :key="1"
                v-if="loading"
                class="skt-list"
                :class="{ 'skt-list': type === 'default', 'skeletion-list': type === 'new' }"
            >
                <li
                    :key="k"
                    v-if=" type === 'default'"
                    v-for="(salary, k) in line"
                >
                    <div class="top">
                        <span class="skt-1"></span>
                        <span class="skt-2"></span>
                    </div>
                    <div class="bottom">
                        <span class="skt-3"></span>
                    </div>
                </li>
                <!-- 骨架类型2 -->
                <div
                    :key="k"
                    v-if=" type === 'new'"
                    v-for="(salary, k) in line"
                >
                    <li>
                        <div class="img-block">
                            <span class="round"></span>
                        </div>
                        <div class="content-block">
                            <span class="c top"></span>
                            <span class="c label"></span>
                            <span class="c bar">
                                <span class="i time"></span>
                                <span class="i other"></span>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div class="img-block">
                            <span class="round"></span>
                        </div>
                        <div class="content-block">
                            
                            <span class="m top">
                                <span class="left"></span>
                                <span class="right"></span>
                            </span>

                            <span class="m label">
                                <span class="left"></span>
                                <span class="right"></span>
                            </span>

                            <span class="c top"></span>

                            <span class="c bar">
                                <span class="i time"></span>
                                <span class="i other"></span>
                            </span>

                        </div>
                    </li>
                </div>
            </ul>

            <slot v-else>
                
            </slot>

        </transition>

    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
/**
 * @description 骨架列表
 * 特性：加载中的时候显示骨架列表
 * 用法：<skeleton-list :loading="loading" type="xxxxx">xxx</skeleton-list>
 */
@Component({ })
export default class SkeletonList extends Vue {

    @Prop({ default: 8 }) line!: number

    /** new 更好看 有头像 */
    @Prop({ type: String, default: 'default' }) 
    type!: 'default' | 'new';

    @Prop({ type: Boolean, required: true }) loading!: boolean;

}
</script>
<style lang="less">
@import './index.less';
</style>



