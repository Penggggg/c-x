import Auth from './store/auth/index';
import Cloud from './store/cloud/index';
import Form from './store/form/index';
import Common from './store/common/index';

export declare interface IApp {

    /** 全局store */
    store: {
        Cloud: typeof Cloud
        Auth: typeof Auth
        Form: typeof Form
        Common: typeof Common
    },

    /** 全局的监听方法 */
    watch$: ( key: string, cd: ( v1: any, v2?: any ) => void ) => void

    /** 数据埋点 */ 
    dataBury$: (data) => void,

    /** 获取uuid */ 
    getUuid$: () => void,

    /** 全局store的设置方法 */
    set$: ( key: string, val: any ) => void
}