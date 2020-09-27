import defaultConf from './default';

export default Object.assign({ }, defaultConf, {

    /** 业务请求接口 */
    host: {
        default: 'http://127.0.0.1:7001',
        mock: 'https://m-apps.cvte.com', // mock地址
        omsServer: 'https://crmtest.cvte.com/framework' // oms上传地址
    },
    /** friday埋点上报id */ 
    fridayId: '47d6512370013790d11bb25bf29ce583'
});