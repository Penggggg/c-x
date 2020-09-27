import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';

const app = getApp< IApp >( );

Page({

    data: {

        /** 登陆code */
        code: '',

        checked: false

    },

    runComputed( ) {
        computed( this, {


        }); 
    },

    jumpTo(e){
        console.log(e);
        navTo(`/pages/agreement/index?p=${e.currentTarget.dataset.page}`);
    },

    /** 获取电话授权、注册 */
    getPhoneAuth( e ) {
        const { code } = this.data;
        app.store.Auth
            .getUserPhoneAndRegister( e, true, code )
            .then( data => {
                if ( !!data ) {
                    app.store.Auth
                        .getSystemUser( )
                        .then(( ) => {
                            return app.store.Auth.judgeMarkerExpand();
                        }).then(() => {
                            return app.store.Auth.judgeDistributor();
                        }).then(() => {
                            wx.showToast({
                                title: '注册成功！'
                            });
                            wx.navigateBack({
                                delta: 1
                            })
                        });
                }
            })
            .catch( e => {
                this.login( );
            })
    },

    /** 未勾选注册协议 */
    noPass( ) {
        const { checked } = this.data;
        !checked && wx.showToast({
            icon: 'none',
            title: '请勾选注册协议'
        });
    },

    /** 获取code */
    login( ) {
        wx.login({
            success: res => {
                this.setData!({
                    code: res.code
                });
            }
        })
    },

    onCheck({ detail }) {
        const { value } = detail;
        this.setData!({
            checked: value.length > 0
        });
    },

    onLoad( ) {
        this.login( );
    },

    onShow( ) {

    }
})
