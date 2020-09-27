import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * tab栏
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /**
         *  tab
         * {
         *    key: number,
         *    label: string
         * }[ ]
         */
        tabs: {
            type: Array,
            value: [ ]
        },

        // 活动下标
        active: {
            type: Number,
            value: 0,
            observer: 'initActive'
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        // 当前下标
        current: 0
    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        // 初始化下标
        initActive( v ) {
            const this_: any = this;
            if ( v !== undefined && v !== null ) {
                this_.setData({
                    current: v
                });
            }
        },

        // 点击
        onTab({ currentTarget }) {
            const this_: any = this;
            const { current } = this_.data;
            const { active, key } = currentTarget.dataset;

            if ( current === active ) { return; }

            this_.setData({
                current: active
            });
            this_.triggerEvent('change', key || active )
        }

    },

    attached: function( ) {

    }
})
  