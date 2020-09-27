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

        // 分段的话 英文逗号隔开
        title: {
            type: String,
            value: ''
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {
        tipsArr: [ ]
    },
  
    /**
     * 组件的方法列表
     */
    methods: {
        init( init ) {
            const this_: any = this;
            const { tips } = this_.data;

            this_.setData({
                tipsArr: tips.split(',')
            });
        }
    },

    attached: function( ) {

    }
})
  