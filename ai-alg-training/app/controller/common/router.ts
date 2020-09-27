import fs from 'fs';
import path from 'path';
import KoaRouter from 'koa-router';
import * as aiUtil from '@cvte/ai-node-util';
import Ctrl from './index';

const nacosConf = JSON.parse( 
    fs.readFileSync( 
        path.join( __dirname, '../../../config/nacos.json'), {
            encoding: 'utf8'
        })
);

export default ( 
    router: KoaRouter, 
    prefix = '/apis/common' 
) => {

    const { hosts, ssoNext, authCookie } = nacosConf;

    router.get(`${prefix}/ai-login`, aiUtil.aiLogin.code2Session(`${hosts.target}/login`)),

    router.get(`${prefix}/ai-logout`, aiUtil.aiLogin.logout({ ssoNext, cookieName: authCookie, logoutUrl: `${hosts.target}/logout` })),

    router.get(`${prefix}/role`, Ctrl.getRole ),

    router.post(`${prefix}/role`, Ctrl.setRole ),

    router.get(`${prefix}/hehe`, Ctrl.test ),

    router.get(`${prefix}/org/dimension`, Ctrl.orgDimension ),

    router.get(`${prefix}/org/tree`, Ctrl.orgTree ),

    router.get(`${prefix}/org/users`, Ctrl.orgUser )
};