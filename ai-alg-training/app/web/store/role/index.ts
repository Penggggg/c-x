import { observable, action } from 'mobx';
import { EUserRole } from '../../util/enum';
import { http } from '@cvte/ai-web-util/util';

/**
 * 用户角色
 */
class UserRole {

    /** 角色 */
    @observable
    role: undefined | EUserRole = undefined;

    /** 设置角色 */
    @action
    setRole( role: EUserRole ) {
        return http.post({
            data: { role },
            url: `/apis/common/role`
        }).then( res => {
            if ( res.status !== 200 ) { return; }
            this.role = role;
            return role;
        })
    }

    /** 初始化角色 */
    @action
    initRole( ) {
        return http.get< null | EUserRole >({
            url: `/apis/common/role`
        }).then( res => {
            const { status, data } = res;

            if ( status !== 200 ) { return; }
            if ( data !== null ) {
                this.role = data
            }
            return data;
        })
    }

}

export default new UserRole( );