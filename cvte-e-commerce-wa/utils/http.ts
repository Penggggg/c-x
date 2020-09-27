import config from '../config/index';
import allEnvConfig from '../config/all';
import { StorageKey } from '../utils/constant';

/** 请求参数 */
const httpParam = {
    env: '',
    method: 'GET',
    header: { },
    path: '',
    url: config.host.default,
    data: { },
    loadingMsg: '加载中....',
    errMsg: '加载错误，请重试',
    allUrl: ''
};

export const http: ( p: Partial< typeof httpParam >) => Promise<{ status: number, data?: any, msg?: any }> = params$ => {

    return new Promise( resolve => {
        
        const params = {
            ...httpParam,
            ...params$
        }
        const { loadingMsg, errMsg, path, env } = params;
        const url = env && allEnvConfig[ env ] ? 
            allEnvConfig[ env ].host.default :
            params.url;
        let data = params.data
    
        loadingMsg !== 'none' && wx.showLoading({
            title: loadingMsg,
            mask: true
        });
    
        const getError = ( msg: string ) => {
            wx.showToast({
                icon: 'none',
                title: msg,
                duration: 2000
            });
        }

        const meta =  wx.getStorageSync( StorageKey.SYSTEM_USER_INFO );
        const sysUser = meta ? JSON.parse( meta ) : null

        let header = Object.assign({ }, params$.header );
        if ( !!sysUser && sysUser.templateId ) {
            header = {
                'wa-jwt': sysUser.jwt || '',
                // 'wa-uid': sysUser.id,
                // 'wa-tempid': sysUser.templateId,
                // 'wa-name': sysUser.name ? 
                //     encodeURIComponent( sysUser.name ) : 
                //     sysUser.id ? 
                //         encodeURIComponent('会员') : 
                //         encodeURIComponent('访客'),
                // TODO: 这里是测试优惠券的，要删除
                // 'wa-jwt': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmMmMwYjQ1NC1hMjBkLTRhYWEtOTRmZi0zM2RkNTVkYmViOWEiLCJhdWQiOiI4M2I1MThjZi03NzQ2LTQ4ODgtYmNhNS0yZTIxZGYyZGVmZmUiLCJpc3MiOiI5YzBiNmM4My0zY2ZiLTQxYzEtYWY4My1mYWY1OWFhZGJlMGUiLCJleHAiOjE1Njk3MzMzMTgsImlhdCI6MTU2OTY0NjkxODk2NywibWFwIjp7ImlkIjoiZjJjMGI0NTQtYTIwZC00YWFhLTk0ZmYtMzNkZDU1ZGJlYjlhIiwidGVtcGxhdGVJZCI6ImJlYzY1ZmY1ZGU5ZjQyMjY5NzkwMjkxNTcxODk5OWJkIiwibmFtZSI6IkNWOTU3MiJ9LCJqdGkiOiI1MjQ4ZjA1ZGY4NGU0YTYyYTY2MmRkM2MyNGMyNGQ4ZCJ9.ZSX58m9-p3ubi0FFxWamlrCHbYMRs10qF13VaUkCuCKg630_OHr9KjVSTYQ10hT606w5guJt9w5p4kU2mHJyPcpJ7InRLkCoFq_i6lvAE9hPemTwmNePmdLMzD2fWi_-IT1YN6cVpjmHjS8HC7wIg7Sv1SAv_q9QkZgPqAuj6BE',
                // 'wa-jwt': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIyMjIyIiwiYXVkIjoiZmZiNzJhZjYtZjQ3MC00MmE2LWEyYzMtODVjODEzNjIzZjhlIiwiaXNzIjoiOWMwYjZjODMtM2NmYi00MWMxLWFmODMtZmFmNTlhYWRiZTBlIiwiZXhwIjoxOTI4NTM5ODk3LCJpYXQiOjE1Njg1Mzk4OTczNTEsIm1hcCI6eyJpZCI6IjIyMjIiLCJuYW1lIjoiMjIyMiJ9LCJqdGkiOiIwNTk3ZWYwZTc5MWE0OWFmYWEwYWNkNDljNWRiYTRhMiJ9.NhaIg5V8SIBqGMgosCmx0iuKyJSWI6A_foa6w8v9heqGYiGNvlH2svkNRLoh71m4SvD_kYNzg9TkvP-DblJ1cdNajRTCQmpbJ06H131AltPp9F_jS89DvSUQxxmVcHV-BJaiyLmsxcXpIxusMOmK5DqQnuGkMrLmJTgIE4GyRv8',
                // 'wa-jwt': 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJocG9ydGFsX2h1YW1lbmd4aW5nIiwiYXVkIjoiZmZiNzJhZjYtZjQ3MC00MmE2LWEyYzMtODVjODEzNjIzZjhlIiwiaXNzIjoiOWMwYjZjODMtM2NmYi00MWMxLWFmODMtZmFmNTlhYWRiZTBlIiwiZXhwIjoxODI5ODkxODEyLCJpYXQiOjE1NjgxODI1MDkwNDAsIm1hcCI6eyJpZCI6IjAxM2M2MjNiMzViMjRjZmNhZWFlZTA2MjI4YWVlNDE4IiwibmFtZSI6IuiuuOWuquaIkCIsImVtYWlsIjoieHVhaXhhbmNoZW5nQGN2dGUuY29tIiwiaG9zdCI6IjEyNy4wLjAuMSJ9LCJqdGkiOiIxZjIzMWIwY2NiNWY0NGJmYmIyZGM1MDkxNDAxN2U4NCJ9.u45APHwblxTXDXG9Rx2TRafR_btXp_FCBo2ZjG0mraYGEeFBXr239cFV_h_SnuTeuEsnsI4E3eHuKNs5YkfxGq_0oR7aKOhufsgAyZ8p-ZrxSXQaKaWz1SZJLBvQCBEB43TOWvFXfuR7apMHz4djRMI1dmOug4lcBk43vgYNC0g'

            }
        }

        console.log('-------- 发送请求 --------');
        console.log( `${params$.allUrl ? params$.allUrl : url + path }` );

        (wx as any).request({
            data,
            header,
            method: params$.method ? params$.method.toUpperCase( ) : 'GET',
            url: params$.allUrl || `${url}${path}`,
            success: (res: any) => {
                const { status, msg, message } = res.data;

                const hasError =  Number( status ) !== 200 && Number( status ) !== 0;
                if ( hasError ) {
                    // console.info(`【---- Error : ${path}】`, res.data )
                    errMsg !== 'none' && getError( message || msg || errMsg );
                    console.error(`Http Error：${url}${path} ${JSON.stringify( res.data )}`)
                } else {
                    loadingMsg !== 'none' && wx.hideLoading({ });
                    // console.log(`【---- Request Success :${path}】`, data, res.data.data );
                }

                console.log('-------- 返回结果 --------');
                console.log(`${JSON.stringify( res.data )}` );
                resolve({
                    msg,
                    status: hasError ? 500 : 200,
                    data: res.data.data
                })
            },
            fail: ( e ) => {
                getError( '网络错误' );
                console.log('出错了', e);
                resolve({
                    status: 500
                });
            }
        });
    });
}