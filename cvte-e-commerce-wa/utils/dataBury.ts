import { store$ } from '../store/index';
import config from '../config/index';

interface type{
    $code: string,
    $ts: number
}

export default (data: Array<{ [key: string]: string | number } & type>) => {
    const { platform } = store$.Auth.wxUserDeviceInfo;
    // 当前分享人的地址区域信息
    const {country='' , province='' , city=''} = store$.Auth.wxUserInfo || {};
    // console.log(type);
    (wx as any).request({
        data:{
            $cp: {
                platform,
                channelType: '小程序',
                $tid: store$.Auth.sysUserInfo.id ? store$.Auth.sysUserInfo.id: store$.Auth.sysUserInfo.templateId,
                userAddress: `${country}${province}${city}`
            },
            $sp: data
        },
        header: {
           'X-Friday-Appid': config.fridayId,
           'X-Friday-Time': new Date().getTime(),
           'X-Friday-Ver': 'V1'
        },
        method: 'POST',
        url: 'https://myou.cvte.com/friday/agent/api/app/v2/report',
        success: (res: any) => {
            const { code, message } = res.data;

            const hasError =  Number( code ) !== 0;
            if ( hasError ) {
                console.info(`【上传埋点信息 ---- Error】`, message )
            } else {
                console.log('【上传埋点信息】',res.data, '【fridayId】:', config.fridayId);
            }
        },
        fail: ( e ) => {
            // getError( '网络错误' );
            // console.log('出错了', e);
            // resolve({
            //     status: 500
            // });
        }
    });
}