import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

const app = getApp< IApp >( );

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
        tips: {
            type: String,
            value: '',
            observer: 'init'
        },

        // 需要变粗变黑的文字
        boldText: {
            type: String,
            value: '咨询客服'
        },

        img: {
            type: String,
            value: 'cloud://dev-cz0o8.6465-dev-cz0o8/background/image_illustration@3x.png'
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
            const { tips, boldText } = this_.data;

            const meta = tips
                .split(',')
                .map( text => {
                    const index = text.indexOf( boldText );
                    return [{
                        type: 'normal',
                        text: text.slice( 0, index )
                    }, {
                        type: 'bold',
                        cb: 'onCall',
                        text: text.slice( index, boldText.length )
                    }, {
                        type: 'normal',
                        text: text.slice( index + boldText.length )
                    }]
                });

            this_.setData({
                tipsArr: meta
            });
        },

        onCall( phoneNumber = app.store.Common.customerService) {
            // 不打电话了，而是直接进入客服
            wx.makePhoneCall({
                phoneNumber
            });
        },

        onTap({ currentTarget }) {
            const { cb } = currentTarget.dataset.item;
            
            if ( !cb ) { return; }
            try { 
                this[ cb ]( );
            } catch( e ) { }
        }
    },

    attached: function( ) {

    }
})
  