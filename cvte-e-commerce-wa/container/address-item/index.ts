import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 单个地址
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * {
         *      id,
         *      name 用户姓名
         *      phone 电话
         *      provinceCode 省
         *      provinceName 省
         *      cityCode 城
         *      cityName 城
         *      areaCode 区
         *      areaName 区
         *      address 详细
         *      default 是否为默认
         * }
         */
        data: {
            type: Object,
            value: { }
        },

        /**
         * 是否有下划线
         */
        line: {
            type: Boolean,
            value: true
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

        /** 跳往编辑 */
        goEdit( ) {
            const this_: any = this;
            const { data } = this_.data;
            navTo(`/pages/address-create/index?id=${data.id}`)
        }

    },

    attached: function( ) {

    }
})
  