import * as cloud from 'wx-server-sdk';
import * as TcbRouter from 'tcb-router';
import * as axios from 'axios';
import { appConf } from './config';
import * as WXBizDataCrypt from './RdWXBizDataCrypt';

cloud.init({
    env: process.env.cloud
});


/** 登陆获取openid */
const login = async event => {
    return {
        status: 200,
        data: event.userInfo.openId
    };
};

/** code 2 seesion */
const code2session = async event => {
    try {
        const { code } = event.data;
        
        const opt = {
            js_code: code,
            appid: appConf.appid,
            secret: appConf.appSecret,
            grant_type: 'authorization_code'
        };

        const req$ = await (axios as any)({
            method: 'get',
            params: opt,
            url: 'https://api.weixin.qq.com/sns/jscode2session'
        });

        if ( !!req$.errcode ) {
            return {
                status: req$.errcode,
                message: req$.errmsg
            }
        } else {
            return {
                status: 200,
                data: req$.data.session_key
            }
        }
    } catch ( e ) {
        return { status: 500 };
    }
};

/** 解密电话号码 */
const decrypPhone = async event => {
    try {
        const { encryptedData, iv, sessionKey } = event.data;
        const pc = new WXBizDataCrypt( appConf.appid, sessionKey );
        const data = pc.decryptData( encryptedData, iv );
        return {
            data,
            status: 200
        }

    } catch ( e ) {
        console.log('解密电话号码失败', typeof e === 'string' ? e : JSON.stringify( e ))
        return { status: 500, message: '获取电话失败，请重试' };
    }
}

/** 生成小程序二维码 */
const createRQCode = async event => {
    try {
        const { page, scene } = event.data;
        const result = await cloud.openapi.wxacode.getUnlimited({
            page,
            scene: scene || 'none' // scene为必填
        });

        if ( result.errCode !== 0 ) {
            throw result.errMsg
        }

        return {
            status: 200,
            data: result.buffer
        }
    } catch ( e ) {
        return {
            status: 500,
            message: typeof e === 'string' ? e : JSON.stringify( e )
        }
    }
};

export const main = async ( event, ctx ) => {

    const app = new TcbRouter({ event });
    const $url = event.$url;

    console.log('======= request ====== ', $url );

    switch ( $url ) {
        case 'login': {
            return login( event );
        }
        case 'jslogin': {
            return code2session( event );
        }
        case 'decrypPhone': {
            return decrypPhone( event );
        }
        case 'qrCode': {
            return createRQCode( event );
        }
        default: {
            return { 
                status: 500,
                message: 'not exsited'
            };
        }
    }

}

