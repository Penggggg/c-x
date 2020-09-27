<template>
    <window-title name="分析时段" >
        <div class="p-bodysign-analys-entry">

            <div class="title">
                选择分析时间段
            </div>

            <div class="options-block">
                <div
                    :key="k"
                    class="option-item"
                    v-for="(item, k) in timeOpt"
                    @click="choiceTime( item.value )"
                    :class="{ active: k === active }"
                >
                    {{ item.label }}
                </div>
            </div>

            <div class="form-block">
                <my-form
                    ref="form"
                    :meta="formMeta"
                    @change="onFormChange"
                />
            </div>

            <div
                class="btn-block"
                @click="goDetail"
            >
                提交
            </div>

        </div>
    </window-title>
</template>
<script lang="ts">
import { observe, toJS } from 'mobx';
import { inject } from '../../../service/inject';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import windowTitle from '../../../components/window-title/index.vue';
import MyForm from '../../../components/my-form-v2/index.vue';

@inject({
    selector: ['account$']
})
@Component({
    components: {
        MyForm,
        windowTitle
    }
})
export default class P extends Vue {

    /** 选项 */
    private active = 0;

    /** 时间选项 */
    private timeOpt = [
        {
            label: '最近30天',
            value: 0
        }, {
            label: '最近60天',
            value: 1
        }, {
            label: '最近一年',
            value: 2
        }
    ];

    get formMeta( ) {
        return [
            [
                {
                    key: 'start',
                    label: '开始时间',
                    type: 'date2',
                    value: null,
                    rules: [{ 
                        validate: val => !!val,
                        message: '请选择开始时间'
                    }]
                }
            ], [
                {
                    key: 'end',
                    label: '结束时间',
                    type: 'date2',
                    value: null,
                    rules: [{ 
                        validate: val => !!val,
                        message: '请选择结束时间'
                    }]
                }
            ]
        ]
    }

    /** 表单变更 */
    private onFormChange( val ) {
        console.log( val );
    }

    /** 选择时间段 */
    private choiceTime( val ) {
        this.active = val;
        this.injectTime( val );
    };

    /** 根据active注入时间 */
    private injectTime( val ) {
        const now = new Date( );
        switch( val ) {
            case 0: {
                (this.$refs as any).form.set({
                    end: now,
                    start: new Date( now.getTime( ) - ( 30 * 24 * 60 * 60 * 1000)),
                })
                break;
            }
            case 1: {
                (this.$refs as any).form.set({
                    end: now,
                    start: new Date( now.getTime( ) - ( 60 * 24 * 60 * 60 * 1000)),
                })
                break;
            }
            case 2: {
                (this.$refs as any).form.set({
                    end: now,
                    start: new Date( now.getTime( ) - ( 365 * 24 * 60 * 60 * 1000)),
                })
                break;
            }
        }
    }

    /** 跳到报告 */
    private goDetail( ) {
        const { data, result } = (this.$refs as any).form.getData( );
        if ( !result ) {
            return this.$toast.error('请选择时间');
        }
        const { end, start } = data;
        this.$router.push(`/body-sign/analys?start=${start.getTime( )}&end=${end.getTime( )}`)
    }

    mounted( ) {
        this.injectTime( this.active );   
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

