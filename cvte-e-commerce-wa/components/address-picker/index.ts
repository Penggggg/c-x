import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';
import config from '../../config/index';

/**
 * @description
 * 省市区选择
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        /** 请求地址 */
        url: {
            type: String,
            value: `${config.host.default}/apis/common/address`
        },

        /** 请求query parentCode */
        query: {
            type: String,
            value: 'parentCode'
        },

        // 获取数据后，从哪个字段获得列表
        listKey: {
            type: String,
            value: 'list'
        },

        // 元数据的中文字段
        labelKey: {
            type: String,
            value: 'areaName'
        },

        // 元数据的值字段
        valueKey: {
            type: String,
            value: 'areaCode'
        },

        // 元数据parentCode值字段
        parentKey: {
            type: String,
            value: 'parentCode'
        },

        // 几行选择
        columns: {
            type: Number,
            value: 3
        },

        // 默认文案
        placeholder: {
            type: String,
            value: '请选择地址'
        },

        /** 
         * 默认值
         * {
         *      areaName: string,
         *      areaCode: string
         * }[ ]
         */
        defaultValue: {
            type: Array,
            value: [ ],
            observer: 'initByDefault'
        },

        /**
         * 是否拉取初始化数据
         */
        initData: {
            type: Boolean,
            value: true
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        /** 
         * 可选列表 
         * {
         *      label: string,
         *      value: string,
         *      parentCode: string
         * }[ ][ ] 
         */
        optArr: [ ],

        /** 
         * 已选列表
         * number[ ]
         */
        answerArr: [ ],

        /** 
         * 确定后的选项
         * {
         *      label: string,
         *      value: string,
         *      parentCode?: string
         * }[ ]
         */
        sureAnswerArr: [ ]

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        /** 计算属性 */
        runComputed( ) {
            computed( this, {

                /** 当前已选的中文 */
                answerText$: function( ) {
                    let text = '';
                    const this_: any = this;
                    const { sureAnswerArr } = this_.data;
                    sureAnswerArr.map( x => text += ` ${x.label}`);
                    return text;
                }
            });
        },

        /** 根据省、市、区、街道 */
        fetchNext( code = '', index = 0, autoNext = false ) {
            const this_: any = this;
            const { listKey, optArr, columns, url, query } = this_.data;

            if ( index >= columns ) { return; }

            return http({
                allUrl: `${url}?${code ? `${query}=` + code : ''}&${code === '' ? 'level=1' : ''}&pageSize=999&isChina=1`
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = listKey ? data[ listKey ] : data;
                const dealMeta = this.dealListMeta( list );

                optArr.splice( index, 1, dealMeta );
                this_.setData({
                    optArr
                });

                if ( autoNext && index < columns - 1 && dealMeta.length > 0 ) {
                    this.fetchNext( dealMeta[ 0 ].value, index + 1, true );
                }

                return dealMeta;
            });
        },

        /** 处理列表数据，变成选项 */
        dealListMeta( item ) {
            const this_: any = this;
            const { valueKey, labelKey, parentKey } = this_.data;
            
            return item
                .map( i => ({
                    value: i[ valueKey ],
                    label: i[ labelKey ],
                    parentCode: i[ parentKey ]
                }))
                .filter( i => {
                    return !i.label.includes('台湾') &&
                        !i.label.includes('香港') &&
                        !i.label.includes('澳门')
                })

            ;
        },

        /** 初始化答案 */
        initAnswer( ) {
            const this_: any = this;
            const { columns } = this_.data;

            let arr: number[ ] = [ ];
            for( let i = 0; i < columns; i++ ) {
                arr.push( 0 );
            }
            this_.setData({
                answerArr: arr
            });
        },

        /** picker更改, 返回了数组答案 */
        onPickerChange( e ) {
            const this_: any = this;
            const { answerArr, optArr } = this_.data;
            
            const sureAnswerArr = answerArr.map(( columnAnswer, index ) =>{
                const target = optArr[ index ][ columnAnswer ];
                return target || { };
            });

            this_.setData({
                sureAnswerArr
            });

            this_.triggerEvent('change', sureAnswerArr );
        },

        /** 某行改变了 */
        onColumnChange( e ) {
            const this_: any = this;
            const { column, value } = e.detail;
            const { optArr, columns } = this_.data;
            const answerArr = [ ...this_.data.answerArr ];
            answerArr.splice( column, 1, value );

            // 答案变
            const newAnswerArr: any = answerArr.slice( 0, column + 1 );
            for( let i = column + 1; i < columns; i++ ) {
                newAnswerArr.push( 0 );
            }

            this_.setData({
                answerArr: newAnswerArr
            });

            // 选项变
            const current = optArr[ column ][ value ];
            this.fetchNext( current.value, column + 1, true );

        },

        /** 根据默认值 处理数据 */
        initByDefault( v ) {
            if ( Array.isArray( v ) && v.length === 0 ) {
                return;
            }

            const this_: any = this;
            const { labelKey, valueKey, sureAnswerArr, columns } = this_.data;
            const defaultValueArr = v.map( x => ({
                label: x[ labelKey ] || x.label,
                value: x[ valueKey ] || x.value
            }));

            // 设置已选项
            this_.setData({
                sureAnswerArr: defaultValueArr
            });

            defaultValueArr.slice( 0, defaultValueArr.length - 1 );

            // 检查每项的值 是否相等
            const someDifferent = sureAnswerArr.some(( item, k ) => {
                return typeof item !== 'object' || item.value !== defaultValueArr[ k ].value
            });
            if ( !someDifferent && sureAnswerArr.length === defaultValueArr.length ) {
                return;
            }

            // 拉取省市区
            Promise.all([
                // 省
                this.fetchNext( '' ),
                // 市、区、街道等
                ...defaultValueArr
                    .slice( 0, defaultValueArr.length - 1 )
                    .map(( defaultValueMeta, index ) => {
                        return this.fetchNext( defaultValueMeta.value, index + 1 );
                    })
            ]).then( res => {
                // !有时候会报 optArr[ index ] undefiend
                setTimeout(( ) => {
                    // 设置已选值
                    const answerArr = defaultValueArr.map(( defaultValueMeta, index ) => {
                        const targeIndex = res[ index ].findIndex( x => x.value === defaultValueMeta.value );
                        return targeIndex === -1 ? 0 : targeIndex
                    });

                    this_.setData({
                        answerArr,
                        optArr: res
                    });
                }, 100 );
            });
        }

    },

    attached: function( ) {

        const { defaultValue, initData } = this.data;

        this.runComputed( );
        this.initAnswer( );
        if ( initData && defaultValue.length === 0 ) {
            this.fetchNext( '', 0, true );
        } else {
            // 这里不用，因为上面 observer了
            // this.initByDefault( );
        }
    }
})
  