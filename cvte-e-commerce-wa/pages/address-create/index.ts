import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { addressToFront, addressToBack } from '../../utils/util';

const app = getApp< IApp >( );

Page({

    data: {

        isIPhoneX: false,

        // id
        id: '',

        // 详情
        detail: null
    },

    runComputed( ) {
        computed( this, {

            // 表单
            formMeta$: function( ) {
                const { id } = this.data;
                return [
                    {
                        key: 'receiverName',
                        label: '收件人    ',
                        type: 'input',
                        max: 50,
                        width: '90rpx',
                        placeholder: '请输入收件人姓名',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '收件人不能为空'
                        }]
                    }, {
                        key: 'receiverTelephone',
                        label: '手机号码',
                        type: 'number',
                        placeholder: '请输入收件人手机号码',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '手机号码不能为空'
                        }, {
                            validate: val => !!val && String( val ).length === 11,
                            message: '请填写正确手机号码'
                          }]
                    }, {
                        key: 'area',
                        label: '所在地区',
                        type: 'area',
                        placeholder: '请选择省市区',
                        value: undefined,
                        initData: !!id ? false : true,
                        rules: [{
                          validate: val => !!val && val.length > 0,
                          message: '省市区不能为空'
                        }]
                    }, {
                        key: 'receiverAddress',
                        label: '详细地址',
                        type: 'input',
                        placeholder: '请输入详细地址',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '详细地址不能为空'
                        }]
                    }, {
                        key: 'isDefault',
                        label: '设为默认地址',
                        type: 'trueOrFalse',
                        value: undefined,
                    }
                ];
            }

        }); 
    },

    /** 拉取详情 */
    fetchDetail( id ) {
        if ( !id ) { return; }
        http({
            path: `/apis/address/detail/${id}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }

            const this_: any = this;
            const meta = addressToFront( data )
            const form1 = this_.selectComponent('#form');
            const { receiverName, receiverTelephone, receiverAddress, isDefault, receiverCountyName, receiverCountyCode,
                receiverProvinceName, receiverProvinceCode, receiverCityCode, receiverCityName,  } = data;

            this.setData!({
                detail: meta
            });

            const addressDefault = [
                {
                    areaCode: receiverProvinceCode,
                    areaName: receiverProvinceName
                }, {
                    areaCode: receiverCityCode,
                    areaName: receiverCityName
                }, {
                    areaCode: receiverCountyCode,
                    areaName: receiverCountyName 
                }
            ]

            // 设置表单
            form1.set({
                receiverName,
                receiverTelephone,
                receiverAddress,
                isDefault: isDefault === '1' ? true : false,
                area: addressDefault
            });

        });
    },

    /** 设置为默认 */
    setDefault( id ) {
        if ( !id ) { return; }
        http({
            method: 'PUT',
            path: `/apis/address/set-default/${id}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            wx.showToast({
                title: this.data.id ? '更新成功!' : '创建成功！'
            });
        });
    },

    /** 表单更改 */
    onFormChange( e ) {

    },

    /** 删除 */
    onDelete( ) {
        const { id } = this.data;
        if ( !id ) { return; }

        wx.showModal({
            title: '提示',
            content: '确定删除吗?',
            success (res) {
                if ( !res.confirm) { return;}
                http({
                    method: 'DELETE',
                    path: `/apis/address/remove?ids=${id}`
                }).then( res => {
                    const { status, data } = res;
                    if ( status !== 200 ) { return; }
                    wx.showToast({
                        title: '删除成功'
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                });
            }
        });

    },

    /** 创建 */
    onCreate( reqData ) {
        http({
            data: reqData,
            method: 'POST',
            path: `/apis/address/save`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            wx.showToast({
                title: '创建成功'
            });
            this.setData!({
                detail: data
            });
            if ( data.isDefault === '1' ) {
                this.setDefault( data.id );
            }
            app.set$('Form.lastCreateAddressId', data.id );
            wx.navigateBack({
                delta: 1
            });
        });
    },

    /** 编辑 */
    onEdit( reqData ) {
        http({
            data: reqData,
            method: 'PUT',
            path: `/apis/address/update`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            wx.showToast({
                title: '更新成功'
            });
            if ( data.isDefault === '1' ) {
                this.setDefault( data.id );
            }
            app.set$('Form.lastCreateAddressId', data.id );
            wx.navigateBack({
                delta: 1
            });
        });
    },

    /** 提交 */
    onSubmit( ) {
        const this_: any = this;
        const { detail } = this_.data;
        const { result, data } = this.onCheck( );

        if ( !result ) { return; }
        let reqData = {
            // ...this.transferToBack( data ),
            ...addressToBack( data ),
            memberId: app.store.Auth.sysUserInfo.id
        };

        if ( !!detail ) {
            reqData = {
                ...reqData,
                id: detail.id,
                dedupKey: String(new Date().getTime())
            };
        }

        if ( !detail ) {
            this.onCreate( reqData )
        } else {
            this.onEdit( reqData );
        }
        
    },

    /** 检查 */
    onCheck( ) {
        const this_: any = this;
        const form1 = this_.selectComponent('#form');
        const res = form1.getData( );

        if ( !res.result ) {
            wx.showToast({
                icon: 'none',
                title: '请完善表单',
            });
        }

        return {
            ...res
        }
    },

    /** 转换数据, 把组件数据，转换为后台字段 */
    transferToBack( meta ) {
        let result = { ...meta };
        const area = [ ...meta.area ];
        const provice = area[ 0 ];
        const city = area[ 1 ];
        const county = area[ 2 ];

        if ( !!provice ) {
            result = {
                ...result,
                receiverProvinceCode: provice.value,
                receiverProvinceName: provice.label
            };
        }

        if ( !!city ) {
            result = {
                ...result,
                receiverCityCode: city.value,
                receiverCityName: city.label
            };
        }

        if ( !!county ) {
            result = {
                ...result,
                receiverCountyCode: county.value,
                receiverCountyName: county.label
            };
        } 

        result = {
            ...result,
            isDefault: result.isDefault ? '1' : '0'
        }

        return result;
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Common.isIPhoneX', v => {
             // 兼容iponeX
            this.setData!({
                isIPhoneX: v
            }) 
        });
    },

    onLoad( options ) {
        const { id } = (options as any);

        this.watchApp( );
        this.runComputed( );
        this.fetchDetail( id );

        this.setData!({
            id
        });

        setTimeout(( ) => {
            // 表单优化
            this.setData!({
                inited: true
            });
        }, 100 );
    },

    onShow( ) {

    }
})
