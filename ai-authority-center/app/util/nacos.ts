import path from 'path';
import * as aiUtil from '@cvte/ai-node-util';

const isDev = !String( process.env.NODE_ENV ).startsWith('prod');

const _dataID = isDev ? 
    'ai-authority-center-test' :
    'ai-authority-center-prod';

const _group = isDev ? 
    'ai-authority-center-test' :
    'ai-authority-center-prod';

export const getConfig = ( dataId = _dataID, group = _group ) => {
    return aiUtil.getNacos( 
        dataId, 
        group, 
        path.join( __dirname, '../../config/nacos.json')
    ).then( res => {
        if ( !res.ok ) {
            console.error(`
                ============ 获取navos错误 ==============
            `)
        }
        return res;
    })
}