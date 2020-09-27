import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 一整块的卡券
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        /**
         * {
         *      id,
         *      type 券类型
         *      typeLabel 券类型中文
         *      discountType 优惠类型
         *      value 优惠价格/折扣
         *      used 是否能用
         *      passed 是否过期
         *      tips 小文案提示 逗号隔开
         *      title 标题
         *      start 有效期 开始时间
         *      end 有效期 结束时间
         *      useTips 使用说明
         * }
         */
        data: {
            type: Object,
            value: { },
            observer: 'init'
        },

        // 使用说明只展示一行
        showAllTips: {
            type: Boolean,
            value: true
        },

        /** 头部颜色 */
        headColor: {
            type: String,
            value: '#EBC686'
        },

        /** 标签颜色 */
        labelColor: {
            type: String,
            value: '#905128'
        },

        /** 线条 */
        line: {
            type: Boolean,
            value: false
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        meta: null

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        // 初始化
        init( v ) {
            
            const this_: any = this;
            const { start, end, tips } = v;
            const { data } = this_.data;
            this_.setData({
                meta: {
                    ...data,
                    tips$: tips ? tips.split(',') : [ ], 
                    end$: end ? this_.formatData( end ) : undefined,
                    start$: start ? this_.formatData( start ) : undefined
                }
            });
        },

        // 日期
        formatData( ts ) {

            if ( !ts ) { return ''; }
            
            const time = new Date( Number( ts ));
            const y = time.getFullYear( );
            const m = time.getMonth( ) + 1;
            const d = time.getDate( );
            return `${y}.${m}.${d}`;
        }

    },

    attached: function( ) {

    }
})
  