import config from '../../config/index';
import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { addressToFront, addressChangeDataToBack } from '../../utils/util';

const app = getApp< IApp >( );

/**
 * @description
 * 地址选择
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        /** 刷新列表 */
        refresh: {
            type: String,
            value: '',
            observer: 'fetchList'
        },

        /** 默认文字 */
        placeholder: {
            type: String,
            value: '请设置收货地址信息'
        },

        /** 是否展示icon */
        icon: {
            type: Boolean,
            value: true
        },

        /** 是否默认选取第一个默认地址 */
        setDefault: {
            type: Boolean,
            value: false
        },

        /** 默认已选中的地址ID */
        selectedId: {
            type: String,
            value: ''
        },

        /** bindchange的时候，是否转化为后台字段 */
        transfer: {
            type: Boolean,
            value: false
        }

    },
  
    /**
     * 组件的初始数据
     */
    data: {

        // 地址列表
        list: [ ],

        // 当前选择
        selecting: null,

        // 下标
        currentIndedx: null,

        // 最近新增的地址id
        lastCreateAddressId: ''
    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听 */
        watchApp( ) {
            const this_:any = this;
            app.watch$('Auth.sysUserInfo', v => {
                !!v && this_.setData!({
                    memberid: v.id
                });
                setTimeout(( ) => {
                    this_.fetchList( );
                }, 50 );
            });
            app.watch$('Form.lastCreateAddressId', v => {
                !!v  && this_.setData({
                    lastCreateAddressId: v
                });
            });
        },

        /** 拉取地址 */
        fetchList(  ) {

            const this_: any = this;
            const { setDefault, memberid, selectedId, lastCreateAddressId, selecting } = this_.data;

            if ( !memberid ) { return; }

            http({
                path: `/apis/address/my/${memberid}`
            }).then( res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }

                const list = data ? data.map( addressToFront ) : [ ];

                this_.setData({
                    list,
                    loading: false,
                });
    
                // 设置默认值
                if ( setDefault || selectedId || lastCreateAddressId ) {

                    // 消费 lastCreateAddressId
                    const defaultIndex = list.findIndex( x => 
                        selectedId ? 
                            x.id === selectedId : 
                            lastCreateAddressId ?
                                x.id === lastCreateAddressId :
                                !!x.default 
                    );

                    if ( defaultIndex !== -1 ) {
                        this_.setData({
                            selecting: list[ defaultIndex ],
                            currentIndedx: defaultIndex
                        });

                        // 释放 lastCreateAddressId
                        if ( lastCreateAddressId ) {
                            app.set$('Form.lastCreateAddressId', '' );
                        }
                    }
                }

                // 如果之前已经选了，但是发现被删除了，则清空
                if ( selecting ) {
                    const exited = list.find( x => x.id === selecting.id );
                    if ( !exited ) { 
                        this_.setData({
                            selecting: null,
                            currentIndedx: null
                        });
                    }
                }

                this.closePop( );

                setTimeout(( ) => {
                    this.onTrigger( );
                }, 100 );
            });
        },

        /** 弹起选择 */
        openPop( ) {
            const this_: any = this;
            const { list } = this_.data;
            const pop = this_.selectComponent('#pop');

            // 如果地址选项为空，则直接跳到创建
            if ( list.length === 0 ) {
                navTo('/pages/address-create/index');
            } else {
                !!pop && pop.open( );
            }
        },

        /** 关闭选择 */
        closePop( ) {
            const this_: any = this;
            const pop = this_.selectComponent('#pop');
            !!pop && pop.close( );
        },

        /** 选中 */
        onChoice({ currentTarget }) {
            const this_: any = this;
            const { data, key } = currentTarget.dataset;

            this_.setData({
                selecting: data,
                currentIndedx: key
            });
            this.onTrigger( );
            this.closePop( );
        },

        /** 广播 */
        onTrigger( ) {
            const this_: any = this;
            const { currentIndedx, list, transfer } = this_.data;
            if ( currentIndedx !== null ) {
                const result = transfer ? 
                    addressChangeDataToBack( list[ currentIndedx ]) : 
                    list[ currentIndedx ];
                this_.triggerEvent('change', result );
            }
        },

        /** 创建 */
        goCreate( ) {
            navTo('/pages/address-create/index');
        }

    },

    attached: function( ) {
        this.watchApp( );
    }
})
  