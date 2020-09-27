import { observable, action, autorun } from 'mobx';
import Order from './order';

/** 账号相关的store */
class Orders {

    /** 微信数据的store */
    order = new Order( );

}

export default new Orders( );