import { IApp } from './global';
import { store$ } from './store/index';
import { watchCallBack, pushCb, getVal, updateVal } from './utils/watch';
import { getUuid } from './utils/util';
import dataBury from './utils/dataBury';

App< IApp >({

    /** 全局store */
    store: store$,

    /** 
     * @description 
     * 监听store里面某字段
     * 用法：
     * const app = getApp< IApp >( );
     * app.watch$('Auth.names.Ben', ( newVal, oldVal ) => { ..... })
     */
    watch$( key, cb ) {
        pushCb( key, cb )
        cb( getVal( key ));
    },
    // 获取uuid
    async getUuid$( ) {
        const id =  await getUuid();
        return id;
    },

    /**
     * @description
     * 数据埋点
     * */ 
    dataBury$(data){
        dataBury(data);
    },

    /**
     * @description 
     * 设置store里面某字段
     * 用法：
     * const app = getApp( );
     * app.set$('Auth.names.Ben', 'hehehe');
     */
    set$( key, val ) {
        updateVal( key, val );
        console.log('【---- Property Set ----】', key, ':', val );
    },

    onLaunch( obj ) {
        // 页面埋点
        console.log('我的启动参数',obj);
        store$.Auth.init( );
        store$.Auth.getSystemInfo( );
        store$.Common.judgeIPhoneX( );

        store$.Cloud
            .initCloud( )
            .then(( ) => {
                store$.Auth
                    .getOpenid( )
                    .then(( ) => {
                        store$.Auth.getSystemUser( ).then(() => {
                            this.dataBury$([{
                                "$code":"startPage",
                                "$ts":1567929147302
                            }]);
                            // 这里给时间设置wa-jwt的全局头部
                            setTimeout(( ) => {
                                store$.Auth.bindVisitor( );
                                store$.Auth.judgeMarkerExpand( );
                                store$.Auth.judgeDistributor( );
                            }, 100 );
                        });
                    });
            });
    },
});