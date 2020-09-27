import { observable, action, autorun } from 'mobx';
import Wx from './wx';

/** 账号相关的store */
class Account {

    /** 微信数据的store */
    wx = new Wx( );

}

export default new Account( );