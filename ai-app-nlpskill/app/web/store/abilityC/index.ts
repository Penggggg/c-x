import { observable, action } from 'mobx';

/**
 * 用户角色
 */
class AbilityC {

    /** 当前选中能力 */
    @observable
    selectAbility: any = localStorage.getItem('item')? JSON.parse(localStorage.getItem('item') ||'{}') : null;

    /** 设置当前选中能力 */
    @action
    setselectAbility = (ability: any) => {
        this.selectAbility = ability;
    }

}

export default new AbilityC( );