import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 菜品标签选择列表
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /** 是否展示计数 */
        count: {
            type: Boolean,
            value: false
        },

        placeholder: {
            type: String,
            value: ''
        },

        /** 最多输入字数 */
        max: {
            type: Number,
            value: 0
        },

        /** 由于微信小程序textare的bug 需要处理 */
        hide: {
            type: Boolean,
            value: false
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {
        /** 输入内容 */
        value: '',
        
        /** 内容长度 */
        length: 0
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        /** 标签输入 */
        onInput( e: any ) {
            (this as any).setData({
                value: e.detail.value,
                length: !!e.detail.value ? e.detail.value.length : 0
            });
            (this as any).triggerEvent('change', e.detail.value );
        }
    },

    attached: function( ) {

    }
})
  