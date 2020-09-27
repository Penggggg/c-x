import { http } from '../../utils/http';
import { watch } from '../../utils/watch';
import { cloudHttp } from '../../utils/cloudHttp';
import config from '../../config/index';
import { StorageKey } from '../../utils/constant';


/**
 * @deprecated
 * 登陆的整体流程
 * 
 */
class Auth {

    /** 当前登陆人的openid */
    public openid = '';

    /** 是否为iPoneX */
    public isIPhoneX = false;

    /** 是否用户授权了 */
    public isUserAuth = false;

    /** 是否为市场拓展员 */
    public isMarkerExpand = false;

    /** 是否为分销员 */
    public isDistributor = false;

    /** 微信用户信息 */
    public wxUserInfo!: wx.UserInfo;

    /** 微信用户设备信息 */
    public wxUserDeviceInfo: any = null;

    /** 后台用户信息 */
    public sysUserInfo: any = null;

    /** 初始化授权状态 */
    public init( ) {
        wx.getSetting({
            success: res => {
                console.log('【授权状态】', res.authSetting );
                // 是否已经授权
                const isUserAuth = res.authSetting['scope.userInfo'];
                this.isUserAuth = isUserAuth === undefined ? false : isUserAuth;
            }
        });
    }

    /** 获取用户设备信息 */ 
    public getSystemInfo( ){
        wx.getSystemInfo({
            success: (res) => {
              console.log('结果啊 ', res);
              this.wxUserDeviceInfo = res;
              res.model.indexOf('iPhone X') >= 0 && (this.isIPhoneX = true);
            }
          })
    }

    /** 获取用户授权、微信用户信息 */
    public getUserAuth( ) {
        return new Promise( r => {
            wx.getUserInfo({
                success: res => {
                    this.isUserAuth = true;
                    this.wxUserInfo = res.userInfo;
                }
            });
        });
    }

    /** 获取后台的用户信息 */
    public getSystemUser( openid = this.openid, appid = config.app.appId ) {
        return http({
            path: `/apis/member/node/find-visitor?wxAppId=${appid}&wxOpenId=${openid}`
        }).then( res => {
            const  { status, data } = res;
            if ( status !== 200 ) { return false; }

            this.sysUserInfo = data;

            // 1、还需要存起来，以便http模块访问
            wx.setStorageSync( StorageKey.SYSTEM_USER_INFO, JSON.stringify( data ));

            /**
             * !todo
             * 2、再调一下，memberid 绑定 访客的接口
             */

            return true;
        })
    };

    /** 
     * 获取用户手机授权
     * 并进行注册
     */
    public getUserPhoneAndRegister( e, register = false, code = '' ) {
        return new Promise(( r, j ) => {

            if ( !e.detail.encryptedData ) {
                return j( );
            }

            const { encryptedData, iv } = e.detail;

            return this.sysRegister({
                iv,
                code,
                encryptedData
            })
            .then( e => {
                if ( !!e ) {
                    r( e );
                } else {
                    j( );
                }
            });
        
            // cloudHttp({
            //     url: 'auth_jslogin',
            //     data: {
            //         code
            //     },
            //     success: res => {

            //         if ( res.status !== 200 ) { return j( );}

            //         const sessionKey = res.data;
            //         const { encryptedData, iv } = e.detail;

            //         cloudHttp({
            //             url: 'auth_decrypPhone',
            //             data: {
            //                 iv,
            //                 sessionKey,
            //                 encryptedData
            //             },
            //             success: res => {

            //                 if ( res.status !== 200 ) { return j( );}
            
            //                 const { countryCode, phoneNumber, purePhoneNumber } = res.data;
            //                 if ( !register ) {
            //                     return r( res.data );
            //                 } else {
            //                     this.sysRegister({
            //                         telephone: phoneNumber,
            //                         areaCode: countryCode
            //                     })
            //                     .then( e => {
            //                         if ( !!e ) {
            //                             r( e );
            //                         } else {
            //                             j( );
            //                         }
            //                     });
            //                 }
            //             },
            //             error: ( ) => { j( );}
            //         });
            //     },
            //     error: ( ) => { j( );}
            // });
        });
    }

    /** 会员注册 */
    public sysRegister( data ) { 

        // 拿到全局的邀请人memberId
        const inviterId = wx.getStorageSync( StorageKey.REGISTER_INVITER );
        const inviterSourceType = wx.getStorageSync( StorageKey.REGISTER_INVITER_TYPE );

        const reqData = {
            ...data,
            sourceSys: 'SYS',
            sourceType: 'WX',
            inviterId: inviterId || '',
            inviterSourceType: inviterSourceType || '',
            name: `CV${(Math.random( ) * 9999).toFixed( 0 )}`,
            memberWxRel: {
                wxOpenId: this.openid,
                wxAppId: config.app.appId
            }
        };
        return http({
            data: reqData,
            method: 'post',
            path: `/apis/member/node/register`
        }).then( async res => {
            const { status, data } = res;
            if ( status !== 200 ) { return null; }
            this.sysUserInfo = data;
            return data;
        });
    }

    /**
     * 获取openid
     * 并进行临时访客的创建
     */
    public getOpenid( ) {
        return cloudHttp({
            url: 'auth_login',
            success: res => {
                const { status, data } = res;
                if ( status !== 200 ) { return; }
                this.openid = data;
            }
        });
    }

    /** 绑定访客跟memberid */
    public bindVisitor( ) {
        // 这里加setTimeout，是因为 inviterId 由各页面获取并存到 storage 中，而此方法是在小程序打开那一刻就执行了
        setTimeout(( ) => {
            const inviterId = wx.getStorageSync( StorageKey.REGISTER_INVITER );
            if ( !inviterId ) { return; }

            http({
                data: {
                    inviterId,
                    wxOpenId: this.openid,
                    wxAppId: config.app.appId
                },
                method: 'POST',
                path: `/apis/member/bind-visitor`
            }).then( res => {
    
                const { data, status } = res;
                if ( status !== 200 ) { return; }
    
            });
        }, 5000 );
    }

    /** 判断是否为市场拓展员 */
    public judgeMarkerExpand( ) {
        const { id } = this.sysUserInfo;
        if ( !id ) { return; }
        return http({
            path: `/apis/partner/is-market-expand-user`
        }).then( res => {

            const { data, status } = res;
            if ( status !== 200 ) { return; }

            this.isMarkerExpand = data;
        });
    }

    /** 判断是否为合伙人 */
    public judgeDistributor( ) {
        const { id } = this.sysUserInfo;
        if ( !id ) { return; }
        return http({
            path: `/apis/distributor/checkIsDistributor`
        }).then( res => {

            const { data, status } = res;
            if ( status !== 200 ) { return; }

            this.isDistributor = data;
        });
    }

}

export default watch<Auth>( 'Auth', new Auth( ));
 