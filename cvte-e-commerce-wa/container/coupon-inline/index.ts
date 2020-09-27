import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 卡券，一小块卡券，可在一行显示多个
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /** 文案 */
        label: {
            type: String,
            value: ''
        },
        /** 眼色 */
        bg: {
            type: String,
            value: '#DDB97B'
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {


    },
  
    /**
     * 组件的方法列表
     */
    methods: {

    },

    attached: function( ) {

    }
})
  