import fs from 'fs';
import path from 'path';
import KoaRouter from 'koa-router';
import * as aiUtil from '@cvte/ai-node-util';
import Ctrl from './index';

const nacosConf = JSON.parse( 
    fs.readFileSync( 
        path.join( __dirname, '../../../config//nacos.json'), {
            encoding: 'utf8'
        })
);

export default ( 
    router: KoaRouter, 
    prefix = '/apis/common' 
) => {

    const { hosts, ssoNext, authCookie, minio } = nacosConf;

    router.get(`${prefix}/ai-login`, aiUtil.aiLogin.code2Session(`${hosts.target}/login`)),

    router.get(`${prefix}/ai-logout`, aiUtil.aiLogin.logout({ ssoNext, cookieName: authCookie, logoutUrl: `${hosts.target}/logout` }))

    router.post(`${prefix}/object-upload`, aiUtil.aiMinio.post( minio ))
};