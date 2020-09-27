import { observable, action } from 'mobx';
import { ETaskRole } from '../../util/enum';

/**
 * 用户角色
 */
class User {

    /** 账号信息 */
    @observable
    account: any = { };

    /** 任务权限 */
    @observable
    taskRole: ETaskRole = 0;

    /** 设置任务权限 */
    @action
    setRole( role: ETaskRole ) {
        console.log(`当前任务权限：${role}`)
        this.taskRole = role;
    }

    /** 设置账号信息 */
    @action
    setAccount( account: any ) {
        this.account = account;
    }
}

export default new User( );