import defaultConf from './default';

export default Object.assign({ }, defaultConf, {

    /** 业务请求接口 */
    host: {
        default: 'https://e-commerce-wa.cvte.com',
        mock: 'https://m-apps.cvte.com' ,// mock地址
        omsServer: 'https://itapis.cvte.com/crm' // oms上传地址
    },
    fridayId: 'e79db408e6a0d8cdd58cbcd537cf9a9b'

});