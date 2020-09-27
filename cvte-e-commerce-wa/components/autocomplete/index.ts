import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 自动完成 - 带出可选项
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        /** 请求地址 */
        url: {
            type: String,
            value: ''
        },

        /** 请求参数 */
        query: {
            type: String,
            value: 'keyword'
        },

        /** 最大展示可选项 */
        max: {
            type: Number,
            value: 5
        },

        /** 要展示的字段，逗号隔开 */
        showKey: {
            type: String,
            value: 'name'
        },

        /** 点击选项时，用哪个值填充到input */
        fillKey: {
            type: String,
            value: 'name'
        },

        /** 表单 - 是否可用 */
        disabled: {
            type: Boolean,
            value: false
        },

        /** 表单 - 值 */
        defaultValue: {
            type: String,
            value: '',
            observer: 'initVal'
        },

        /** 表单 - 默认 */
        placeholder: {
            type: String,
            value: ''
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        /** 输入 */
        value: '',

        /** 展示列表 */
        isShow: false,

        /** 定时器 */
        timer: null,

        /** 结果列表 */
        resultList: [ ]

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        runComputed( ) {
            computed( this, {

                /** 结果列表 */
                resultList$: function( ) {
                    const { resultList, value } = this.data;
                    const showKey = this.data.showKey || 'name';
                    const showKeyArr = showKey.split(',');
                    const value$ = value ?
                        value.replace(/ /g, '') :
                        '';

                    const meta = resultList.map( item => {
                        return {
                            ...item,
                            showKeyArr$: showKeyArr.map( key => {
                                const allText = item[ key ];
                                if ( !allText ) {
                                    return [{
                                        text: '',
                                        type: 'normal'
                                    }]
                                } else {
                                    const index = allText.indexOf( value$ );
                                    return [{
                                        type: 'normal',
                                        text: allText.slice( 0, index )
                                    }, {
                                        type: 'bold',
                                        text: allText.slice( index, value$.length )
                                    }, {
                                        type: 'normal',
                                        text: allText.slice( index + value$.length )
                                    }]
                                }
                            })
                        }
                    });
                    return meta;
                }
            });
        },

        /** 输入 */
        onInput({ detail }) {
            const this_: any = this;
            const { value } = detail;

            this_.setData({
                value
            });
            this_.triggerEvent('input', value );
            this.beforeSearch( value.replace(/ /g, ''));
        },

        /** 防抖 - 发送请求 */
        beforeSearch( search ) {
            const this_: any = this;
            const { url, timer } = this_.data;

            if ( !url ||!search ) { return; }

            if ( timer ) {
                clearTimeout( timer );
            }

            this_.setData({
                timer: setTimeout(( ) => {
                    this.onSearch( search )
                }, 500 )
            });
        },

        /** 发送请求 */
        onSearch( search ) {
            const this_: any = this;
            const { url, query, max } = this_.data;
    
            http({
                errMsg: 'none',
                loadingMsg: 'none',
                path: `/apis/common/company-check?${query || 'keyword'}=${search}`
            }).then( res => {
                const { status, data } = res;
    
                if ( status !== 200 ) { 
                    return this_.setData({
                        isShow: false,
                        resultList: [ ]
                    });
                }

                this_.setData({
                    isShow: true,
                    resultList: Array.isArray( data ) ?
                        data.slice( 0, max ) : 
                        [ ]
                });

            })
        },

        /** 展示 */
        onSetShow( isShow ) {
            const this_: any = this;
            this_.setData({
                isShow
            });
        },

        /** 失焦 */
        onBlur( ) {
            setTimeout(( ) => {
                this.onSetShow( false );
            }, 100 );
        },

        /** 聚焦 */
        onFocus( ) {
            this.onSetShow( true );
        },

        /** 选择 */
        onChoice({ currentTarget }) {
            const this_: any = this;
            const fillKey = this_.data.fillKey || 'name';
            const { item } = currentTarget.dataset;

            if ( !fillKey ) { return; }
            if ( item[ fillKey ] === undefined ) { return; }

            this_.setData({
                value: item[ fillKey ]
            });

            this_.triggerEvent('confirm', item );
        },

        /** 赋值 */
        initVal( v ) {
            const this_: any = this;
            this_.setData({
                value: v
            });
        }

    },

    attached: function( ) {
        this.runComputed( );
    }
})
  