import path from 'path';
import * as aiUtil from '@cvte/ai-node-util';

const isDev = !String( process.env.NODE_ENV ).startsWith('prod');

const _dataID = isDev ? 
    'ai-app-nlpskill-test' :
    'ai-app-nlpskill-prod';

const _group = isDev ? 
    'ai-app-nlpskill-test' :
    'ai-app-nlpskill-prod';

export const getConfig = ( dataId = _dataID, group = _group ) => {
    return aiUtil.getNacos( 
        dataId, 
        group, 
        path.join( __dirname, '../../config/nacos.json')
    ).then( res => {
        console.log(`
            ============ navos 配置 ==============
        `)
        console.log( res.data )
        if ( !res.ok ) {
            console.error(`
                ============ 获取navos错误 ==============
            `)
        }
        return res;
    })
}