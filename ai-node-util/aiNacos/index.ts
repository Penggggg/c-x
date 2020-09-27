const nacos = require('nacos'); 
import path from 'path';
import fs from 'fs';

type TNacosResult = {
    ok: boolean,
    createdFile?: boolean
    data: {
        [ key: string ]: any
    },
}

/**
 * 
 * @param dataId nacos Data Id
 * @param group nacos Group
 * @param filePath 文件生成的路径、名称，如：__dirname + './config/nacos.json'
 * @param serverAddr nacos服务IP（含端口）不填默认为：10.22.21.38:8848，查看地址 http://nacos.research.cvte.cn/
 */
export const getNacos = ( dataId: string, group: string, filePath = '', serverAddr?: string ): Promise< TNacosResult > => {
    return new Promise( res => {
        if ( !dataId || !group ) {
            console.error(`
                ============== Nacos Error ================
            `);
            console.error(`
                请传入dataId、group、filePath
            `);
            return res({
                data: { },
                ok: false
            });
        }
    
        const client = new nacos.NacosConfigClient({
            serverAddr: serverAddr || '10.22.21.38:8848',
        });
    
        client.subscribe({
            dataId,
            group,
        }, ( c: string )=> {
            let config = { };
            try {
                config = JSON.parse( c );
            } catch ( e ) {
                config = c;
            }
    
            return res({
                ok: true,
                data: config,
                createdFile: creatJSON( filePath, config )
            });
        });
    })
}

/**
 * 
 * @param filePath 文件路径
 * @param data 文件信息
 */
function creatJSON( filePath: string, data: string | object ): boolean {

    if ( !filePath ) { return false; }
    if ( !!filePath && !filePath.endsWith('.json')) {
        console.error(`
            ============== Nacos Error ================
        `);
        console.error(`
            filePath要以 .json结尾
        `);
        return false;
    };

    const filePathArr = filePath.split('/');
    const fileName = filePathArr[ filePathArr.length - 1 ];
    
    // 创建目录
    mkDirSync( path.dirname( filePath ));

    // 创建文件
    fs.writeFileSync( filePath, typeof data === 'object' ? JSON.stringify( data ) : data );
    return true; 
}

/**
 * 
 * @param dirname 递归创建目录
 */
function mkDirSync( dirname: string ) {
    if ( fs.existsSync( dirname )) {
        return true;
    } else {
        // 如果上级存在
        if ( mkDirSync( path.dirname( dirname ))) {
            // 创建本级
            fs.mkdirSync( dirname );
            return true;
        }
    }
}

