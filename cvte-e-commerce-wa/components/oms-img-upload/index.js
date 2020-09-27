const { http } = require('../../utils/http.js');
import config from '../../config/index';

Component({
    options: {
        styleIsolation: 'apply-shared'
    },
    /**
     * 组件的属性列表
     */
    properties: {
        /** 最大上传数 */
        max: {
            type: Number,
            value: 9
        },
        /** 已上传列表 */
        hasBeenUploaded: {
            type: Array,
            value: [ ],
            observer: function( val ) {
                this.setData({
                    list: [ ...val ]
                });
                this.judgeIcon( );
                setTimeout(( ) => {
                    this.triggerEvent('change', this.data.list );
                }, 0 );
            }
        },
        /** 是否允许调整图片位置 */
        canAdjust: {
            type: Boolean,
            value: false,
        },
        /** 最大上传数 */
         omsCode: {
            type: String,
            value: ''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        /** 上传列表 */
        list: [ ],
        /** 已上传列表 */
        has: [ ],
        /** 是否展示上传图标 */
        showIcon: true,
        /** 附件内容 */
        fujian: {
            category: 'DELIVERY_ORDER_PAY_FLOW',
        },
        // iac
        iac: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

      /** 获取iac、附件 */
      fetchIAC( ) {
          http({
              path: `/iac`
          }).then( res => {
              const { status, data } = res;
              if ( status !== 200 ) { return; }
              this.setData({
                  iac: data
              })
          }); 
      },
      
      /** 选择文件 */
      upload: function( ) {
          const that = this;
          wx.chooseImage({
              count: that.data.max - that.data.list.length,
              sizeTye: ['original', 'compressed'],
              success: function( res ) {
                    const filePaths = res.tempFilePaths;
                    const { category } = that.data.fujian;
                    const objectId = that.data.omsCode
                    console.log('我的图片数据', filePaths);
                    wx.showLoading({
                        title: '上传中...'
                    })
                    // 循环上传
                    Promise.all(
                        filePaths.map( file => {
                            return new Promise(( resolve, reject ) => {
                                wx.uploadFile({
                                    // url: `${config.host.default}/uploadPipe`, 
                                    url: `${config.host.omsServer}/upload.action`, 
                                    // url: `https://crmtest.gz.cvte.cn/framework/upload.action`, 
                                    filePath: file,
                                    name: 'file',
                                    formData: {
                                        category,
                                        objectId
                                    },
                                    header: {
                                        'x-iac-token': that.data.iac,
                                        'Content-Type': 'multipart/form-data'
                                    },
                                    fail: res => {
                                        reject( );
                                    },
                                    success: res => {
                                        try {
                                            const data = typeof res.data === 'string' ? JSON.parse( res.data ) : res.data;
                                            const imgUrl = `${config.host.omsServer}/upload!download.action?id=${data.id}`;
                                            that.setData({
                                                list: [ ...that.data.list, file ]
                                                // list: [ ...that.data.list, imgUrl ]
                                            });
                                            that.judgeIcon( );
                                            setTimeout(( ) => {
                                                that.triggerEvent('change', [ ...that.data.list ]);
                                            }, 0 );
                                            resolve( );
                                        } catch ( e ) {
                                            reject( );
                                            console.error('上传图片错误', e);
                                        }
                                    }
                                });
                            })
                        })
                    ).then(( ) => {

                        wx.hideLoading( );
                        wx.showToast({ 
                            title: '上传成功', 
                            icon: 'success', 
                            duration: 1500
                        });

                    }).catch( e => {
                        wx.hideLoading( );
                        wx.showToast({
                            icon: 'none',
                            title: '上传错误，请重试'
                        });
                        console.error('上传大错',e);
                    })
              },
          })
      },
    
      /** 删除图片 */
      deleteImg( event ) {
          const that = this;
          const { has, list } = this.data;
          const { typee, index } = event.currentTarget.dataset;
          if ( typee === 'hasBeenUploaded') {
              const temp = [ ...has ];
              temp.splice( index, 1 );
              this.setData({ has: temp });
          } else if ( typee === 'newUploaded') {
              const temp = [ ...list ];
              temp.splice( index, 1);
              this.setData({ list: temp });
          }
          setTimeout(( ) => {
              this.judgeIcon( );
              that.triggerEvent('change', [ ...this.data.list ]);
          }, 0);
      },

      /** 预览图片 */
      preview( event ) {
          wx.previewImage({
              current: event.currentTarget.dataset.url,
              urls: [ ...this.data.list ],
          })
      },

      /** 判断图标 */
      judgeIcon( ) {
          this.setData({
              showIcon: (this.data.max - this.data.list.length) > 0
          })
      },

      /** 公共方法 - 重置已上传的列表 */
      reset( ) {
          this.setData({
              list: [ ],
          });
          this.judgeIcon( );
      },

      /** 调整图片位置 */
      adjustPosition({ currentTarget }) {
          const { list } = this.data;
          const { index, direction } = currentTarget.dataset;

          const currentValue = list[ index ];
          const targetIndex = direction === 'right' ? index + 1 : index - 1;
          const targetValue = list[ targetIndex ];

          const temp = [ ...list ];
          temp.splice( index, 1, targetValue );
          temp.splice( targetIndex, 1, currentValue );

          this.setData({
              list: temp
          });

          this.triggerEvent('change', temp );
      }

    },

    attached: function ( ) {
        this.setData({
            list: [ ...this.data.hasBeenUploaded ]
        });
        this.fetchIAC( );
        this.judgeIcon();
    }
})
