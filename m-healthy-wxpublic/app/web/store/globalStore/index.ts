import { observable, action, autorun } from 'mobx';
import Store from './store';

/** 全局的store */
class GlobalStore {

    /** 全局数据的store */
    Store = new Store( );

}

export default new GlobalStore( );