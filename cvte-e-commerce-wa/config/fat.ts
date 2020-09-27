import defaultConf from './default';

export default Object.assign({ }, defaultConf, {
    /** 业务请求接口 */
    host: {
        default: 'https://e-commerce-wa-test.cvte.com',
        mock: 'https://m-apps.cvte.com', // mock地址
        omsServer: 'https://crmtest.cvte.com/framework' // oms上传地址
    },
    fridayId: '7c7d88f30c309d34d79e160379762257'
});