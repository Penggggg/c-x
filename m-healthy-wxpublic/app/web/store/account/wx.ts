import { httpv2 } from '../../service/httpv2';
import { observable, action, autorun } from 'mobx';

/** 微信数据的store */
export default class Wx {

    /** 客户端ip */
    @observable ip = '';

    /** 加载中 */
    @observable loading = true;

    /** 是否已经绑定过 */
    @observable hasBeenBound = false;

    /** 微信相关账号信 */
    @observable data: App.wxAccount = {
        appid: '',
        openid: '',
        avatar: ''
    };

    /** 系统账号相关信息 */
    @observable systemUser: App.systemUser = {
        id: '',
        name: '',
        birthday: '',
        domainName: '',
        gender: '',
        userType: '',
        email: '',
        telephone: '',
        maritalStatus: null,
        identityCard: '',
        company: ''
    }

    /** 获取微信相关账号信息 */
    @action.bound getData( ) {
        httpv2.get<Api.get.wxData>({
            url: '/api/account/wx'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            const { appid, openid } = data;
            this.data = data;
            this.getSysData( appid, openid );
        });
    }

    /** 获取客户端ip */
    @action.bound getClientIp( ) {
        httpv2.get({
            url: `/api/common/client-ip`
        }).then(( res: any ) => {
            this.ip = res;
        });
    }

    /** 获取系统相关账号信息 */
    @action.bound getSysData( appId, openId ) {
        return httpv2.get<normalResult<App.systemUser>>({
            url: `/api/account/system?appId=${appId}&openId=${openId}`
        }, {
            loadMsg: '加载中...'
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { 
                return this.hasBeenBound = false;
            }
            this.loading = false;
            this.systemUser = data;
            this.hasBeenBound = !!data ? true : false;
            if ( !!data ) {
                localStorage.setItem( 'username$', data.name );
                localStorage.setItem( 'telephone$', data.telephone );
                localStorage.setItem( 'sysid$', data.id );
            }
            return data || { };
        });
    }

}
