import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { cloudHttp } from '../../utils/cloudHttp';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 小程序二维码生成器
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        // 二维码页面
        page: {
            type: String,
            value: '',
            observer: 'onPageChange'
        },

        // 参数
        scene: {
            type: String,
            value: '',
            observer: 'onSceneChange'
        },

        // 过期时间
        timeout: {
            type: Number,
            value: 0
        },

        // 缩放比例
        scale: {
            type: Number,
            value: 0.9
        },

        // 是否有阴影
        shadow: {
            type: Boolean,
            value: true
        }

    },
  
    /**
     * 组件的初始数据
     */
    data: {

        /** 是否加载中 */
        loading: true,

        canvasHeight: 0,

        canvasWidth: 0,

        /** 倒计时 */
        countdown: 0,

        /** 定时器 */
        timer: null

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        // page变化
        onPageChange( v ) {
            const this_: any = this;
            const { scene } = this_.data;
            this.createQrCode( v, scene );
        },

        // scene变化
        onSceneChange( v ) {
            const this_: any = this;
            const { page } = this_.data;
            this.createQrCode( page, v );
            this.keepSk( v );
        },

        // 二维码生成
        createQrCode( page, scene ) {
            
            const this_: any = this;
            const { scale } = this_.data;
            if ( !page ) { return ; }
    
            cloudHttp({
                url: 'auth_qrCode',
                data: {
                    page,
                    scene
                },
                success: res => {
                    const wx_: any = wx;
                    const { status, data } = res;
                    const fsm = wx.getFileSystemManager( );
                    const ctx = wx_.createCanvasContext('c1', this );
                    const qrCode = wx_.env.USER_DATA_PATH + '/wa_qrcode_temp.png';
    
                    if ( res.status !== 200 ) { return; }

                    // 这里要删除临时文件！！！
                    try {
                        fsm.removeSavedFile({
                            filePath: qrCode
                        });
                    } catch ( e ) { }

                    fsm.writeFileSync( qrCode, data, 'binary' );
                    wx.getSystemInfo({
                        success: system => {
    
                            const { windowWidth, windowHeight } = system;
                            const canvasWidth = Number(( windowWidth * scale ).toFixed( 0 ));
    
                            ctx.fillStyle = '#fff';
                            ctx.fillRect( 0, 0, canvasWidth, canvasWidth );
    
                            this_.setData({
                                canvasWidth,
                                canvasHeight: canvasWidth
                            });
    
                            console.log('重新绘了');
                            ctx.drawImage( 
                                qrCode, 
                                0,
                                0, 
                                canvasWidth, 
                                canvasWidth
                            );
    
                            ctx.draw( false, ( ) => { 
                                this_.setData({
                                    loading: false
                                });

                                this.checkTimeout( );
                                this_.triggerEvent('load', true );
                            });
                        }
                    });
    
                }
            });
        },

        // 设置过期时间
        checkTimeout( ) {
            const this_: any = this;
            const now = Date.now( );
            const { timeout } = this_.data;
            
            if ( !timeout ) { return; }

            const deal = Number((( Number( timeout ) - now ) / 1000 ).toFixed( 0 ));
            
            this_.setData({
                countdown: deal
            });

        },

        // sk续命
        keepSk( scene, timeout = 30 * 1000 ) {
            const this_: any = this;
            const sceneArr = scene.split('&');
            const skTarget = sceneArr.find( x => x.indexOf('sk=') === 0 );
            if ( !skTarget ) { return; }

            const sk = skTarget.split('=')[ 1 ];
            this_.setData({
                timer: setInterval(( ) => {
                    this.fetchKeepSk( sk );
                }, timeout )
            })
        },

        // sk续命
        fetchKeepSk( sk ) {
            if ( !sk ) { return; }
            http({
                errMsg: 'none',
                loadingMsg: 'none',
                path: `/apis/common/sk-renew?sk=${sk}`
            });
        }
    },

    attached: function( ) {

    },
    
    detached: function( ) {
        const { timer } = this.data;
        if ( timer ) {
            clearInterval( timer );
        }
    }
})
  