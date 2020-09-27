import { httpv2 } from '../../service/httpv2';
import { observable, action, autorun } from 'mobx';

/** 全局的store */
export default class Store {

    /** 套餐详情中的ext */
    packageDetail: any = {
        ext: null
    }

}
