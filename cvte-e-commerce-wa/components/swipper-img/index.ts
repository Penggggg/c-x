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
        /** 图片列表
         * string | {
         *    url 图片路径
         *    path 跳转路径
         * }[ ]
         */
        imgs: {
            type: Array,
            value: [ ],
            observer: 'init'
        },

        /**
         * 间隔
         */
        interval: {
            type: Number,
            value: 5000
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        // 下标
        current: 0

    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        
        /** 预览图片 */
        previewImg({ currentTarget }: any ) {
            const { imgs } = (this as any).data;
            const { img } = currentTarget.dataset;
            wx.previewImage({
                current: img,
                urls: imgs
            });
        },

        /** 滑动事件 */
        onSwipper({ detail }: any ) {
            const { current } = detail;
            
            (this as any).setData({
                current
            });
        },

        init( ) {
            (this as any).setData({
                current: 0
            });
        }

    },

    attached: function( ) {

    }
})
  